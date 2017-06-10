var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var image = {
		url: 'http://www.jiekeyou.com/wp-content/uploads/2014/07/public-transport-icon.png',
		scaledSize: new google.maps.Size(25,25)
	};
var south_station = new google.maps.LatLng(myLat, myLng);
var red_stations = [
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

var myOptions = {
    zoom: 15, 
	center: south_station,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map;
var infowindow = new google.maps.InfoWindow();
			
function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    renderMap();

}
			
function renderMap()
{
	myLat = 42.352271;
    myLng = -71.05524200000001;
    south_station = new google.maps.LatLng(myLat, myLng);
	map.panTo(south_station);

	var south_marker = new google.maps.Marker({
		position: south_station,
		title: "South Station, Boston, MA",
		icon: image
	});
	south_marker.setMap(map);

	google.maps.event.addListener(south_marker, 'click', function() {
		infowindow.setContent(south_marker.title);
		infowindow.open(map, south_marker);
	});

	red_station_markers();
	render_redline();
}

function red_station_markers() 
{
	var station_marker, i;

	for (i = 0; i < red_stations.length; i++) {  
        station_marker = new google.maps.Marker({
        position: new google.maps.LatLng(red_stations[i][1], red_stations[i][2]),
        map: map,
		icon: image
    });

    	google.maps.event.addListener(station_marker, 'click', (function(station_marker, i) {
        	return function() {
          		infowindow.setContent(red_stations[i][0]);
          		infowindow.open(map, station_marker);
        	}		
    	})(station_marker, i));
	}
}

function render_redline()
{
	var redline = new google.maps.Polyline({
		path: red_stations,
		geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
	});
	redline.setMap(map);
}