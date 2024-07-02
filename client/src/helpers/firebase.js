// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log('firebase');
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "eduverse-68bf6.firebaseapp.com",
  projectId: "eduverse-68bf6",
  storageBucket: "eduverse-68bf6.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSANGER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log(firebaseConfig);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);