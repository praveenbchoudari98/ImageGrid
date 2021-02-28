import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyCyTRKQXmubugMYAQCwoNpo-P7KHhMIlQQ",
    authDomain: "imagegrid-44b7f.firebaseapp.com",
    projectId: "imagegrid-44b7f",
    storageBucket: "imagegrid-44b7f.appspot.com",
    messagingSenderId: "209793976216",
    appId: "1:209793976216:web:bc686cebcc59bc437e4ded",
    measurementId: "G-QX35QNV68Z"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const firebaseDB= firebase.database();
const fireStorage=firebase.storage();
export {fireStorage,firebaseDB}