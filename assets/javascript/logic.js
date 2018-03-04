
var config = {

    apiKey: "AIzaSyDE6avgyGxXHcSULjINOmSt1mxg2S_S_qU",

    authDomain: "train-af61a.firebaseapp.com",

    databaseURL: "https://train-af61a.firebaseio.com",

    projectId: "train-af61a",

    storageBucket: "",

    messagingSenderId: "321550355984"

};

firebase.initializeApp(config);



var dataRef = firebase.database();



var name = "";

var destination = "";

var time = 0;

var frequency = 0;

var firstTime = 0;

var nextTrain = 0;



$("#submit").on("click", function(event) {

    event.preventDefault();

    name = $("#nameInput").val().trim();

    destination = $("#destinationInput").val().trim();

    frequency = $("#frequencyInput").val().trim();

    firstTime = $("#timeInput").val().trim();



    dataRef.ref().push({

        name: name,

        destination: destination,

        frequency: frequency,

        firstTime: firstTime,

        dateAdded: firebase.database.ServerValue.TIMESTAMP

    });





});


dataRef.ref().on("child_added", function(childSnapshot) {
console.log(childSnapshot.val().frequency, "-------------------frequency");


    var firstTimeConverted = moment(childSnapshot.val().firstTime, "HH:mm").subtract(1, "years");

    console.log(firstTimeConverted);



    // Current Time

    var currentTime = moment();

    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));



    // Difference between the times

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    console.log("DIFFERENCE IN TIME: " + diffTime);



    // Time apart (remainder)

    var tRemainder = diffTime % childSnapshot.val().frequency;

    console.log(tRemainder);



    // Minute Until Train

    var tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;

    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    //console.log(JSON.stringify(tMinutesTillTrain));



    // Next Train

    nextTrain = moment().add(tMinutesTillTrain, "minutes");

    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    nextTrain = moment(nextTrain).format("hh:mm");


    var tableRow = $("<tr>");

    tableRow.append("<td>" + childSnapshot.val().name + "</td>");

    tableRow.append("<td>" + childSnapshot.val().destination + "</td>");

    tableRow.append("<td>" + childSnapshot.val().frequency + "</td>");

    tableRow.append("<td>" + nextTrain + "</td>");

    tableRow.append("<td>" + tMinutesTillTrain + "</td>");

    $(".table").append(tableRow);



    console.log(childSnapshot.val().name);

    console.log(childSnapshot.val().destination);

    console.log(childSnapshot.val().frequency);

    console.log(nextTrain);



    $("#nameInput").val("");

    $("#destinationInput").val("");

    $("#timeInput").val("");

    $("#frequencyInput").val("");



}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code);

});



