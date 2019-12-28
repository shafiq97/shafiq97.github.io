var intervieweeUserName = sessionStorage.getItem("uname");
var sessionId = sessionStorage.getItem("room_id");



// replace these values with those generated in your TokBox Account
var apiKey = "46417142";
var sessionId = "2_MX40NjQxNzE0Mn5-MTU2ODMwMjY4ODU3M35jUGRGNHFUUHdOSXk4K0pwdGhiMGltZ0N-UH4";
var token = "T1==cGFydG5lcl9pZD00NjQxNzE0MiZzaWc9YmRjY2U2ZjAwMWEzOTMwMThkNmVhM2JmZWFiYjc5ZGIzYTE0ZjhkMzpzZXNzaW9uX2lkPTJfTVg0ME5qUXhOekUwTW41LU1UVTJPRE13TWpZNE9EVTNNMzVqVUdSR05IRlVVSGRPU1hrNEswcHdkR2hpTUdsdFowTi1VSDQmY3JlYXRlX3RpbWU9MTU3NzU3NzQyMiZub25jZT0wLjQyMzEwNjk4ODEyMDM2Njg0JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1ODAxNjk0MjEmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";
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
    name: intervieweeUserName
  }, handleError);
  
  var nodeValue = "";
  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } 
    else {
      session.publish(publisher, handleError);
      console.log("Connected to the session");

      const text = document.querySelector('#translationText');
      const observer = new MutationObserver(mutations => {
          mutations.forEach(record => {
            if(typeof record.addedNodes[0] != 'undefined')
            {
              this.newText = record.addedNodes[0].nodeValue;
            }
            else{
              this.newText = " ";
            }
            console.log(this.newText);
            //Send signal to all clients
            session.signal(
              {
                type:"textMessage",
                data:"" + this.newText
              },
              function(error) {
                if (error) {
                  console.log("signal error (" + error.name + "): " + error.message);
                } else {
                  console.log("signal sent.");
                }
              }
            );
          });
      });

      observer.observe(text, {
        childList: true
      });

      // Text chat
      function textChat(){
        session.signal({
          type: 'signal',
          data: intervieweeUserName +": "+ msgTxt.value
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
            textChat();
          }
      });
      
      var msgHistory = document.querySelector('#history');
      session.on('signal', function(event) {
        var msg = document.createElement('p');
        msg.innerText = event.data;
        msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
        msgHistory.appendChild(msg);
        msg.scrollIntoView();
      });

      /*session.on('signal:speech', function(event) {
        var speech = document.createElement('p');
        speech.innerText = event.data;
        console.log("receive message:" + event.data);
        msgHistory.appendChild(speech);
        speech.scrollIntoView();
      });*/

    }
  });


  
}

