// Array of things to get from Wiki
var wikiItems = ["Motto", "State_Anthem", "Governor", "Area_Rank", "Density_Rank", "Time_Zone", "Nickname", "Largest_City", "Capital"];

var dataUrl = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=";

var searchUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";



var theState = state;
var state = state.replace(/\s+/g, '_');

// Need to search for the state first to make sure we are looking at the state
url = searchUrl + state;
console.log(url);
$.ajax({
    url: url,
    dataType: "jsonp",
    method: "GET"
}).then(function (data) {
    // console.log(data[1][0]);
    for (var k = 0; k < 5; k++) {
        console.log(data[1][k]);
        if (data[1][k].includes("state")) {
            state = data[1][k].replace(/\s+/g, '_');
            console.log("NewState:" + state);
        }
    }

    url = dataUrl + state;
    console.log(url);
    $.ajax({
        url: url,
        dataType: "jsonp",
        method: "GET"
    }).then(function (data) {
        // console.log(data);
        var page = data.query.pages;
        var pageId = Object.keys(data.query.pages)[0];
        // console.log(pageId);
        var content = page[pageId].revisions[0]['*'];
        // console.log(content);
        var contentArray = content.split("|");
        for (var i = 0; i < contentArray.length; i++) {
            for (var j = 0; j < wikiItems.length; j++) {
                var wikiFieldFix = wikiItems[j].replace('_','');
                if (contentArray[i].includes(wikiFieldFix)) {
                    // console.log("GOT1: " + wikiItems[j] + "---" + contentArray[i]);
                    if (window[wikiFieldFix] === '' || typeof window[wikiFieldFix] == 'undefined') {

                        // Sanatize value from wikipedia
                        wikiField = contentArray[i].replace(/[#|_\[\]\{\}]/g, '').trim();
                        wikiField = wikiField.replace(theState, "XXXXXX");
                        wikiFieldArray = wikiField.split("=");
                        window[wikiItems[j]] = wikiFieldArray[1].trim();
                        // console.log("THIS:::" + wikiItems[j] + ": " + window[wikiItems[j]]);
                    } else {
                        // console.log("AlreadyGOT1: " + wikiItems[j] + "---" + window[wikiItems[j]]);
                    }
                }
            }
        }
        for (var j = 0; j < wikiItems.length; j++) {
            // console.log(wikiItems[j] + " : " + window[wikiItems[j]]);
            // Put objects into an array to display clues later
            clues.push({
                "field": wikiItems[j],
                "value": window[wikiItems[j]]
            });
        }
        console.log(clues);
    });
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
