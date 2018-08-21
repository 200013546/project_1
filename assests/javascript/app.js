var geocoder;
var map;
var infowindow = new google.maps.InfoWindow();
var formStr = "<input type='text' id='text4mrkr' value='marker text' /><input type='button' value='submit' onclick='addPlace();' />"

function initialize() {
  map = new google.maps.Map(
    document.getElementById("map_canvas"), {
      center: new google.maps.LatLng(37.4419, -122.1419),
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  google.maps.event.addListener(map, 'click', function(e) {
    infowindow.setContent(formStr);
    infowindow.setPosition(e.latLng);
    infowindow.open(map);

    // placeLabel(e.latLng, map);
  });
}

function addPlace() {
  var marker = new google.maps.Marker({
    map: map,
    position: infowindow.getPosition()
  });
  marker.htmlContent = document.getElementById('text4mrkr').value;
  infowindow.close();
  google.maps.event.addListener(marker, 'click', function(evt) {
    infowindow.setContent(this.htmlContent);
    infowindow.open(map, marker);
  });
  google.maps.event.addListener(marker, 'rightclick', function() {
    this.setMap(null);
  });
}

function placeLabel(position, map) {
    var mapLabel = new MapLabel({
      text: 'Hello!',
      position: position,
      map: map,
      fontSize: 12,
      align: 'right'
    });
  }
  google.maps.event.addDomListener(window, "load", initialize);