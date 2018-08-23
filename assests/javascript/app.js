var geocoder;
var map;
var infowindow = new google.maps.InfoWindow();
var latitude2 = 0;
var longitude2 = 0;
var oldDistance = 0;
var num = 1;
var message = '';
var val = '';
var coordinates = [];
var lineColor = '';
var lineColors = [];

// Initialize google maps
function initialize() {
  map = new google.maps.Map(
    document.getElementById("map_canvas"), {
      center: new google.maps.LatLng(40, -100),
      zoom: 4.1,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  google.maps.event.addListener(map, 'click', function (e) {
    markerText = "Guess # " + num;
    formStr = "<input type='hidden' id='text4mrkr' value='" + markerText + "' /><input type='button' value='submit' onclick='addPlace();' />"
    infowindow.setContent(formStr);
    infowindow.setPosition(e.latLng);
    infowindow.open(map);
    num++;
    // placeLabel(e.latLng, map);
  });
}

// Initialize the location on the map
function chooseTarget() {
  // Get city
  targetCity = Math.floor(Math.random() * 40) + 1;
  var address = cities[targetCity].city + "," + cities[targetCity].state;
  queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCwNeT8z4JXX1AvxPPQZVxcBxpAbmqkf0c";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    latitude2 = response.results[0].geometry.location.lat;
    longitude2 = response.results[0].geometry.location.lng;
    getWeather();
  });
}

// Add new place here
function addPlace() {
  var marker = new google.maps.Marker({
    map: map,
    position: infowindow.getPosition()
  });
  var newLat = infowindow.getPosition().lat()
  var newLng = infowindow.getPosition().lng()
  newLat = Math.round(newLat * 1000) / 1000;
  newLng = Math.round(newLng * 1000) / 1000;

  // Put coordinates into array for drawing lines
  coordinates.push({
    "lat": newLat,
    "lng": newLng
  });

  // Add line colors - loop through coordintes and linecolor array to assign 
  lineColor = getDistance(newLat, newLng);
  for (var i = 0; i < coordinates.length - 1; i++) {
    var flightPath = new google.maps.Polyline({
      path: [coordinates[i], coordinates[i + 1]],
      strokeColor: lineColors[i + 1],
      strokeOpacity: 1.0,
      strokeWeight: 3
      //      map: map
    });
    flightPath.setMap(map);
  }

  // Place marker on map
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

// Function to find distance and tell hot or cold
function getDistance(latitude1, longitude1) {
  var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
  if (distance < 30000) {
    message = "Got it!!";
    var lineColor = "#00AA00";
    foundIt();
  } else if (oldDistance === 0 && distance > 5000000) {
    message = "Ice Cold!!";
    var lineColor = "#0000FF";
  } else if (oldDistance === 0) {
    message = "Guess Again!!";
    var lineColor = "#FFFFFF";
  } else if (oldDistance < distance) {
    message = "Colder";
    var lineColor = "#00AAFF";
  } else if (oldDistance < distance && distance > 300000) {
    message = "Very Cold!!";
    var lineColor = "#002AFF";
  } else if (oldDistance > distance && distance < 250000) {
    message = "HOT!!";
    var lineColor = "#FF0000";
  } else {
    message = "Warmer";
    var lineColor = "#FF7F00";
  }
  oldDistance = distance;
  $("#result-display").text(message);
  lineColors.push(lineColor);
  console.log("LCb: " + lineColor);
  return lineColor;
}

// Once location is found, we can let them know
function foundIt() {
  var gnum = num - 1;
  $("#win-display").text(message + " - " + gnum + " tries!!");
}

// ACCESS CLUES IN THIS AREA -----------------------------------

// Get weather clue here
function getWeather() {
  weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude2 + "&lon=" + longitude2 + "&appid=92ff904996bf0620c63ce50f42eb4c93"
  $.ajax({
    url: weatherURL,
    method: "GET"
  }).then(function (response) {
    temperature = Math.floor((response.main.temp - 273.15) * 1.8) + 32;
    humidity = response.main.humidity;
    $("#weather-display").text("Temp: " + temperature + " Humidity: " + humidity + "% Weather: " + response.weather[0].description);
  })
};


// Begin program here to choose target
chooseTarget();
google.maps.event.addDomListener(window, "load", initialize);
