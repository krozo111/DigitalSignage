import { db, auth } from "../firebase.config";
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, serverTimestamp, query, orderBy 
} from "firebase/firestore";

// Helper to strictly require Auth
const assertAuth = () => {
  if (!auth.currentUser) throw new Error("Acceso denegado: Se requiere autenticación.");
};

export interface PlaylistItem {
  mediaId: string;
  duration: number; // en segundos
  order: number;
}

export interface Playlist {
  id: string;
  name: string;
  items: PlaylistItem[];
  createdAt: any;
  updatedAt: any;
}

/**
 * Crea una nueva lista de reproducción asociándole un array de elementos (Media items)
 */
export const createPlaylist = async (name: string, items: PlaylistItem[] = []): Promise<string> => {
  assertAuth();

  const docRef = await addDoc(collection(db, "playlists"), {
    name,
    items,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Obtiene todas las listas de reproducción
 */
export const getAllPlaylists = async (): Promise<Playlist[]> => {
  assertAuth();
  
  const q = query(collection(db, "playlists"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  } as Playlist));
};

/**
 * Obtiene una lista por ID
 */
export const getPlaylistById = async (id: string): Promise<Playlist | null> => {
  assertAuth();
  
  const docRef = doc(db, "playlists", id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() } as Playlist;
};

/**
 * Actualiza el nombre o los elementos (Medios, duración u orden) de la lista de reproducción
 */
export const updatePlaylist = async (id: string, name: string, items: PlaylistItem[]): Promise<void> => {
  assertAuth();

  const playlistRef = doc(db, "playlists", id);
  await updateDoc(playlistRef, {
    name,
    items,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Elimina la lista de reproducción
 * Nota: Puede que necesites manejar lógica adicional si la lista estaba asignada a alguna pantalla.
 */
export const deletePlaylist = async (id: string): Promise<void> => {
  assertAuth();

  await deleteDoc(doc(db, "playlists", id));
};
