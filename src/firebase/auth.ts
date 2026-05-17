// Firebase Auth सर्विस फंक्शन्स
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { auth, db } from './config';
import type { UserRole } from '@/types';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  // name alias for backward compat
  name?: string;
  role: UserRole;
  isAdmin: boolean;
  // Optional extended profile fields
  avatar?: string;
  bio?: string;
  verified?: boolean;
  socials?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  stats?: {
    followers?: number;
    engagement?: number;
    campaignsCompleted?: number;
    totalEarned?: number;
  };
  createdAt?: unknown;
}

// पहला यूज़र है? (Super Admin बनेगा)
async function isFirstUser(): Promise<boolean> {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.empty;
}

// Registration
export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
): Promise<{ user: AppUser | null; error: string | null }> {
  try {
    const firstUser = await isFirstUser();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    const appUser: AppUser = {
      uid,
      email,
      displayName,
      name: displayName,
      role,
      isAdmin: firstUser,
    };

    await setDoc(doc(db, 'users', uid), {
      ...appUser,
      createdAt: serverTimestamp(),
    });

    return { user: appUser, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    return { user: null, error: mapFirebaseError(msg) };
  }
}

// Login
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: AppUser | null; error: string | null }> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const appUser = await getUserData(credential.user.uid);
    return { user: appUser, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed';
    return { user: null, error: mapFirebaseError(msg) };
  }
}

// Firestore से यूज़र डेटा लाना
export async function getUserData(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data() as AppUser;
  // name alias sync
  if (!data.name && data.displayName) data.name = data.displayName;
  return data;
}

// Logout
export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

// Auth state listener
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Firebase error को Hindi/English में map करना
function mapFirebaseError(msg: string): string {
  if (msg.includes('email-already-in-use')) return 'यह email पहले से registered है।';
  if (msg.includes('invalid-email')) return 'Invalid email address।';
  if (msg.includes('weak-password')) return 'Password कम से कम 6 characters का होना चाहिए।';
  if (msg.includes('user-not-found')) return 'कोई account नहीं मिला। पहले register करें।';
  if (msg.includes('wrong-password')) return 'Password गलत है।';
  if (msg.includes('invalid-credential')) return 'Email या password गलत है।';
  if (msg.includes('too-many-requests')) return 'बहुत ज़्यादा attempts। थोड़ी देर बाद try करें।';
  if (msg.includes('network-request-failed')) return 'Network error। Internet connection check करें।';
  return msg;
}
