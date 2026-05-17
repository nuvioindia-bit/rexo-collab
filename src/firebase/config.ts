// ============================================================
// Firebase Configuration
// ============================================================
// Apna Firebase project ka config yahan bharo:
// Firebase Console → Project Settings → Your apps → Web app → SDK setup
//
// Step 1: https://console.firebase.google.com/ par jayein
// Step 2: New project banayein ya existing select karein
// Step 3: Project Settings → Add app → Web (</>)
// Step 4: Niche diye gaye object mein apna config paste karein
// ============================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB9iVTogKoJchxijTmN0ue4KzqgF7LPwxc",
  authDomain: "plex-collab.firebaseapp.com",
  databaseURL: "https://plex-collab-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "plex-collab",
  storageBucket: "plex-collab.firebasestorage.app",
  messagingSenderId: "48078048410",
  appId: "1:48078048410:web:1e8b3cc5791beb6b2d6323",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
