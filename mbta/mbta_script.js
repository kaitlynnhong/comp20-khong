var myLat = 0, myLng = 0;
var request = new XMLHttpRequest();
//image object for unique red line icon, sized appropriately
var image = {
	url: 'http://www.jiekeyou.com/wp-content/uploads/2014/07/public-transport-icon.png',
	scaledSize: new google.maps.Size(25,25)
};
var image_2 = {
	url: 'https://cdn0.iconfinder.com/data/icons/transport-14/512/Train_Red.png',
	scaledSize: new google.maps.Size(25,25)
};
//created south_station object for center 
var south_station = new google.maps.LatLng(myLat, myLng);
//object containing array of other red stations
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
//object containing arrays of orange stations
var orange_stations = [
	['Oak Grove Station', 42.4353430165, -71.071189642, 19],
	['Melden Center Station', 42.4273133438, -71.073871851, 18],
	['Wellington Station', 42.4042955853, -71.0770046711, 17],
	['Sullivan Square Station (Broadway Exit)', 42.3857548427, -71.0770707729, 16],
	['Sullivan Square Station (Cambridge St Exit)', 42.3830128834, -71.0771012306, 15],
	['Community College Station', 42.3716383181, -71.0702776909, 14],
	['North Station', 42.365512, -71.061423, 13],
	['Haymarket Station', 42.362498, -71.058996, 12],
	['State Station', 42.358897, -71.057795, 11], 
	['Chinatown Station', 42.352228, -71.062892, 10],
	['Tufts Medical Center Station', 42.3498873, -71.063795, 9],
	['Back Bay Station', 42.3472772215, -71.0760390759, 8],
	['Massachusetts Avenue Station', 42.3415519196, -71.0832166672, 7],
	['Ruggles Station', 42.3356674788, -71.0905230045, 6],
	['Roxbury Crossing Station', 42.3315274209, -71.0954046249, 5],
	['Jackson Square Station', 42.3227388088, -71.1000823975, 4],
	['Stony Brook Station', 42.3192008078, -71.1028289795, 3],
	['Green Street Station', 42.3105691548, -71.107313633, 2],
	['Forest Hills Station', 42.300362, -71.113411, 1]
]

var myOptions = {
    zoom: 15, 
	center: south_station,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var infowindow = new google.maps.InfoWindow();

//function init()
//purpose: generate new map object in the 'map_canvas' div using myOptions specifications		
function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    renderMap();

}
//function: renderMap()
//purpose: creates center of map around marker at South Station	
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
	orange_station_markers();
}

//function red_station_markers()
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

function orange_station_markers() 
{
	var station_marker, i;

	for (i = 0; i < orange_stations.length; i++) {  
        station_marker = new google.maps.Marker({
        position: new google.maps.LatLng(orange_stations[i][1], orange_stations[i][2]),
        map: map,
		icon: image_2
    });

    	google.maps.event.addListener(station_marker, 'click', (function(station_marker, i) {
        	return function() {
          		infowindow.setContent(orange_stations[i][0]);
          		infowindow.open(map, station_marker);
        	}		
    	})(station_marker, i));
	}
}

function render_orangeline()
{ 
	var orange_coords = [
		{lat: 42.4353430165, lng: -71.071189642},
		{lat: 42.4273133438, lng: -71.073871851},
		{lat: 42.4042955853, lng: -71.0770046711},
		{lat: 42.3857548427, lng: -71.0770707729},
		{lat: 42.3830128834, lng: -71.0771012306},
		{lat: 42.3716383181, lng: -71.0702776909},
		{lat: 42.365512, lng: -71.061423},
		{lat: 42.362498, lng: -71.058996},
		{lat: 42.355295, lng: -71.060788},
		{lat: 42.358897, lng: -71.057795}, 
		{lat: 42.352228, lng: -71.062892},
		{lat: 42.3498873,lng: -71.063795},
		{lat: 42.3472772215, lng: -71.0760390759},
		{lat: 42.3415519196, lng: -71.0832166672},
		{lat: 42.3356674788, lng: -71.0905230045},
		{lat: 42.3315274209, lng: -71.0954046249},
		{lat: 42.3227388088, lng: -71.1000823975},
		{lat: 42.3192008078, lng: -71.1028289795},
		{lat: 42.3105691548, lng: -71.107313633},
		{lat: 42.300362, lng: -71.113411}
	]

	var orangeline_path = new google.maps.Polyline({
		path: orange_coords,
		geodesic: true,
        strokeColor: '#FFA500',
        strokeOpacity: 1.0,
        strokeWeight: 3
	});
	orangeline_path.setMap(map);
}

