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
var population = 0;
var state = '';
var marker = '';
var clues = [];
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
var audioElementw = document.createElement("audio");
audioElementw.setAttribute("src", "assets/sounds/TaDa.mp3");
var audioElementl = document.createElement("audio");
audioElementl.setAttribute("src", "assets/sounds/beep-10.mp3");
var audioElementWarmer = document.createElement("audio");
audioElementWarmer.setAttribute("src", "assets/sounds/warmer.wav");
var audioElementColder = document.createElement("audio");
audioElementColder.setAttribute("src", "assets/sounds/colder.wav");
var audioElementStartup = document.createElement("audio");
audioElementStartup.setAttribute("src", "assets/sounds/startup.wav");
var audioElementSplash = document.createElement("audio");
audioElementSplash.setAttribute("src", "assets/sounds/splash.wav");


// Initialize google maps
function initialize() {
  map = new google.maps.Map(
    document.getElementById("map_canvas"), {
      center: new google.maps.LatLng(40, -96),
      zoom: 3.8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  google.maps.event.addListener(map, 'click', function (e) {
    markerText = "Guess # " + num;
    formStr = "<input type='hidden' id='text4mrkr' value='" + markerText + "' /><input type='button' value='" + markerText + "' onclick='addPlace();' />"
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
  // targetCity = 1;
  state = cities[targetCity].state;
  var address = cities[targetCity].city + "," + cities[targetCity].state;
  population = cities[targetCity].pop18;
  queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCwNeT8z4JXX1AvxPPQZVxcBxpAbmqkf0c";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    latitude2 = response.results[0].geometry.location.lat;
    longitude2 = response.results[0].geometry.location.lng;
    getWeather();
    getGif();
  });
}

// Add new place here
function addPlace() {
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
  getDistance(newLat, newLng);
  for (var i = 0; i < coordinates.length - 1; i++) {
    var flightPath = new google.maps.Polyline({
      path: [coordinates[i], coordinates[i + 1]],
      strokeColor: lineColors[i + 1],
      strokeOpacity: 1.0,
      strokeWeight: 3,
      map: map
    });
    flightPath.setMap(map);
  }
  streetLocation = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + newLat + "," + newLng + "&key=AIzaSyCwNeT8z4JXX1AvxPPQZVxcBxpAbmqkf0c&sensor=false";
  $.ajax({
    url: streetLocation,
    method: "GET"
  }).then(function (response) {
    console.log(response.results);
    stateArrayLength = response.results.length;
    statePos = stateArrayLength - 2;
    console.log(statePos);
    if (statePos < 0) {
      image = 'assets/images/swimming.png';
      audioElementSplash.play();
    } else {
      state = response.results[statePos].address_components[0].long_name;
      console.log(state);
      if (state !== '') {
        state = state.replace(" ", "-");
        image = "assets/images/stateFlags/" + state + "-Flag-32.png";
      }
    }

    // Create marker here
    marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: infowindow.getPosition(),
      icon: image
    });


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
  });
}

// Function to find distance and tell hot or cold
function getDistance(latitude1, longitude1) {
  var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
  if (distance < 50000) {
    message = "Got it!!";
    lineColor = "#00AA00";
    foundIt();
  } else if (oldDistance === 0 && distance > 5000000) {
    message = "Ice Cold!!";
    lineColor = "#0000FF";
    audioElementColder.play();
  } else if (oldDistance === 0) {
    message = "Guess Again!!";
    lineColor = "#FFFFFF";
    audioElementStartup.play();
  } else if (oldDistance < distance) {
    message = "Colder";
    lineColor = "#00AAFF";
    audioElementColder.play();
  } else if (oldDistance < distance && distance > 300000) {
    message = "Very Cold!!";
    lineColor = "#002AFF";
    audioElementColder.play();
  } else if (oldDistance > distance && distance < 250000) {
    message = "HOT!!";
    lineColor = "#FF0000";
    audioElementWarmer.play();
  } else {
    message = "Warmer";
    lineColor = "#FF7F00";
    audioElementWarmer.play();
  }
  oldDistance = distance;
  lineColors.push(lineColor);

  // Post status if wanted
  $("#result-display").text(message);

  // Generate clue to give
  if (num < clues.length) {
    fieldFix = clues[num].field.replace('_',' ');
    clueMessage = fieldFix + " is " + clues[num].value;
    $("#clue-display").text(clueMessage);
  }
}

// Once location is found, we can let them know
function foundIt() {
  audioElementw.play();
  // console.log(theState);
  if (theState === "Hawaii" || theState === "Alaska") {
    map.setCenter(new google.maps.LatLng(40, -120));
    map.setZoom(3);
  } else {
    map.setCenter(new google.maps.LatLng(40, -96));
    map.setZoom(3.8);
  }
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
    weather = response.weather[0].description;
    $("#weather-display").text("Temp: " + temperature + " Humidity: " + humidity + "% Weather: " + response.weather[0].description + " Population: " + population);
    clues.push({
      "field": "Temperature",
      "value": temperature
    });
    clues.push({
      "field": "Humidity",
      "value": humidity
    });
    clues.push({
      "field": "Weather",
      "value": weather
    });
    clues.push({
      "field": "Population",
      "value": population
    });
  })
};

function getGif() {
  var gifnum = Math.floor(Math.random() * 10);
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + state + "&rating=r&api_key=dc6zaTOxFJmzC&limit=10";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var imageGif = $("<iframe>");
    imageGif.attr("src", response.data[gifnum].embed_url);
    $("#gifs-view").html(imageGif);
  });
}

// Begin program here to choose target
chooseTarget();
google.maps.event.addDomListener(window, "load", initialize);
