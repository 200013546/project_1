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
var val = '';
var coordinates = [];
var localCoordinates = [];
sessionStorage.clear();

function chooseTarget() {

  // Get city
  targetCity = Math.floor(Math.random() * 40) + 1;
  var address = cities[targetCity].city + "," + cities[targetCity].state;
  // address = address.replace(" ","+");
  // address = "Dallas, tx";
  // console.log(address);
  // locURL = "https://serpapi.com/search?q=" + address + "&hl=en&gl=us&google_domain=google.com&api_key=AIzaSyBeNH6Wmm34EdS4i5AaMRAhOd2oDqikSW8";
  // console.log(locURL);

  queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCwNeT8z4JXX1AvxPPQZVxcBxpAbmqkf0c";
  // console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    latitude2 = response.results[0].geometry.location.lat;
    longitude2 = response.results[0].geometry.location.lng;
    // console.log(latitude2);
    // console.log(longitude2);
    getWeather();
    // console.log(response.GeocodeResponse.result.geometry.location.lat);
  });
}

function getWeather() {
  // weatherURL = "https://samples.openweathermap.org/data/2.5/weather?lat="+ latitude2 +"&lon="+ longitude2 +"&appid=92ff904996bf0620c63ce50f42eb4c93"
  weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude2 + "&lon=" + longitude2 + "&appid=92ff904996bf0620c63ce50f42eb4c93"
  $.ajax({
    url: weatherURL,
    method: "GET"
  }).then(function (response) {
    temperature = Math.floor((response.main.temp - 273.15) * 1.8) + 32;
    humidity = response.main.humidity;
    // console.log(response);
    // console.log(humidity);
    // console.log(temperature);
    // console.log(response);
    $("#weather-display").text("Temp: " + temperature + " Humidity: " + humidity + "% Weather: " + response.weather[0].description);

  })
};



chooseTarget();
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

function drawLine() {

  var flightPlanCoordinates = [
    { lat: 37.772, lng: -122.214 },
    { lat: 21.291, lng: -157.821 },
    { lat: -18.142, lng: 178.431 },
    { lat: -27.467, lng: 153.027 }
  ];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
}


function addPlace() {
  var marker = new google.maps.Marker({
    map: map,
    position: infowindow.getPosition()
  });
  var newLat = infowindow.getPosition().lat()
  var newLng = infowindow.getPosition().lng()
  newLat = Math.round(newLat * 1000) / 1000;
  newLng = Math.round(newLng * 1000) / 1000;
  console.log(newLat);
  console.log(newLng);

  coordinates = JSON.parse(sessionStorage.getItem("coordinates"));
  // Add var if coordinates does not already exist
  if (coordinates === null) {
    var coordinates = [];
  }
 // if (localCoordinates === null) {
   // var localCoordinates = [];
  //}

  // We need to convert the latlng to numbers
  //for (var i = 0; i < LocalCoordinates.length; i++) {
    // Prints a message and the current i value to the console.
  //  console.log("Check lat: " + localCoordinates[i].lat);
  //}
  console.log(localCoordinates);
  console.log(coordinates);
  var flightPlanCoordinates = [
    { lat: 37.772, lng: -122.214 },
    { lat: 21.291, lng: -157.821 },
    { lat: -18.142, lng: 178.431 },
    { lat: -27.467, lng: 153.027 }
  ];

  // Put in sessionstorage the guesses with lat and lng to be used for something later
  var gnum = num - 1;
  val = "{lat: " + newLat + ", lng: " + newLng + "}";
  localCoordinates.push(val);
  coordinates.push(val);
  sessionStorage.setItem("coordinates", JSON.stringify(coordinates));
  // Place on page so that we can see them
  $("#coordinates-display").text(localCoordinates);

  // var flightPlanCoordinates = [coordinates];
  var flightPath = new google.maps.Polyline({
    path: localCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);

  // Need to find distance for determining Hot/Cold - jump to function
  getDistance(newLat, newLng);

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


// Not sure if we will use this in future
function placeLabel(position, map) {
  var mapLabel = new MapLabel({
    text: 'Hello!',
    position: position,
    map: map,
    fontSize: 12,
    align: 'right'
  });
}

// Function to find distance and tell hot or cold
function getDistance(latitude1, longitude1) {
  var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
  // console.log(distance);
  // console.log(oldDistance);
  if (distance < 30000) {
    message = "Got it!!";
    foundIt();
  } else if (oldDistance === 0 && distance > 5000000) {
    message = "Ice Cold!!";
  } else if (oldDistance === 0) {
    message = "Guess Again!!";
  } else if (oldDistance < distance) {
    message = "Colder";
  } else if (oldDistance < distance && distance > 300000) {
    message = "Very Cold!!";
  } else if (oldDistance > distance && distance < 250000) {
    message = "HOT!!";
  } else {
    message = "Warmer";
  }
  oldDistance = distance;
  // console.log(message);
  $("#result-display").text(message);

}

function foundIt() {
  var gnum = num - 1;
  $("#win-display").text(message + " - " + gnum + " tries!!");
}
google.maps.event.addDomListener(window, "load", initialize);