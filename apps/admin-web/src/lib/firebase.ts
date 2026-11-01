import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBi_yHhv88N6u6zaIMt4FWCKSGMBAF1Z2M",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "clear-exam-5abd0.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "clear-exam-5abd0",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "clear-exam-5abd0.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "310113427304",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:310113427304:web:e9253b1e13a52354ab40dd",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E29GTP8GJQ"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Connect emulators only if explicitly instructed via NEXT_PUBLIC_USE_EMULATORS=true
if (
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_USE_EMULATORS === 'true'
) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch {
    // Avoid re-attaching in Fast Refresh
  }
}
