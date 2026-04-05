import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA-Vwc6Le99KO8p5mUQU99-clJ7FCG784o",
  authDomain: "jeewan-platform.firebaseapp.com",
  projectId: "jeewan-platform",
  storageBucket: "jeewan-platform.firebasestorage.app",
  messagingSenderId: "47188687841",
  appId: "1:47188687841:web:a8b9c0d1e2f3a4b5c6d7e8",
  measurementId: "G-XXXXXXXXXX",
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
