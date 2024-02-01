// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  
  authDomain: "kiwiestates-85b99.firebaseapp.com",
  projectId: "kiwiestates-85b99",
  storageBucket: "kiwiestates-85b99.appspot.com",
  messagingSenderId: "189496671481",
  appId: "1:189496671481:web:864c5737f9e4c452b4b628"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);