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

function getEmail(email){

  var query = userRef.where("Email", "==", email).where("Role", "==", "Candidate");
  var query2 = userRef.where("Email", "==", email).where("Role", "==", "Interviewer"); 
    
  query.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          window.location.href = "Interviewee.html";
      });
  });

  query2.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          window.location.href = "Interviewer.html";
      });
  });      
}

var db = firebase.firestore();
var userRef = db.collection("users");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user2 = firebase.auth().currentUser;
    var uid = user.uid;

    if(user2 != null)
      window.alert("Your Id:  " + uid);

  } else {
    // No user is signed in.
    document.getElementById("login_div").style.display = "block";
  }

});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  getEmail(userEmail);

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
  });
}

function logout(){
  firebase.auth().signOut();
}

window.hashchange = logout();