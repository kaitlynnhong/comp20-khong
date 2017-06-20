var myLat = 0, myLng = 0;
var request = new XMLHttpRequest();
//created your location object for center 
var me = new google.maps.LatLng(myLat, myLng);

//image objects for unique line icons, sized appropriately
var image_r = {
	url: 'https://cdn0.iconfinder.com/data/icons/transport-14/512/Train_Red.png',
	scaledSize: new google.maps.Size(25,25),
	color: '#FF0000',
};

//object containing array of other red stations
var red_stations = [
	['South Station', 42.352271, -71.05524200000001, 22],
	['Andrew Station', 42.330154, -71.057655, 21],
	['Porter Square', 42.3884, -71.11914899999999, 20],
	['Harvard Square', 42.373362,  -71.118956, 19],
	['JFK/UMass', 42.320685, -71.052391, 18],
	['Savin Hill', 42.31129, -71.053331, 17],
	['Park Street', 42.31129, -71.053331, 16],
	['Broadway', 42.342622, -71.056967, 15],
	['North Quincy', 42.275275, -71.029583, 14],
	['Shawmut', 42.29312583, -71.06573796000001, 13],
	['Davis', 42.39674, -71.121815, 12],
	['Alewife', 42.395428, -71.142483, 11],
	['Kendall/MIT', 42.36249079, -71.08617653, 10],
	['Charles/MGH', 42.361166, -71.070628, 9],
	['Downtown Crossing', 42.355518, -71.060225, 8],
	['Quincy Center', 42.251809, -71.005409, 7],
	['Quincy Adams', 42.233391, -71.007153, 6],
	['Ashmont', 42.284652, -71.06448899999999, 5],
	['Wollaston', 42.2665139, -71.0203369, 4],
	['Fields Corner', 42.300093, -71.061667, 3],
	['Central Square', 42.365486, -71.103802, 2],
	['Braintree', 42.2078543, -71.0011385, 1]
]

//map type and center options
var myOptions = {
    zoom: 15, 
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var infowindow = new google.maps.InfoWindow();
var infowindow2 = new google.maps.InfoWindow();
var closest = {};
var station_marker;

//function init()
//purpose: generate new map object in the 'map_canvas' div using myOptions specifications		
function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    get_location();

}

function get_location()
{
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.");
	}
}

//function: renderMap()
//purpose: creates center of map around marker at your current location
function renderMap()
{
	//center map around your current location
	me = new google.maps.LatLng(myLat, myLng);
	map.panTo(me);

	//render redline markers and polyline 
	red_station_markers();
	render_redline();

	//create marker of current location
	var me_marker = new google.maps.Marker({
		position: me,
	});
	me_marker.setMap(map);

	google.maps.event.addListener(map, 'click', find_closest_marker);
	closest = find_closest_marker();

	var contentString = "<p>You are here!</p>" + "<p>The closest MBTA Redline Station is:</p>" + closest.station_name 
						+ ", <p></p>" + closest.closest_distance + " miles away.";
	infowindow = new google.maps.InfoWindow({
    	content: contentString
  	});

	google.maps.event.addListener(me_marker, 'click', function() {
					infowindow.open(map, me_marker);
	});

	closest_polyline();
}

function rad(x) {return x*Math.PI/180;}
function find_closest_marker()
{
    var R = 3956; // radius of earth in miles
    var distances = [];
    var closest = -1;
    for( i=0;i<red_stations.length; i++ ) {
        var mlat = red_stations[i][1];
        var mlng = red_stations[i][2];
        var dLat  = rad(mlat - myLat);
        var dLong = rad(mlng - myLng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(myLat)) * Math.cos(rad(myLat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }
	return {
		station_name: red_stations[closest][0],
		closest_distance: distances[closest],
		closest_lat: red_stations[closest][1],
		closest_lng: red_stations[closest][2]
	}
}

//function red_station_markers()
//creates multiple unique red icons for red line stations
function red_station_markers() 
{
	var i, j, k;

	for (i = 0; i < red_stations.length; i++) {  
        station_marker = new google.maps.Marker({
        	position: new google.maps.LatLng(red_stations[i][1], red_stations[i][2]),
        	map: map,
			icon: image_r,
			html: red_stations[i][0]
		});

    	google.maps.event.addListener(station_marker, 'click', function() {
			request = new XMLHttpRequest();
			request.open("GET", "https://defense-in-derpth.herokuapp.com/redline.json", true);

			console.log("opened request");
			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200) {
					var schedule = JSON.parse(request.responseText);
					console.log("create parsed schedule");

					var content = station_marker.html;
					for (j = 0; j < schedule.TripList.Trips.length; j++) {
						for (k = 0; k < schedule.TripList.Trips[j].Predictions.length; k++) {
							if (schedule.TripList.Trips[j].Predictions[k].Stop == station_marker.html) {
								content += "<p>" + schedule.TripList.Trips[j].Destination + " bound train</p> Arriving in " + (schedule.TripList.Trips[j].Predictions[k].Seconds)/60 + " minutes.";
								console.log("changed content");

								infowindow2.setContent(content);
								console.log("set content");
							}	
						}
					}
					infowindow2.open(map, station_marker);
					console.log("opened infowindow ");
				}
				else if (request.readyState == 4 && request.status != 200) {
					alert("Cannot display Red line schedule!");
				}
			}	
			request.send();		
			console.log("request sent");

		});
	}
}




//function: render_redline()
//renders red polyline following the red station coordinates
function render_redline()
{
	var redline_coords = [
		{lat: 42.395428, lng: -71.142483},
		{lat: 42.39674, lng: -71.121815},
		{lat: 42.3884, lng: -71.11914899999999},
		{lat: 42.373362, lng: -71.118956},
		{lat: 42.365486, lng: -71.103802},
		{lat: 42.36249079, lng: -71.08617653},
		{lat: 42.361166, lng: -71.070628},
		{lat: 42.35639457, lng: -71.0624242},
		{lat: 42.355518, lng: -71.060225},
		{lat: 42.352271, lng: -71.05524200000001},
		{lat: 42.342622, lng: -71.056967},
		{lat: 42.330154, lng: -71.057655},
		{lat: 42.320685, lng:  -71.052391},
		{lat: 42.275275, lng: -71.029583},
		{lat: 42.2665139, lng: -71.0203369},
		{lat: 42.251809, lng: -71.005409},
		{lat: 42.233391, lng:   -71.007153},
		{lat: 42.2078543, lng: -71.0011385}
	]
	
	var redline_coords_b = [
		{lat: 42.320685, lng:  -71.052391},
		{lat: 42.31129, lng:-71.053331},
		{lat: 42.300093, lng: -71.061667},
		{lat: 42.29312583, lng: -71.06573796000001},
		{lat: 42.284652, lng: -71.06448899999999}
	]

	var redline_1 = new google.maps.Polyline({
		path: redline_coords,
		geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
	});
	redline_1.setMap(map);

	var redline_2 = new google.maps.Polyline({
		path: redline_coords_b,
		geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
	});
	redline_2.setMap(map);
}

function closest_polyline()
{
	var coords = [
		{lat: myLat, lng: myLng},
		{lat: closest.closest_lat, lng: closest.closest_lng}
	]

	var polyline = new google.maps.Polyline({
		path: coords,
		geodesic: true, 
		strokeColor: '#3368FF',
		strokeOpacity: 1.0,
		strokeWeight: 2.5
	});
	polyline.setMap(map);
}

function update_infowindows(station_marker) 
{
	var i, j;
	request = new XMLHttpRequest();
	request.open("GET", "https://defense-in-derpth.herokuapp.com/redline.json", true);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var schedule = JSON.parse(request.responseText);

			for (i = 0; i < red_stations.length; i++) {
				for (j = 0; j < schedule.TripList.length; j++) {
					if (schedule.TripList.Trips[j].Predictions[j].Stop == red_stations[i][0]) {
						station_marker.html += "Train number: " + schedule.TripList.Trips[j].Position.Train + ", Arriving in " + (schedule.TripList.Trips[j].Predictions[j].Seconds)/60 + " minutes.";
					}
				}	
			}
		}
		else if (request.readyState == 4 && request.status != 200) {
				alert("Cannot display Red line schedule!");
		}
	}
	request.send();	
}

/*for (i = 0; i < red_stations.length; i++) {	

				busdata_string = red_stations[i][0] + "<p>Incoming trains at this station:</p>";

				for (j = 0; j < busdata.length; j++) {
					//syntax??? info window is not appearing 
					if(busdata.TripList.Trips[j].Predictions[j].Stop == red_stations[i][0]) {
						busdata_string += "Train number: " + busdata.TripList.Trips[j].Position.Train + ", Arriving in " + (busdata.TripList.Trips[j].Predictions[j].Seconds)/60 + " minutes.";
					}
				}

				infowindow2 = new google.maps.InfoWindow({
							content: busdata_string
				});
				
				
			}*/