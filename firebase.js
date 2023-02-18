// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGCrR4RuODUJzj0o3BzjSj4FR9XGFzy14",
  authDomain: "cublit.firebaseapp.com",
  projectId: "cublit",
  storageBucket: "cublit.appspot.com",
  messagingSenderId: "777800519507",
  appId: "1:777800519507:web:3dea5175186106851a1ba6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword};
