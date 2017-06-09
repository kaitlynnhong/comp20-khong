var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var south_station = new google.maps.LatLng(myLat, myLng);
var myOptions = {
    zoom: 13, 
	center: south_station,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
			var map;
			var marker;
			var infowindow = new google.maps.InfoWindow();
			
			function init()
			{
				map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                renderMap();

			}
			
			function renderMap()
			{
				myLat = 42.351877600;
                myLng = -71.055104200;
                south_station = new google.maps.LatLng(myLat, myLng);
				map.panTo(south_station);
	
				marker = new google.maps.Marker({
					position: south_station,
					title: "South Station, Boston, MA"
				});
				marker.setMap(map);

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(marker.title);
					infowindow.open(map, marker);
				});
			}
