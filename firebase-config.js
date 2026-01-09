// Firebase Configuration
// Replace these values with your Firebase project config
// Get these from: Firebase Console → Project Settings → General → Your apps

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT-Mk7u7XDYqRY1kXB99QgDm5orpoa71M",
  authDomain: "oscarbb-ec8f9.firebaseapp.com",
  databaseURL: "https://oscarbb-ec8f9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oscarbb-ec8f9",
  storageBucket: "oscarbb-ec8f9.firebasestorage.app",
  messagingSenderId: "919577545208",
  appId: "1:919577545208:web:fbee83cb5c4a7405066e0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get reference to the database
const database = firebase.database();
