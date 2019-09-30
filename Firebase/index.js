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

function getUserRole(uid){

  var db = firebase.firestore();
  var userRef = db.collection("users").doc(uid);
 
  userRef.get().then(function(doc) {
      if (doc.exists) {
          sessionStorage.setItem("uname",doc.data().Name);
          if(doc.data().Role == "Interviewer") {
            window.location.href = "Interviewer.html";
          } else {
            window.location.href = "Interviewee.html";
          }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
  
  /*query.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        if(doc.data().Role == 'Candidate')
        {
          uname = doc.data().Name;
          alert(uname);
          //sessionStorage.setItem("intervieweeUserName",intervieweeUserName);
          location.href = "Interviewee.html";
        }

        else{
          uname = doc.data().Name;
          alert(uname);
          //sessionStorage.setItem("intervieweeUserName",intervieweeUserName);
          location.href = "Interviewer.html";
        }
        
      });
  });*/

  /*query2.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        interviewerUserName = doc.data().Name;
        sessionStorage.setItem("interviewerUserName",interviewerUserName);
        alert(interviewerUserName);
        location.href = "Interviewer.html";
      });
  });*/
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
      }).catch(function(error) {
        // An error happened.
      });
    }
    else {
      alert("Invalid email");
    }


}



function login(){

  var userPass = document.getElementById("password_field").value;
  var userEmail = document.getElementById("email_field").value;
  var resetButton = document.getElementById("resetBtn").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
  });
}

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

function logout() {
  firebase.auth().signOut();
}

//logout upon browser refresh
window.hashchange = logout();