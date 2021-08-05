import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCU9lLnTHjQl0_t67BUfaGvhvnqf4hsF5g",
    authDomain: "seguridata-in-a-box.firebaseapp.com",
    databaseURL: "https://seguridata-in-a-box-default-rtdb.firebaseio.com",
    projectId: "seguridata-in-a-box",
    storageBucket: "seguridata-in-a-box.appspot.com",
    messagingSenderId: "1038660139301",
    appId: "1:1038660139301:web:b9d817e672a526e31dc2cc",
    measurementId: "G-B0WBRV1VZF"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();
export {auth, db};
export default storage;
