var interviewerUserName = sessionStorage.getItem("uname");
// replace these values with those generated in your TokBox Account
var apiKey = "46417142";
var sessionId = "2_MX40NjQxNzE0Mn5-MTU2ODMwMjY4ODU3M35jUGRGNHFUUHdOSXk4K0pwdGhiMGltZ0N-UH4";
var token = "T1==cGFydG5lcl9pZD00NjQxNzE0MiZzaWc9YzJmNjRlZmUxZDI4OWZmNTdjODU4ZDVjMjc1MDNkN2EwY2U1ZGM0YjpzZXNzaW9uX2lkPTJfTVg0ME5qUXhOekUwTW41LU1UVTJPRE13TWpZNE9EVTNNMzVqVUdSR05IRlVVSGRPU1hrNEswcHdkR2hpTUdsdFowTi1VSDQmY3JlYXRlX3RpbWU9MTU2ODMwMzM3MCZub25jZT0wLjE5NjExMDAxNjg0NDM0NzI2JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1NzA4OTUzNjkmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";
// (optional) add server code here

initializeSession();

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function initializeSession() {
  
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
      session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%',
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

  var text = document.getElementById("text");
  var msgHistory = document.querySelector('#history');

  //Receive signal for predicted words
  session.on("signal:textMessage", function(event) {
       console.log("Signal sent from connection " + event.from.id);
       console.log(event.data);
       // Process the event.data property, if there is any data.
       text.innerText = event.data;
  });

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

  var msgTxt = document.querySelector('#msgTxt');
  document.querySelector('#msgTxt').addEventListener('keypress', function (e) {
      var key = e.which || e.keyCode;
      if (key === 13) { // 13 is enter
        // code for enter
        textChat(interviewerUserName +": "+msgTxt.value);
      }
  });

  session.on('signal', function(event) {
    var msg = document.createElement('p');
    msg.innerText = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
  });

  speech();

  function speech(){
    window.SpeechRecognition = window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    let p = document.createElement('p');

    //must run with a server
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






