// Standard modular import for Firebase v9+ to resolve 'no exported member' TypeScript errors.
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, query, where } from "firebase/firestore";

// В Vite переменные окружения ДОЛЖНЫ вызываться полным путем: import.meta.env.VITE_...
// Это необходимо для того, чтобы сборщик мог заменить их на реальные значения.
// Fix: Added @ts-ignore to satisfy the TypeScript compiler for Vite-provided environment variables.
const firebaseConfig = {
  // @ts-ignore
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // @ts-ignore
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // @ts-ignore
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // @ts-ignore
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // @ts-ignore
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // @ts-ignore
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase using the modular initializeApp function.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper Functions
export { collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, query, where };
