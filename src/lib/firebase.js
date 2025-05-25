import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyDMPsGGmEVPg9jKbZhNfBGYHkAHfBJbyrQ",
  authDomain: "workout-together-3a984.firebaseapp.com",
  projectId: "workout-together-3a984",
  storageBucket: "workout-together-3a984.firebasestorage.app",
  messagingSenderId: "896395804575",
  appId: "1:896395804575:web:1e638ed29833adaf9387aa",
  measurementId: "G-GFCPLH5XG6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };