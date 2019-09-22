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

function getUserRole(email){

  var db = firebase.firestore();
  var userRef = db.collection("users");
 
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
          location.href = "Interviewer.html";
      });
  });      
}

function login(){

  var userPass = document.getElementById("password_field").value;
  var userEmail = document.getElementById("email_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
  });
}

firebase.auth().onAuthStateChanged(function(user){
  if (user) {
    // User is signed in.
    var user2 = firebase.auth().currentUser;
    var uid = user.uid;

    if(user2 != null)
    {
      this.userEmail = document.getElementById("email_field").value;
      getUserRole(this.userEmail);
    }
  } else {
    // No user is signed in.
    document.getElementById("login_div").style.display = "block";
  }
});

function logout(){
  firebase.auth().signOut();
}

window.hashchange = logout();