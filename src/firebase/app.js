// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_apiKey,
  // authDomain: import.meta.env.VITE_authDomain,
  // projectId: import.meta.env.VITE_projectId,
  // storageBucket: import.meta.env.VITE_storageBucket,
  // messagingSenderId: import.meta.env.VITE_messagingSenderId,
  // appId: import.meta.env.VITE_appId,
  apiKey: "AIzaSyCbQV5Oq4iQf2GrRuOiTktr1nrzrb4ktCs",
  projectId: "round-honor-401914",
  authDomain: "round-honor-401914.firebaseapp.com",
  storageBucket: "round-honor-401914.appspot.com",
  messagingSenderId: "302852542621",
  appId: "1:302852542621:web:b6bd4c92deb46eab308474",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
