import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSTHfN61jc1tUOcJqPRmR9Dlq6KAP8UyM",
  authDomain: "ttt-react-ts.firebaseapp.com",
  projectId: "ttt-react-ts",
  storageBucket: "ttt-react-ts.firebasestorage.app",
  messagingSenderId: "907355266283",
  appId: "1:907355266283:web:1989e9a2fd2e8f9ad732ae",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
