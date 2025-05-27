import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  // These are demo/development values - replace with your actual Firebase config
  apiKey: "demo-api-key",
  authDomain: "french-bac-game.firebaseapp.com",
  projectId: "french-bac-game",
  storageBucket: "french-bac-game.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 