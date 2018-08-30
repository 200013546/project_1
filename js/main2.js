$(startBtn).on("click", function (event) {

    var cityUser = sessionStorage.getItem("cityuser");
    console.log(cityUser);
    if (cityUser !== null) {
        window.location.href = "map.html";
        console.log("User " + cityUser + " is logged in. forwarding to maps page");
    } else {
        window.location.href = "signUp-signIn.html";
        console.log("user not logged in... forwarding to sign-up page");
    }
});