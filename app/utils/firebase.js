import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";

// Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyABmQ6DZHMKSSdxWS0teyUdbPib_uVLRPw",
  authDomain: "teeku-masi-cloud-kitchen.firebaseapp.com",
  projectId: "teeku-masi-cloud-kitchen",
  storageBucket: "teeku-masi-cloud-kitchen.firebasestorage.app",
  messagingSenderId: "526608548096",
  appId: "1:526608548096:web:8ee04488c4ac34540eb3e5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { addDoc, auth, collection, db };
