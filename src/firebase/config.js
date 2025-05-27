import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxYlHs-LtENGH9qHDjxLepdWhtN5p_2gU",
  authDomain: "back-to-bac-579b7.firebaseapp.com",
  projectId: "back-to-bac",
  storageBucket: "back-to-bac.firebasestorage.app",
  messagingSenderId: "163549846532",
  appId: "1:163549846532:web:8ee65504271f016ac66951"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 