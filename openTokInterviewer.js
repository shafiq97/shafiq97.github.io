//get username from index.js
var interviewerUserName = sessionStorage.getItem("uname");
var sessionId = sessionStorage.getItem("SID");
console.log(sessionId);

alert("Hello "+ interviewerUserName + ", Please wait your candidate to join your session");

//getSessionID


// replace these values with those generated in your TokBox Account
var apiKey = "46417142";
//var sessionId = "2_MX40NjQxNzE0Mn5-MTU2ODMwMjY4ODU3M35jUGRGNHFUUHdOSXk4K0pwdGhiMGltZ0N-UH4";
var token = "T1==cGFydG5lcl9pZD00NjQxNzE0MiZzaWc9MWVjNjMwMTkyYjhiZGZkMGJhOWJmOWQyZDk4NGVkNTBkYmFjNzFlOTpzZXNzaW9uX2lkPTJfTVg0ME5qUXhOekUwTW41LU1UVTJPRE13TWpZNE9EVTNNMzVqVUdSR05IRlVVSGRPU1hrNEswcHdkR2hpTUdsdFowTi1VSDQmY3JlYXRlX3RpbWU9MTU3MTY2MzMxOSZub25jZT0wLjIyNjAwMzc4NDE0NTgyODkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTU3NDI1ODkxOSZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==";

// (optional) add server code here

initializeSession();

// Handling all errors by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

//function to create, connect to session
function initializeSession() {
  
  var session = OT.initSession(apiKey, sessionId);


  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
      session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      facingMode: "user",
    }, handleError);
  });

  // Create a publisher
  var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    fitMode: 'cover',
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
      console.log("Connection published");
      
    }
  });
  //console.log(publisher.getStats(handleError));

  var text = document.getElementById("text");
  var msgHistory = document.querySelector('#history');

  //Receive signal for predicted words
  session.on("signal:textMessage", function(event) {
       console.log("Signal sent from connection " + event.from.id);
       console.log(event.data);
       // Process the event.data property, if there is any data.
       text.innerText = event.data;
  });

  //Send message in chat box
  function textChat(str){
    session.signal({
      type: 'signal',
      data: str
    }, function signalCallback(error) {
      if (error) {
        console.error('Error sending signal:', error.name, error.message);
      } else {
        msgTxt.value = '';
      }
    });
  }

  //Event listener if enter is pressed
  var msgTxt = document.querySelector('#msgTxt');
  document.querySelector('#msgTxt').addEventListener('keypress', function (e) {
      var key = e.which || e.keyCode;
      if (key === 13) { // 13 is enter
        // code for enter
        textChat(interviewerUserName +": "+msgTxt.value);
      }
  });

  
    var synth = window.speechSynthesis;
    var utter = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    utter.rate = 1;
    utter.pitch = 0.5;
    utter.voice = voices[3];  
  
  //Receive signal to append in chat box
  session.on('signal', function(event) {
    var msg = document.createElement('p');
    msg.innerText = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    if(msg.className != 'mine'){
      utter.text = msg.innerText;
      window.speechSynthesis.speak(utter);
    }
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
  });

  //funtion call for sppech to text
  //speech();

  function speech(){
    window.SpeechRecognition = window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    let p = document.createElement('p');

    //must run with a server/localhost
    recognition.addEventListener('result', e => {
      const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
      p.textContent = transcript;

        if(e.results[0].isFinal){
          p = document.createElement('p');
          textChat(transcript);
        }
      p.className = 'mine';
    });

     recognition.addEventListener('end', recognition.start); //start listening after a break
     console.log("Speech start");
     recognition.start();
  }
}






