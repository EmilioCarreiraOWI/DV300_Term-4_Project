import firebase from 'firebase/app';
import 'firebase/auth';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1NsK_Bq14GOrFsx2azAB5V4VGLjxzKko",
  authDomain: "brevio-8e7be.firebaseapp.com",
  projectId: "brevio-8e7be",
  storageBucket: "brevio-8e7be.appspot.com",
  messagingSenderId: "105541737417",
  appId: "1:105541737417:web:ed0c5bad26663b967f6618",
  measurementId: "G-E5S15DPH9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);

export { firebaseConfig, auth, analytics };