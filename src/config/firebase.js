// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD5z_KyNG9csSIsJvC8SCWPZnHqiEmbIBc",
  authDomain: "test-bank-fc870.firebaseapp.com",
  projectId: "test-bank-fc870",
  storageBucket: "test-bank-fc870.appspot.com",
  messagingSenderId: "191453905931",
  appId: "1:191453905931:web:1966c6c0e482c2779d330e",
  measurementId: "G-QSPNCP4BKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const db = getFirestore(app);