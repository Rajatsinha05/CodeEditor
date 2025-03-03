// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtiwdFNcpVHseoS6440BlR9lrQNXJXFb8",
  authDomain: "code-3d102.firebaseapp.com",
  projectId: "code-3d102",
  storageBucket: "code-3d102.firebasestorage.app",
  messagingSenderId: "987312792099",
  appId: "1:987312792099:web:9b09b7599db7af838c4796",
  measurementId: "G-8KJB7FGE4H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);