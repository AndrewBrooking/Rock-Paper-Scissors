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
    
    // Create reference to the status text element
    const statusText = $("#status-text");

    // Create app variables
    let database, connections, chat;
    let userID = "";
    let oppSelection = "";
    let username = "";
    let selection = "";

    // Handle button click events
    $(document).on("click", "#submit", init);
    $(document).on("click", "#send", sendMessage);

    // Handle player move selection
    $(document).on("click", ".rps", cardClick);

    /*
     *   Initializes Firebase connection, enables game elements, and creates Firebase event logic.
     */
    function init(event) {
        // Stop page refreshing
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

        // Determine if this player can participate then update display
        connections.once("value").then(setParticipation);

        // Handle player/opponent move selection
        connections.on("child_changed", update);
    }

    /*
     *   Sets user related values (userID, username, etc.) when the client connects to Firebase.
     */
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

    /*
    *   Checks number of players connected, sets appropriate status message, and displays game options and chat
    */
    function setParticipation(snapshot) {
        if (snapshot.numChildren() > 2) {
            // Change status text
            statusText.text("Too many players connected, try again later.");
        } else {
            // Change status text
            statusText.text("Select a move");

            // Show the RPS selections
            setTimeout(function () {
                $("#selection").slideDown();
            }, 1000);
        }

        // Show game status message
        setTimeout(function () {
            $("#status").slideDown();
        }, 750);

        // Show the chat
        setTimeout(function () {
            $("#chat").slideDown();
        }, 1250);
    }

    /*
     *   Sends a chat message from the client side to Firebase.
     */
    function sendMessage(event) {
        // Stop page refreshing
        event.preventDefault();

        // Get player's message
        let msg = $("#message").val().trim();

        // Prevent empty messages being added
        if (msg === "") {
            return;
        }

        // Create chat entry
        let entry = {
            from: username,
            message: msg,
            timestamp: moment().format("x")
        };

        // Add new message
        chat.push(entry);

        // Empty message field
        $("#message").val("");
    }

    /*
     *   Adds all messages to chat log on the client's side.
     */
    function appendMessage(snapshot) {
        // Create snapshot value variable
        let val = snapshot.val();

        // Obtain message values (username of sender, text, and time sent)
        let from = val.from;
        let msg = val.message;
        let timestamp = moment(val.timestamp, "x").format("MMM Do, YYYY hh:mm:ss");

        // Create a p tag to store message
        let p = $("<p>")
            .addClass("mb-0")
            .text(
                from + " [" + timestamp + "]: " + msg
            );

        // Add message to chat log
        $("#messages").append(p);
    }

    /*
     *   Handles user selection of either rock, paper, or scissors.
     */
    function cardClick(event) {
        // Check if selection has been set already
        if (selection === "") {
            // Obtain user selection
            selection = $(this).attr("id");

            // Send user selection to Firebase
            connections.child(userID).child("selection").set(selection);

            // Disable selecting rock if not selected
            if (selection !== "rock") {
                $("#rock").fadeOut();
            }

            // Disable selecting paper if not selected
            if (selection !== "paper") {
                $("#paper").fadeOut();
            }

            // Disable selecting scissors if not selected
            if (selection !== "scissors") {
                $("#scissors").fadeOut();
            }
        }
    }

    /*
     *   Logic for when a user chooses a move, player or opponent.
     */
    function update(snapshot) {
        // Store snapshot value
        const val = snapshot.val();

        // Obtain opponent's selection
        if (val.username !== username) {
            oppSelection = val.selection;
        } else {
            // Change status message
            changeStatus("Waiting for opponent...");
        }

        if (selection !== "" && oppSelection !== "") {
            // Check possible win conditions
            const winCheck1 = (selection === "rock") && (oppSelection === "scissors");
            const winCheck2 = (selection === "paper") && (oppSelection === "rock");
            const winCheck3 = (selection === "scissors") && (oppSelection === "paper");

            // Determine game outcome
            if (selection === oppSelection) {
                // Set status message
                changeStatus("Draw!");
            } else if (winCheck1 || winCheck2 || winCheck3) {
                // Set status message
                changeStatus("Win!");
            } else {
                // Set status message
                changeStatus("Loss!");
            }

            // Reset game afer 3 seconds
            setTimeout(function () {
                // Show rock option
                if (selection !== "rock") {
                    $("#rock").fadeIn();
                }

                // Show paper option
                if (selection !== "paper") {
                    $("#paper").fadeIn();
                }

                // Show scissors option
                if (selection !== "scissors") {
                    $("#scissors").fadeIn();
                }

                // Reset player and opponent selection
                selection = "";
                oppSelection = "";

                // Reset user selection on Firebase
                connections.child(userID).child("selection").set(selection);

                // Set status message
                changeStatus("Select a move");
            }, 3000);
        }
    }

    /*
     *   Updates the status message on screen to the specified text.
     */
    function changeStatus(text) {
        // Fade out status text
        statusText.fadeOut(500);

        setTimeout(function () {
            // Set status message
            statusText.text(text);

            // Fade in status text
            statusText.fadeIn(500);
        }, 500);
    }
});