var map;
var num = 1;
var val = '';
var geocoder;
var clues = [];
var state = '';
var marker = '';
var message = '';
var latitude2 = 0;
var longitude2 = 0;
var lineColor = '';
var oldDistance = 0;
var clueMessage = '';
var coordinates = [];
var lineColors = [];
var population = 0;
var infowindow = new google.maps.InfoWindow();
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
var audioElementwin = document.createElement("audio");
audioElementwin.setAttribute("src", "assets/sounds/TaDa.mp3");
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

// Determine user with sessionStorage
var cityUser = sessionStorage.getItem("cityuser");
console.log(cityUser);

// Initialize google maps
function initialize() {
  map = new google.maps.Map(
    document.getElementById("map_canvas"), {
      center: new google.maps.LatLng(40, -96),
      zoom: 3.8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  google.maps.event.addListener(map, 'click', function (e) {
    map.setOptions({ draggableCursor: 'crosshair' });
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

  // Find where the marker is - state, Canada, ocean
  streetLocation = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + newLat + "," + newLng + "&key=AIzaSyCwNeT8z4JXX1AvxPPQZVxcBxpAbmqkf0c&sensor=false";
  $.ajax({
    url: streetLocation,
    method: "GET"
  }).then(function (response) {
    // console.log(response.results);
    stateArrayLength = response.results.length;
    // console.log("SAL: " + stateArrayLength);
    statePos = stateArrayLength - 2;
    countryPos = stateArrayLength - 1;
    if (stateArrayLength) {
      country = response.results[countryPos].address_components[0].long_name;
      state = response.results[statePos].address_components[0].long_name;
    }
    // console.log(statePos);
    // console.log(countryPos);
    if (statePos < 0) {
      image = 'assets/images/swimming.png';
      audioElementSplash.play();
    } else if (country === "Canada") {
      // image = "assets/images/stateFlags/canada-flag-icon-32.png";
      image = "http://icons.iconarchive.com/icons/custom-icon-design/all-country-flag/32/Canada-Flag-icon.png";
      audioElementl.play();
    } else {
      // console.log(state);
      if (state !== '') {
        state = state.replace(" ", "-");
        // image = "assets/images/stateFlags/" + state + "-Flag-32.png";
        image = "http://icons.iconarchive.com/icons/custom-icon-design/american-states/32/" + state + "-Flag-icon.png";
      }
    }

    // Create marker here with state flag
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

// Function to find distance and tell hot or cold (line color) and audio sound
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
  // redo loop to create table
  clueCountNumber = num - 2;
  console.log(clues);
  if (clueCountNumber < clues.length) {
    clueTable = "<table>";
    clueTable += "<tbody>";
    for (var i = 0; i < clueCountNumber + 1; i++) {
      fieldFix = clues[i].field.replace('_', ' ');
      clueTable += "<tr><td>" + fieldFix + "</td><td>" + clues[i].value + "</td></tr>"
    }
    clueTable += "</tbody>";
    clueTable += "</table>";
    $("#clue-display").html(clueTable);
  }

}

// Once location is found, we can let them know
function foundIt() {
  audioElementwin.play();
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

  // Put in firebase
  var dataRef = firebase.database();
  // var email = 'alan@alanmccabe.com';

  dataRef.ref("mapProject").push({

    email: cityUser,
    score: gnum,
    state: theState,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });


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
