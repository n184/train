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
  var firstTime = ""

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
          nextTrain: nextTrain,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });


  });


  //$("#awayDisplay").text(tMinutesTillTrain);
  //$("#nextDisplay").text(moment(nextTrain).format("hh:mm"));

  dataRef.ref().on("child_added", function(childSnapshot, prevChildkey) {

      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % frequency;
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = frequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
      nextTrain = moment(nextTrain).format("hh:mm");

      var tableRow = $("<tr>");
      tableRow.append("<td>" + childSnapshot.val().name + "</td>");
      tableRow.append("<td>" + childSnapshot.val().destination + "</td>");
      tableRow.append("<td>" + childSnapshot.val().frequency + "</td>");
      //tableRow.append("<td>" + childSnapshot.val().frequency + "</td>");
      tableRow.append("<td>" + (childSnapshot.val().nextTrain) + "</td>");
      tableRow.append("<td>" + childSnapshot.val().tMinutesTillTrain + "</td>");
      $(".table").append(tableRow);

      console.log(childSnapshot.val().name);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().frequency);
      console.log(childSnapshot.val().nextTrain);


      $("#nameInput").val("");
      $("#destinationInput").val("");
      $("#timeInput").val("");
      $("#frequencyInput").val("");

  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });

  dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

      // Change the HTML to reflect
      $("#nameDisplay").text(snapshot.val().name);
      $("#destinationDisplay").text(snapshot.val().destination);
      $("#frequencyDisplay").text(snapshot.val().frequency);
      //$("#nextDisplay").text(snapshot.val().frequency);
      $("#nextDisplay").text(snapshot.val().nextTrain);
      $("#awayDisplay").text(snapshot.val().tMinutesTillTrain);
  });