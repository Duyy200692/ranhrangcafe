import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMvdS_ftYc0ZbjIH8cTADqD9-SQaIUidQ",
  authDomain: "ranhrangcafe.firebaseapp.com",
  projectId: "ranhrangcafe",
  storageBucket: "ranhrangcafe.firebasestorage.app",
  messagingSenderId: "562187456921",
  appId: "1:562187456921:web:e03855a1536221f8694308"
};

// Initialize Firebase safely
let app;
let storageInstance;
let dbInstance;

try {
  app = initializeApp(firebaseConfig);
  storageInstance = getStorage(app);
  dbInstance = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export const storage = storageInstance;
export const db = dbInstance;
