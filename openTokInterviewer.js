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
      height: '100%'
    }, handleError);
  });

  // Create a publisher
  var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    fitMode: 'cover'
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

  //Receive signal
  session.on("signal", function(event) {
       console.log("Signal sent from connection " + event.from.id);
       console.log(event.data);
       // Process the event.data property, if there is any data.
  });


  


}

