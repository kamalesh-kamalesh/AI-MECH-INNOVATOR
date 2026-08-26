import { initializeApp, getApps, getApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: "AIzaSyBZLNb0hrvyBRFBSssrXb60uD9RF9CDvqE",
  authDomain: "aimech-6f791.firebaseapp.com",
  projectId: "aimech-6f791",
  storageBucket: "aimech-6f791.firebasestorage.app",
  messagingSenderId: "287316231942",
  appId: "1:287316231942:web:a4f48570e4d19a22f04087",
  measurementId: "G-CFSLJC8LK4"
};

// Initialize Firebase (guard against re-initialization during hot module replacement)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export default app;
