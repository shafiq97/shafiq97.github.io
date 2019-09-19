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
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
      console.log("Connected to the session");
      const text = document.querySelector('#translationText');

      const observer = new MutationObserver(mutations => {
          mutations.forEach(record => {
            this.newText = record.addedNodes[0].nodeValue;
            console.log(this.newText);
            session.signal(
              {
                type:'string',
                data:this.newText
              },
              function(error) {
                if (error) {
                  console.log("signal error (" + error.name + "): " + error.message);
                } else {
                  console.log("signal sent.");
                }
              }
            );
            //mutations observer
          });
      });

      observer.observe(text, {
        childList: true
      });
      
      
    }
  });

  
}

