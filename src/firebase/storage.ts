// Firebase Storage सर्विस फंक्शन्स
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Image अपलोड करना (Banner के लिए)
export async function uploadImage(
  file: File,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // File size check (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'Image size 5MB से ज़्यादा नहीं होनी चाहिए।' };
    }
    // Format check
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'सिर्फ image files allowed हैं।' };
    }
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { url, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    return { url: null, error: msg };
  }
}

// Image delete करना
export async function deleteImage(url: string): Promise<void> {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch {
    // Already deleted या not found - silently ignore
  }
}

// Banner image upload (unique path generate करके)
export async function uploadBannerImage(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `banners/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  return uploadImage(file, path);
}
