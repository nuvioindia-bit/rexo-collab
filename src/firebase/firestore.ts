// Firestore सर्विस फंक्शन्स
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import type { Campaign, Application, Transaction } from '@/types';

// ─── Banners ──────────────────────────────────────────────

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
  order: number;
  createdAt?: unknown;
}

export function subscribeBanners(cb: (banners: Banner[]) => void): Unsubscribe {
  const q = query(collection(db, 'banners'), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner)));
  });
}

export async function addBanner(banner: Omit<Banner, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'banners'), { ...banner, createdAt: serverTimestamp() });
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<void> {
  await updateDoc(doc(db, 'banners', id), data);
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(doc(db, 'banners', id));
}

// ─── Campaigns ────────────────────────────────────────────

export function subscribeCampaigns(cb: (campaigns: Campaign[]) => void): Unsubscribe {
  const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Campaign)));
  });
}

export async function addCampaign(campaign: Omit<Campaign, 'id'>): Promise<void> {
  await addDoc(collection(db, 'campaigns'), { ...campaign, createdAt: serverTimestamp() });
}

export async function deleteCampaign(id: string): Promise<void> {
  await deleteDoc(doc(db, 'campaigns', id));
}

// ─── Applications ─────────────────────────────────────────

export function subscribeApplications(userId: string, cb: (apps: Application[]) => void): Unsubscribe {
  const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Application));
    cb(all.filter((a) => a.creatorId === userId));
  });
}

export async function addApplication(app: Omit<Application, 'id'>): Promise<void> {
  await addDoc(collection(db, 'applications'), { ...app, createdAt: serverTimestamp() });
}

// ─── Transactions ─────────────────────────────────────────

export function subscribeTransactions(userId: string, cb: (txns: Transaction[]) => void): Unsubscribe {
  const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => {
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
    cb(all.filter((t) => t.userId === userId));
  });
}

// ─── Users (admin) ────────────────────────────────────────

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid));
}
