// Standard modular import for Firebase v9+
// @ts-ignore
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where 
} from "firebase/firestore";

// Configuration using Vite environment variables.
// Using optional chaining (?.) ensures that if import.meta.env is undefined, 
// the code doesn't throw a TypeError, falling back to an empty string instead.
const firebaseConfig = {
  // @ts-ignore
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "",
  // @ts-ignore
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "",
  // @ts-ignore
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "",
  // @ts-ignore
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "",
  // @ts-ignore
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  // @ts-ignore
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper Functions
export { collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, query, where };