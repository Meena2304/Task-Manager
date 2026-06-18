import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUmen2zY6oxzmpKL2VEJoDI_cl56KU4oM",
  authDomain: "tasknest-adaba.firebaseapp.com",
  projectId: "tasknest-adaba",
  storageBucket: "tasknest-adaba.firebasestorage.app",
  messagingSenderId: "3339364283",
  appId: "1:3339364283:web:9f25ae306c3e4c1f62069e",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);