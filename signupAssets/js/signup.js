$(document).ready(function () {
    console.log("The document loaded is loaded");
    // Check sessionStorage to see if we have an entry there
    // Determine user with sessionStorage
    var cityUser = sessionStorage.getItem("cityuser");
    console.log(cityUser);
    if (cityUser !== null) {
        window.location.href = "map.html";
    }

    var config = {
        apiKey: "AIzaSyBz-H7b5a7rmeZ-PmrfPPRegWmXCwchuW8",
        authDomain: "gegt-alan8-18.firebaseapp.com",
        databaseURL: "https://gegt-alan8-18.firebaseio.com",
        projectId: "gegt-alan8-18",
        storageBucket: "gegt-alan8-18.appspot.com",
        messagingSenderId: "868587304318"
    };
    firebase.initializeApp(config);

    //new variables
    var db = firebase.database();
    var email = "";
    var password1 = "";
    var password2 = "";

    //sign-UP by clicking JOIN
    $("#signUp").on("click", function (event) {
        event.preventDefault();
        console.log("signUp was clicked");

        email = $("#email-input").val().trim();
        password1 = $("#password1-input").val().trim();
        password2 = $("#password2-input").val().trim();

        // checking passwords match
        if (password1 != password2) {
            $("#response").text("The passwords entered did not match");
            console.log("The passwords entered did not match. User " + email + " was NOT created!");
        }
        else {
            validateLength();
        }

        // Validate password length
        function validateLength() {
            if (password1.length < 5) {
                $("#response").text("The password must be at least 5 characters long.");
                console.log("The passwords entered is too short. User " + email + " was NOT created!");
            } else {
                //console.log("Password meets requirement!")
                validateEmail();
            }
        }

        //Check if it's a valid emailaddress
        function validateEmail() {
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (email.match(mailformat)) {
                console.log("Email address provided (" + email + ") meets email address format");
                console.log("Password meets requirement!")
                console.log("Creating new user " + email + " in database");
                dbWrite2();
            }
            else {
                $("#response").text(email + " is not a valid email address");
                console.log("The email address provided (" + email + ") is invalid");
            }
        }

        function dbWrite2() {
            email = email;
            password = password1;
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(error.code);
                console.log(error.message);
                $("#response").text(error.message);
                //console.log("sent to firebse");

                // ...
            });
            console.log("sent to firebase");
            $(".input-lg").text("");
            $(".input-lg").val("");
            window.location.href = "map.html";
        }

    });

    //sign in

    $("#sign-in").on("click", function (event) {
        console.log("sign-in was clicked")
        event.preventDefault();
        email = $("#email-input2").val().trim();
        password = $("#password-input2").val().trim();

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log("errors code received: " + errorCode);
            console.log("errors message received: " + errorMessage);

            $("#response-2").text(errorCode);

        });
        sessionStorage.clear();
        sessionStorage.setItem("cityuser", email);
        console.log("user " + email + " is attempting to login 2");
        window.location.href = "map.html";
    }); //sign-in
}); //doc.ready
