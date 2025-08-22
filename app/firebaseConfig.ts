// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzZ5NgZmixeOO76FytdxkfJJt26TO_51Q",
  authDomain: "dashboard-775ad.firebaseapp.com",
  projectId: "dashboard-775ad",
  storageBucket: "dashboard-775ad.firebasestorage.app",
  messagingSenderId: "124909731959",
  appId: "1:124909731959:web:1dce16fd5671006cdcc672",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
