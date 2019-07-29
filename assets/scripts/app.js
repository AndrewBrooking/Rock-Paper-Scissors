// Firebase project config
var firebaseConfig = {
    apiKey: "AIzaSyAD1R32X7sy5U_ICpPipU2LDiWIpcUttt0",
    authDomain: "rock-paper-scissors-d7b85.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-d7b85.firebaseio.com",
    projectId: "rock-paper-scissors-d7b85",
    messagingSenderId: "140953170879",
    appId: "1:140953170879:web:e39d392833c3cdb7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Store database reference
let database = firebase.database();

// Start logic after page has loaded
$(document).ready(function () {
    // Handle button click events
    $(document).on("click", "button", buttonClick);

    // Handle RPS selection
    $(document).on("click", ".card", cardClick);

    function buttonClick(event) {
        // TODO
    }

    function cardClick(event) {
        // TODO
    }
});