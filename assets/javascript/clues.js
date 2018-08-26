// Array of things to get from Wiki
var wikiItems = ["Motto","StateAnthem","Capital","Governor","AreaRank","DensityRank","TimeZone","Nickname","LargestCity"];

var dataUrl = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=";
// var contentArray = [];


var Nickname = '';
var StateAnthem = '';
var bird = '';
var Motto = '';

var state = "Nevada";
state = state.replace(/\s+/g, '_');
url = dataUrl + state;
console.log(url);
$.ajax({
    url: url,
    dataType: "jsonp",
    method: "GET"
}).then(function (data) {
    console.log(data);
    var page = data.query.pages;
    var pageId = Object.keys(data.query.pages)[0];
    console.log(pageId);
    var content = page[pageId].revisions[0]['*'];
    console.log(content);
    var contentArray = content.split("|");
    for (var i = 0; i < contentArray.length; i++) {
        for (var j = 0; j < wikiItems.length; j++) {
            if (wikiItems[i].includes(wikiItems[i])) {
            if (wikiItems[i] === '') {
                wikiItems[i] = contentArray[i];
                console.log(wikiItems[i] + ": "  + wikiItems[i]);
            }
        }
        if (contentArray[i].includes("StateAnthem")) {
            console.log("StateAnthem: " + contentArray[i]);
            if (StateAnthem === '') {
                StateAnthem = contentArray[i];
                console.log("StateAnthem: " + StateAnthem);
            }
        }
        if (contentArray[i].includes("Bird")) {
            if (bird === '') {
                bird = contentArray[i];
                console.log("Bird: " + bird);
            }
        }
        if (contentArray[i].includes("Motto")) {
            if (Motto === '') {
                Motto = contentArray[i];
                console.log("Motto: " + Motto);
            }
        }
    }
});

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
