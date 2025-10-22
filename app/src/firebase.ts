import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCL6m4nlWC3ziXgbApZa9179eQI5aSUm1A",
  authDomain: "branch-brook-park-app.firebaseapp.com",
  projectId: "branch-brook-park-app",
  storageBucket: "branch-brook-park-app.firebasestorage.app",
  messagingSenderId: "770225622265",
  appId: "1:770225622265:web:ecd6ae6b80414ce4ffe628",
  measurementId: "G-PBCHENC0D6"
};

// initialize Firebase object
const app = initializeApp(firebaseConfig);

// initialize Cloud Firestore object
export const db = getFirestore(app);
