//firebase configuration
var config = {
  apiKey: "AIzaSyCSknLFSZ9heejCU7P_1w8wzHxf21xIyYQ",
  authDomain: "fypdatabase-c8728.firebaseapp.com",
  databaseURL: "https://fypdatabase-c8728.firebaseio.com",
  projectId: "fypdatabase-c8728",
  storageBucket: "",
  messagingSenderId: "894982810977",
  appId: "1:894982810977:web:29df3aafd48d14f7eda920"
};

//initialize firebase
firebase.initializeApp(config);

//set cache to unlimited
firebase.firestore().settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

//enable offline database
firebase.firestore().enablePersistence();

function getRoomID() {

  var userPass = document.getElementById("password_field").value;
  var userEmail = document.getElementById("email_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      user = firebase.auth().currentUser;
      var uid = user.uid;
      var cemail;

      var db = firebase.firestore();
      var userRef = db.collection("users").doc(uid);

      userRef.get().then(function(doc) {
          if (doc.exists) {
              if(doc.data().Role == "Interviewer") {
                document.getElementById("room_id").innerHTML = "Enter your candidate email";
                var ridi = document.createElement("INPUT");
                ridi.setAttribute("id","ridi");
                document.getElementById("room_id").appendChild(ridi);
                document.getElementById("room_id").disabled = true;


                $("#ridi").on('keyup', function (e) {
                    if (e.keyCode === 13) {
                        // Do something
                        cemail = document.getElementById("ridi").value;
                        console.log(cemail);
                        var userRef2 = db.collection("users");

                        var query = userRef2.where("Email", "==", cemail)
                          .get()
                          .then(function(querySnapshot) {
                              querySnapshot.forEach(function(doc) {
                                  // doc.data() is never undefined for query doc snapshots
                                  console.log(doc.id, " => ", doc.data().RoomID);
                                  var ridi2 = document.createElement("INPUT");
                                  ridi2.setAttribute("id","ridi2");
                                  document.getElementById("room_id").appendChild(ridi2);
                                  ridi2.value = doc.data().RoomID;
                                  document.getElementById("room_id").disabled = true;
                              });
                          })
                          .catch(function(error) {
                              console.log("Error getting documents: ", error);
                          });
                    }
                });
              } 
              else 
              {
                var rid = document.createElement("INPUT");
                rid.value = doc.data().RoomID;
                document.getElementById("room_id").appendChild(rid);
                document.getElementById("room_id").disabled = true;
                //document.getElementById("room_id").value = doc.data().RoomID;
              }
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    } 
    else {
      // No user is signed in.
      alert("Room ID will automatically filled based on your email");
    }
  });
}


function getUserRole(uid) {

  var db = firebase.firestore();
  var userRef = db.collection("users").doc(uid);
  userRef.get().then(function(doc) {
      if (doc.exists) {
          sessionStorage.setItem("uname",doc.data().Name);
          if(doc.data().Role == "Interviewer") {
            window.location.href = "Interviewer.html";
          } else {
            document.getElementById("room_id").value = doc.data().RoomID;
            window.location.href = "Interviewee.html";
          }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}

function resetPassword() {
    var userPass = document.getElementById("password_field").value;
    var userEmail = document.getElementById("email_field").value;
    var resetButton = document.getElementById("resetBtn").value;

    if(userEmail) {

      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(userEmail).toLowerCase())) {
        alert("Bad email format");
      }

      var auth = firebase.auth();
      auth.sendPasswordResetEmail(userEmail).then(function() {
        // Email sent.
        console.log(userEmail);
        alert("An email has been sent to " + userEmail);
      }).catch(function(error) {
        // An error happened.
      });
    }
    else {
      alert("Invalid email");
    }
}

function login() {
  var userPass = document.getElementById("password_field").value;
  var userEmail = document.getElementById("email_field").value;
  var resetButton = document.getElementById("resetBtn").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      user = firebase.auth().currentUser;
      var uid = user.uid;

      if(user != null) {
        this.userEmail = document.getElementById("email_field").value;
        getUserRole(uid);
      }
      
    } 
    else {
      // No user is signed in.
      document.getElementById("login_div").style.display = "block";
    }
  });

}
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      user = firebase.auth().currentUser;
      var uid = user.uid;

      if(user != null) {
        this.userEmail = document.getElementById("email_field").value;
      }
      
    } 
    else {
      // No user is signed in.
      document.getElementById("login_div").style.display = "block";
    }
  });



function logout() {
  firebase.auth().signOut();
}


//logout upon browser refresh
window.hashchange = logout();