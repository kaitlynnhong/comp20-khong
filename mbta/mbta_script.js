function display_map()
{
    var south_station = new google.maps.LatLng({lat:42.351877600, lng:-71.055104200});

    var options = {
					zoom: 15,
					center: south_station,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
    
    var map = new.google.Map(document.getElementById=("map_canvas"), options);

    var south_marker = new google.maps.Marker({
        position: south_station,
        title: "South Station, Boston, MA"
    });
    south_marker.setMap(map);

    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(south_marker, 'click', function(){
        infowindow.setContent(south_marker.title);
        infowindow.open(map, south_marker);
    });
}