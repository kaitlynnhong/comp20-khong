var myLat = 0, myLng = 0;
var request = new XMLHttpRequest();
var request2 = new XMLHttpRequest();
//created your location object for center 
var me = new google.maps.LatLng(myLat, myLng);

//image objects for unique line icons, sized appropriately
var image_r = {
	url: 'https://cdn0.iconfinder.com/data/icons/transport-14/512/Train_Red.png',
	scaledSize: new google.maps.Size(25,25),
	color: '#FF0000',
};
var train_image = {
	url: 'http://www.iconsdb.com/icons/preview/red/rounded-rectangle-xxl.png',
	scaledSize: new google.maps.Size(15, 15),
	color: '#FF0000',
}

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
var marker_array = [];

//function init()
//purpose: generate new map object in the 'map_canvas' div using myOptions specifications		
function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    get_location();

}

//functio: get_location
//determines current location using geolocation 
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
						+ ", <p></p>" + closest.closest_distance + " miles away." + "<p>Other Red Line Stations:</p>";
	
	//creating table of other distances in the infowindow 
	var tableString = "<table class=\"table.colorful\"><tr><th>Station Name</th><th>Distance Away in Miles</th></tr>";
	//sort array of objects 
	closest.distances_object.sort(function(a, b) {
    	return parseFloat(a.distance) - parseFloat(b.distance);
	});
	for (i = 1; i < closest.distances_object.length; i++)
	{	
		tableString += "<tr><td><b>" + closest.distances_object[i].name + "</b></td><td>" + closest.distances_object[i].distance + "</td></tr>";	
	}
	tableString += "</table>";

	infowindow = new google.maps.InfoWindow({
    	content: contentString + tableString
  	});
	google.maps.event.addListener(me_marker, 'click', function() {
					infowindow.open(map, me_marker);
	});

	//render polyline to closest station 
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

//function: rad and find_closest_marker
//uses haversine formula to determine distance between station closest to your location in miles
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
	//return object including data for the closest station to your location
	return {
		station_name: red_stations[closest][0],
		closest_distance: distances[closest],
		closest_lat: red_stations[closest][1],
		closest_lng: red_stations[closest][2],
		distances_object: [
			{distance: distances[0], name: red_stations[0][0]},
			{distance: distances[1], name: red_stations[1][0]},
			{distance: distances[2], name: red_stations[2][0]},
			{distance: distances[3], name: red_stations[3][0]},
			{distance: distances[4], name: red_stations[4][0]},
			{distance: distances[5], name: red_stations[5][0]},
			{distance: distances[6], name: red_stations[6][0]},
			{distance: distances[7], name: red_stations[7][0]},
			{distance: distances[8], name: red_stations[8][0]},
			{distance: distances[9], name: red_stations[9][0]},
			{distance: distances[10], name: red_stations[10][0]},
			{distance: distances[11], name: red_stations[11][0]},
			{distance: distances[12], name: red_stations[12][0]},
			{distance: distances[13], name: red_stations[13][0]},
			{distance: distances[14], name: red_stations[14][0]},
			{distance: distances[15], name: red_stations[15][0]},
			{distance: distances[16], name: red_stations[16][0]},
			{distance: distances[17], name: red_stations[17][0]},
			{distance: distances[18], name: red_stations[18][0]},
			{distance: distances[19], name: red_stations[19][0]},
			{distance: distances[20], name: red_stations[20][0]},
			{distance: distances[21], name: red_stations[21][0]}
		]
	}
}

//function red_station_markers()
//creates multiple unique red icons for red line stations
//creates updating infowindows with real time schedule 
function red_station_markers() 
{
	var i, j, k, p, m;

	for (i = 0; i < red_stations.length; i++) {  
        marker_array[i] = new google.maps.Marker({
        	position: new google.maps.LatLng(red_stations[i][1], red_stations[i][2]),
        	map: map,
			icon: image_r,
			name: red_stations[i][0],
		});

		var station_markers = marker_array[i];

 		google.maps.event.addListener(station_markers, 'click', function() {
			var theActualMarker = this;		//ensures 'this' referencing marker object
			request.open("GET", "https://cryptic-river-88103.herokuapp.com/redline.json", true);

			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200) {
					var schedule = JSON.parse(request.responseText);
					
					//nested for loops go through the json data compare to marker data 
					for (j = 0; j < schedule.TripList.Trips.length; j++) {
						for (k = 0; k < schedule.TripList.Trips[j].Predictions.length; k++) {
							if (schedule.TripList.Trips[j].Predictions[k].Stop == theActualMarker.name) {
								theActualMarker.name += "<p>Upcoming train: " + schedule.TripList.Trips[j].Destination + " bound train, arriving in " + Math.round((schedule.TripList.Trips[j].Predictions[k].Seconds)/60) + " minutes.</p>";
							}	
						}
					}	
					infowindow2.setContent(theActualMarker.name);
					infowindow2.open(map, theActualMarker);
				}	
				else if (request.readyState == 4 && request.status != 200) {
					alert("Cannot display Red line schedule!");
				}
			}	
			request.send();		
		});
	}

	/*markers for train positions
	var train_lat = [], train_lng = [], train_positions = [], train_dest = [];

	request2 = new XMLHttpRequest();
	request2.open("GET", "https://defense-in-derpth.herokuapp.com/redline.json", true);
	console.log("request 2 open");

	request2.onreadystatechange = function() {
		if (request2.readyState == 4 && request2.status == 200) {
			var schedule2 = JSON.parse(request2.responseText);
			console.log("parsed json");

			for (p = 0; p < schedule2.TripList.Trips.length; p++) {
				train_lat[p] = schedule2.TripList.Trips[p].Position.Lat;
				train_lng[p] = schedule2.TripList.Trips[p].Position.Long;
				train_positions[p] = {lat: train_lat, lng: train_lng};
				train_dest[p] = schedule2.TripList.Trips[p].Destination;
				console.log("created variables");
			}	
		}	
		else if (request2.readyState == 4 && request2.status != 200) {
			alert("Cannot display Red line trains!");
		}	
	}
	request2.send();

	var train_marker_array = [];
	for (m = 0; m < train_positions.length; m++) {
		train_marker_array[m] = new google.maps.Marker({
        	position: new google.maps.LatLng(train_lat[m], train_lng[m]),
        	map: map,
			title: train_dest[m] + " bound train",
			icon: train_image
		});
	}*/
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
