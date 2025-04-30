// Import Firebase core and required services
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "",
  authDomain: "taskmanager-c6224.firebaseapp.com",
  projectId: "taskmanager-c6224",
  storageBucket: "taskmanager-c6224.firebasestorage.app",
  messagingSenderId: "542217555122",
  appId: "1:542217555122:web:2fde10e7e093495fa08dab"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
