import { db, storage, auth } from "../firebase.config";
import { 
  collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Helper to strictly require Auth
const assertAuth = () => {
  if (!auth.currentUser) throw new Error("Acceso denegado: Se requiere autenticación.");
};

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "vid" | "img" | "unknown";
  size: number;
  storagePath: string;
  createdAt: any;
}

/**
 * Sube un archivo a Firebase Storage y guarda la referencia en Firestore
 */
export const uploadMedia = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  assertAuth();

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`El archivo ${file.name} excede el límite de 50MB.`);
  }

  // 1. Upload to Storage
  const storagePath = `media/${auth.currentUser?.uid}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);
  
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        // 2. Obtain URL
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const type = file.type.startsWith("video/") ? "vid" : file.type.startsWith("image/") ? "img" : "unknown";

        // 3. Save to Firestore
        const docRef = await addDoc(collection(db, "media"), {
          name: file.name,
          url,
          type,
          size: file.size,
          storagePath,
          createdAt: serverTimestamp(),
        });
        
        resolve(docRef.id);
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

/**
 * Elimina un recurso de Storage y luego de Firestore
 */
export const deleteMedia = async (id: string, storagePath: string): Promise<void> => {
  assertAuth();

  // 1. Remove from Storage
  const storageRef = ref(storage, storagePath);
  try {
    await deleteObject(storageRef);
  } catch (err: any) {
    if (err.code !== "storage/object-not-found") {
      throw err; // Solo lanzamos si falla por algo distinto a que el archivo ya no exista
    }
  }

  // 2. Remove document from Firestore
  await deleteDoc(doc(db, "media", id));
};
