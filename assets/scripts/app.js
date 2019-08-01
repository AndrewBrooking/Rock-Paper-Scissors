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

    let database, connections, chat;
    let userID = "";
    let username = "";
    let selection = "";

    // Handle button click events
    $("#submit").on("click", init);
    $("#send").on("click", sendMessage);

    // Handle RPS selection
    $(document).on("click", ".rps", cardClick);

    function init(event) {
        event.preventDefault();

        // Hide the username card
        $("#sign-in").slideUp().fadeOut();

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        // Store database reference
        database = firebase.database();

        // Store chat reference
        chat = database.ref("/chat");

        // Handles previous/new chat messages
        chat.on("child_added", appendMessage);

        // Store connection reference
        connections = database.ref("/connections");
        let connected = database.ref(".info/connected");

        // Handle connection to firebase
        connected.on("value", connect);

        let status = $("#status-text");

        if (connections.count > 2) {
            // Change status text
            status.text("Too many players connected, try again later.");
        } else {
            // Change status text
            status.text("Select a move below");

            // Show the RPS selections
            setTimeout(function () {
                $("#selection").slideDown();
            }, 1000);
        }

        setTimeout(function () {
            $("#status").slideDown();
        }, 750);

        // Show the chat
        setTimeout(function () {
            $("#chat").slideDown();
        }, 1250);
    }

    function sendMessage(event) {
        event.preventDefault();

        // Get player's message
        let msg = $("#message").val().trim();

        if (msg === "") {
            return;
        }

        // Create chat entry
        let entry = {
            from: username,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        // Add new message
        chat.push(entry);

        // Empty message field
        $("#message").val("");
    }

    function appendMessage(snapshot) {
        let val = snapshot.val();

        let from = val.from;
        let msg = val.message;
        let timestamp = moment(val.timestamp, "x").format("MMM Do, YYYY hh:mm:ss");

        let p = $("<p>")
            .addClass("mb-0")
            .text(
                from + " [" + timestamp + "]: " + msg
            );

        $("#messages").append(p);
    }

    function cardClick(event) {
        // Obtain user selection
        selection = $(this).attr("id");

        //console.log("Card clicked (" + selection + ")");

        // Set user settings
        let settings = {
            username: username,
            selection: selection
        };

        // Set user settings on Firebase
        database.ref("/connections/" + userID).set(settings);

        // TODO: Highlight selection

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