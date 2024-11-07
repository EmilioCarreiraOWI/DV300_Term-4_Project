import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
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

// Initialize Analytics if supported
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Initialize Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const storage = getStorage(app);
const firestore = getFirestore(app);

export { firebaseConfig, auth, analytics, storage, firestore };
