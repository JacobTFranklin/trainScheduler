// Initialize Firebase
var config = {
    apiKey: "AIzaSyCv-_jzjaPY7MdeYMWkkriwhkhTaXvyjQY",
    authDomain: "jacob-franklin-test.firebaseapp.com",
    databaseURL: "https://jacob-franklin-test.firebaseio.com",
    projectId: "jacob-franklin-test",
    storageBucket: "jacob-franklin-test.appspot.com",
    messagingSenderId: "856705966470"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();

  var nextArrival = "";

  var minutesAway = 0;


  //Submit data on button click
  $("#submitData").on("click", function(){
    event.preventDefault();
    var nameInput = $("#name-input").val().trim();
    var destinationInput = $("#destination-input").val().trim();
    var timeInput = $("#time-input").val().trim();
    var frequencyInput = $("#frequency-input").val().trim();
    var submission = {name: nameInput, destination: destinationInput, startTime: timeInput, frequency: frequencyInput, dateAdded: firebase.database.ServerValue.TIMESTAMP};
    database.ref("/trains").push(submission);
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
  });

  
  //Build table rows based on data
  //Don't format until you need to display (you will lose data)
 database.ref("/trains").on("child_added", function(childSnapShot){
  var convertedStart = moment(childSnapShot.val().startTime, "HH:mm")
  var convertedFrequency = childSnapShot.val().frequency
  var arrival = convertedStart.add(convertedFrequency, 'm')
  var arrivals = [];
  arrivals.push(arrival);
  var now = moment()
  if(convertedStart.isAfter(now)){
      nextArrival = convertedStart;
  }
  else{
  checkArrival();
  function checkArrival(){
    if(arrivals[arrivals.length-1].isBefore(now)){
     var newArrival = arrivals[arrivals.length-1].add(convertedFrequency, 'm')
     arrivals.push(newArrival)
     checkArrival();
    }
    else{
        nextArrival = arrivals[arrivals.length-1];
    }
   };
  };
  minutesAway = moment(nextArrival).diff(now,"m")
  $("#tableBody").append("<tr></tr>");
  $("#tableBody").append("<td>"+childSnapShot.val().name+"</td>");
  $("#tableBody").append("<td>"+childSnapShot.val().destination+"</td>");
  $("#tableBody").append("<td>"+childSnapShot.val().frequency+"</td>");
  $("#tableBody").append("<td>"+nextArrival.format("hh:mm A")+"</td>");
  $("#tableBody").append("<td>"+minutesAway+"</td>");
  });

