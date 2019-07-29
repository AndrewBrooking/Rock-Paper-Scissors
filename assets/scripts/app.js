// Firebase project config
var firebaseConfig = {
    apiKey: "AIzaSyAD1R32X7sy5U_ICpPipU2LDiWIpcUttt0",
    authDomain: "rock-paper-scissors-d7b85.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-d7b85.firebaseio.com",
    projectId: "rock-paper-scissors-d7b85",
    messagingSenderId: "140953170879",
    appId: "1:140953170879:web:e39d392833c3cdb7"
};

// Start logic after page has loaded
$(document).ready(function () {

    let database, connections;
    let userID = "";
    let username = "";
    let selection = "";

    // Handle button click events
    $(document).on("click", "button", buttonClick);

    // Handle RPS selection
    $(document).on("click", ".rps", cardClick);

    function buttonClick(event) {
        event.preventDefault();

        // Hide the username card
        $("#sign-in").slideUp().fadeOut();

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        // Store database reference
        database = firebase.database();

        // Store connection reference
        connections = database.ref("/connections");
        connected = database.ref(".info/connected");

        // Handle connection to firebase
        connected.on("value", connect);

        // Show the RPS selections
        $("#selection").fadeIn(1500);
    }

    function cardClick(event) {
        // Obtain user selection
        selection = $(this).attr("id");

        console.log("Card clicked (" + selection + ")");

        // Set user settings
        let settings = {
            username: username,
            selection: selection
        };

        // Set user settings on Firebase
        database.ref("/connections/" + userID).set(settings);

        // TODO: Disable selecting other options
    }

    function connect(snapshot) {
        // Check if connected
        if (snapshot.val()) {

            // Obtain username
            username = $("#username").val().trim();

            // Initalize user settings
            let settings = {
                username: username,
                selection: selection
            };

            // Add user to the connections list
            let user = connections.push(settings);

            // Store userID
            userID = user.key;

            // Remove user from the connection list when they disconnect
            user.onDisconnect().remove();
        }
    }
});