// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtnF319NCXOMYsodzu_kJBZXK-L-kq2ds",
  authDomain: "flight-finder-dbc1c.firebaseapp.com",
  projectId: "flight-finder-dbc1c",
  storageBucket: "flight-finder-dbc1c.firebasestorage.app",
  messagingSenderId: "741687884237",
  appId: "1:741687884237:web:15c60016117a6fbe6c6c84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);