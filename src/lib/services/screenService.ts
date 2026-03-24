import { db, auth } from "../firebase.config";
import { 
  collection, updateDoc, doc, getDocs, query, where, serverTimestamp, orderBy 
} from "firebase/firestore";

// Helper to strictly require Auth
const assertAuth = () => {
  if (!auth.currentUser) throw new Error("Acceso denegado: Se requiere autenticación.");
};

export interface Screen {
  id: string;
  pairingCode: string | null;
  name: string;
  playlistId: string | null; // Null si no tiene lista asignada
  lastSeen: any;
  status: "online" | "offline";
}

/**
 * Busca el dispositivo usando el `pairingCode` y, si lo encuentra, 
 * lo "reclama" asignándole el nombre y la Playlist, de lo contrario lanza un error.
 */
export const claimScreen = async (pairingCode: string, name: string, playlistId: string): Promise<string> => {
  assertAuth();

  const screensRef = collection(db, "screens");
  const q = query(screensRef, where("pairingCode", "==", pairingCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("El código de emparejamiento es inválido, caducó o la pantalla ya no está disponible.");
  }

  const screenDoc = querySnapshot.docs[0];

  // Reclama la pantalla
  await updateDoc(screenDoc.ref, {
    name,
    playlistId,
    pairingCode: null, // Borramos el código para evitar múltiples "claims"
    updatedAt: serverTimestamp(),
  });

  return screenDoc.id;
};

/**
 * Obtiene todas las pantallas sincronizadas
 */
export const getAllScreens = async (): Promise<Screen[]> => {
  assertAuth();
  
  const screensRef = collection(db, "screens");
  // Ordenar o traer todo (asumimos pocas TVs por ahora)
  const q = query(screensRef);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Screen));
};

/**
 * Permite cambiar el nombre o el playlist asignado a una pantalla en cualquier momento
 */
export const updateScreenDetails = async (id: string, name: string, playlistId: string): Promise<void> => {
  assertAuth();

  const screenRef = doc(db, "screens", id);
  await updateDoc(screenRef, {
    name,
    playlistId,
    updatedAt: serverTimestamp()
  });
};

/**
 * Elimina o "desempareja" la pantalla desde el Dashboard
 */
export const deleteScreen = async (id: string): Promise<void> => {
  assertAuth();

  // Puedes decidir borrarla por completo, o reiniciarle el 'pairingCode' 
  // para que vuelva a mostrar el código en la TV.
  const screenRef = doc(db, "screens", id);
  await updateDoc(screenRef, {
    playlistId: null,
    name: "Desconectada",
    // Esta parte requerirá que el frontend del player genere un nuevo código 
    // y lo escuche, pero para el Dashboard esto basta como "desemparejamiento temporal"
  });
};
