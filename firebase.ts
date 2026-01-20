
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
  // Added deleteDoc import
  deleteDoc,
  query, 
  where,
  orderBy,
  limit
} from "firebase/firestore";
// @ts-ignore
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

/**
 * Defensive Firebase Configuration
 * We use placeholders if VITE_ environment variables are missing to prevent the 
 * 'auth/invalid-api-key' error which crashes the app on load if apiKey is an empty string.
 */
const firebaseConfig = {
  // @ts-ignore
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AI_GENERATED_PLACEHOLDER_KEY",
  // @ts-ignore
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "placeholder-app.firebaseapp.com",
  // @ts-ignore
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "placeholder-project-id",
  // @ts-ignore
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "placeholder-app.appspot.com",
  // @ts-ignore
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  // @ts-ignore
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:000000000000: web:0000000000000000000000"
};

// Initialize Firebase with the defensive config
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Check if the config is actually a placeholder
// @ts-ignore
export const isFirebaseConfigured = !!import.meta.env?.VITE_FIREBASE_API_KEY && import.meta.env?.VITE_FIREBASE_API_KEY !== "";

// Helper Functions
// Fixed: Added deleteDoc to the exports list to support administrative deletions
export { collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, signInWithPopup, signOut };
