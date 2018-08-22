var geocoder;
var map;
var infowindow = new google.maps.InfoWindow();
// var formStr = "<input type='text' id='text4mrkr' value='marker text' /><input type='button' value='submit' onclick='addPlace();' />"

// var latitude2 = 33.8725;
// var longitude2 = -84.3726;
var latitude2 = 0;
var longitude2 = 0;
var oldDistance = 0;
var num = 1;
var message = '';

function chooseTarget() {
  address = "Dallas, tx";
  queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address='" + address + "'&key=AIzaSyCwNeT8z4JXX1AvxPPQZVxcBxpAbmqkf0c";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    latitude2 = response.results[0].geometry.location.lat;
    longitude2 = response.results[0].geometry.location.lng;
    console.log(latitude2);
    console.log(longitude2);
    // console.log(response.GeocodeResponse.result.geometry.location.lat);
  });
}
chooseTarget();
function initialize() {
  map = new google.maps.Map(
    document.getElementById("map_canvas"), {
      center: new google.maps.LatLng(40, -100),
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  google.maps.event.addListener(map, 'click', function (e) {
    markerText = "Guess # " + num;
    formStr = "<input type='text' id='text4mrkr' value='" + markerText + "' /><input type='button' value='submit' onclick='addPlace();' />"
    infowindow.setContent(formStr);
    infowindow.setPosition(e.latLng);
    infowindow.open(map);
    num++;
    // placeLabel(e.latLng, map);
  });
}

function addPlace() {
  var marker = new google.maps.Marker({
    map: map,
    position: infowindow.getPosition()
  });
  var newLat = infowindow.getPosition().lat()
  var newLng = infowindow.getPosition().lng()
  console.log(newLat);
  console.log(newLng);
  getDistance(newLat, newLng);
  marker.htmlContent = document.getElementById('text4mrkr').value;
  infowindow.close();
  google.maps.event.addListener(marker, 'click', function (evt) {
    infowindow.setContent(this.htmlContent);
    infowindow.open(map, marker);
  });
  google.maps.event.addListener(marker, 'rightclick', function () {
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


function getDistance(latitude1, longitude1) {
  var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
  console.log(distance);
  console.log(oldDistance);
  if (distance < 30000) {
    message = "Got it!!";
  } else if (oldDistance === 0) {
    message = "Guess Again!!";
  } else if (oldDistance < distance) {
    message = "Colder";
  } else {
    message = "Warmer";
  }
  oldDistance = distance;
  console.log(message);
}
google.maps.event.addDomListener(window, "load", initialize);