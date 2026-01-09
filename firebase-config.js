// Firebase Configuration
// Replace these values with your Firebase project config
// Get these from: Firebase Console → Project Settings → General → Your apps

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

// Initialize Firebase (using compat SDK)
// Note: firebase variable should be available from firebase-app-compat.js
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Make sure firebase-app-compat.js and firebase-database-compat.js are loaded before this script.');
}

firebase.initializeApp(firebaseConfig);

// Get reference to the database (must be in global scope for script.js)
const database = firebase.database();
