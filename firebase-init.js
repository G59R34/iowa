// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBojUvZXxV6JMWrPUA95Palrt73jEgrEqo",
  authDomain: "iowa-e875b.firebaseapp.com",
  projectId: "iowa-e875b",
  storageBucket: "iowa-e875b.firebasestorage.app",
  messagingSenderId: "826589602144",
  appId: "1:826589602144:web:e8a9c1b27b4ebcb9cf3e05",
  measurementId: "G-6RQCYY8Y3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);