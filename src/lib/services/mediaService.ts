import { db, storage, auth } from "../firebase.config";
import {
  collection, addDoc, doc, getDocs, orderBy, query, serverTimestamp, writeBatch, Timestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import type { PlaylistItem } from "./playlistService";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/quicktime", "video/webm"];

const SIGNATURES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  "video/webm": [0x1a, 0x45, 0xdf, 0xa3],
};

function sanitizeFileName(name: string): string {
  // Strip directory components and dangerous characters
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[._]+/, "");
  const trimmed = cleaned.length > 100 ? cleaned.slice(-100) : cleaned;
  return trimmed || "file";
}

async function validateFileType(file: File): Promise<void> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type not allowed: ${file.type || "unknown"}. Choose a supported image or video.`);
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const startsWith = (signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  let matches = SIGNATURES[file.type] ? startsWith(SIGNATURES[file.type]) : false;

  if (file.type === "image/gif") {
    const header = new TextDecoder().decode(bytes.slice(0, 6));
    matches = header === "GIF87a" || header === "GIF89a";
  } else if (file.type === "image/webp") {
    matches = startsWith([0x52, 0x49, 0x46, 0x46]) &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  } else if (file.type === "video/mp4" || file.type === "video/quicktime") {
    const isFtyp = new TextDecoder().decode(bytes.slice(4, 8)) === "ftyp";
    const brand = new TextDecoder().decode(bytes.slice(8, 12));
    matches = isFtyp && (file.type === "video/mp4" || brand === "qt  ");
  }

  if (!matches) {
    throw new Error(`File content does not match its declared type (${file.type}).`);
  }
}

// Helper to strictly require Auth
const assertAuth = () => {
  if (!auth.currentUser) throw new Error("Access denied. Sign in to continue.");
};

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "vid" | "img" | "unknown";
  size: number;
  storagePath: string;
  createdAt: Timestamp | null;
}

/**
 * Upload a file to Firebase Storage and save its Firestore record.
 */
export const uploadMedia = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  assertAuth();

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${file.name} exceeds the 50 MB file limit.`);
  }

  await validateFileType(file);

  // 1. Upload to Storage
  const safeName = sanitizeFileName(file.name);
  const storagePath = `media/${auth.currentUser?.uid}/${crypto.randomUUID()}_${safeName}`;
  const storageRef = ref(storage, storagePath);
  
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        void deleteObject(storageRef).catch((cleanupError) => {
          if ((cleanupError as { code?: string }).code !== "storage/object-not-found") {
            console.error("Storage cleanup failed after an interrupted upload.", cleanupError);
          }
        });
        reject(error);
      },
      () => {
        void (async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            const type = file.type.startsWith("video/") ? "vid" : "img";
            const docRef = await addDoc(collection(db, "media"), {
              name: file.name,
              url,
              type,
              size: file.size,
              storagePath,
              createdAt: serverTimestamp(),
            });
            resolve(docRef.id);
          } catch (error) {
            let cleanupFailed = false;
            try {
              await deleteObject(storageRef);
            } catch (cleanupError) {
              if ((cleanupError as { code?: string }).code !== "storage/object-not-found") {
                cleanupFailed = true;
                console.error("Uploaded object cleanup failed after metadata write error.", cleanupError);
              }
            }
            reject(cleanupFailed
              ? new Error("Upload could not be finalized, and the unused Storage file could not be removed.")
              : error);
          }
        })();
      }
    );
  });
};

/**
 * Obtiene todos los recursos multimedia de Firestore
 */
export const getAllMedia = async (): Promise<MediaItem[]> => {
  assertAuth();
  const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as MediaItem));
};

export const cleanupMediaStorage = async (storagePath: string): Promise<void> => {
  assertAuth();
  try {
    await deleteObject(ref(storage, storagePath));
  } catch (err) {
    if ((err as { code?: string }).code !== "storage/object-not-found") throw err;
  }
};

/**
 * Remove a media item and all playlist references atomically, then clean up its
 * Storage object. Cleanup failures are reported without leaving broken playlists.
 */
export const deleteMedia = async (id: string, storagePath: string): Promise<{ storageCleanupPending: boolean }> => {
  assertAuth();

  // Remove playlist references before deleting the object so a failed database
  // write cannot leave playlists pointing to an unavailable file.
  // Firestore can't query an array of objects by a nested field, so we scan
  // playlists and filter in memory — acceptable at this catalog size.
  const batch = writeBatch(db);
  const playlistsSnap = await getDocs(collection(db, "playlists"));
  playlistsSnap.forEach((plDoc) => {
    const items = (plDoc.data().items ?? []) as PlaylistItem[];
    if (items.some((item) => item.mediaId === id)) {
      const filtered = items
        .filter((item) => item.mediaId !== id)
        .map((item, index) => ({ ...item, order: index }));
      batch.update(plDoc.ref, { items: filtered, updatedAt: serverTimestamp() });
    }
  });
  batch.delete(doc(db, "media", id));

  await batch.commit();

  try {
    await cleanupMediaStorage(storagePath);
    return { storageCleanupPending: false };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "storage/object-not-found") return { storageCleanupPending: false };
    console.error("Media record deleted but Storage cleanup failed.", err);
    return { storageCleanupPending: true };
  }
};
