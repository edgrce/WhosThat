import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiyBfMQ8a57klk3t7Rpyvr_L5oq3pBhBk",
  authDomain: "undercover-6db03.firebaseapp.com",
  projectId: "undercover-6db03",
  storageBucket: "undercover-6db03.appspot.com",
  messagingSenderId: "550483714426",
  appId: "1:550483714426:web:cbb66b1939346fc9ffb6c3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);