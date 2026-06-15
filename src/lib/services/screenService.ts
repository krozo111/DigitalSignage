import { db, auth } from "../firebase.config";
import {
  collection, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where, serverTimestamp, Timestamp,
} from "firebase/firestore";

// Helper to strictly require Auth
const assertAuth = () => {
  if (!auth.currentUser) throw new Error("Access denied: Authentication required.");
};

export interface Screen {
  id: string;
  pairingCode: string | null;
  pairingCodeExpiresAt?: Timestamp | null;
  name: string;
  playlistId: string | null;
  lastSeen: Timestamp | null;
  status: "online" | "offline";
}

/**
 * Claims a screen using its pairingCode, assigning it a name and optional playlist.
 */
export const claimScreen = async (pairingCode: string, name: string, playlistId: string | null): Promise<string> => {
  assertAuth();

  const screensRef = collection(db, "screens");
  const q = query(screensRef, where("pairingCode", "==", pairingCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Invalid pairing code. It may have expired or the screen is no longer available.");
  }

  const screenDoc = querySnapshot.docs[0];
  const data = screenDoc.data();

  // Reject expired pairing codes
  const expiresAt = data.pairingCodeExpiresAt as Timestamp | undefined;
  if (expiresAt && expiresAt.toMillis() < Date.now()) {
    throw new Error("Pairing code expired. Refresh the screen to generate a new one.");
  }

  await updateDoc(screenDoc.ref, {
    name,
    playlistId,
    pairingCode: null,
    pairingCodeExpiresAt: null,
    updatedAt: serverTimestamp(),
  });

  return screenDoc.id;
};

/**
 * Gets all screens (both paired and unpaired).
 */
export const getAllScreens = async (): Promise<Screen[]> => {
  assertAuth();
  
  const screensRef = collection(db, "screens");
  const q = query(screensRef);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Screen));
};

/**
 * Updates name or playlist assignment for a screen.
 */
export const updateScreenDetails = async (id: string, name: string, playlistId: string | null): Promise<void> => {
  assertAuth();

  const screenRef = doc(db, "screens", id);
  await updateDoc(screenRef, {
    name,
    playlistId,
    updatedAt: serverTimestamp()
  });
};

/**
 * Permanently deletes a screen document from Firestore by ID.
 */
export const deleteScreen = async (id: string): Promise<void> => {
  assertAuth();
  await deleteDoc(doc(db, "screens", id));
};

/**
 * Checks if a screen document exists in Firestore.
 */
export const screenExists = async (id: string): Promise<boolean> => {
  assertAuth();
  const screenRef = doc(db, "screens", id);
  const snap = await getDoc(screenRef);
  return snap.exists();
};

/**
 * Purges stale/orphan screen documents:
 * - Screens still named "New TV" (never claimed)
 * - Screens with lastSeen older than 24 hours
 * Returns the count of deleted documents.
 */
export const purgeStaleScreens = async (): Promise<number> => {
  assertAuth();

  const screensRef = collection(db, "screens");
  const allScreensSnap = await getDocs(query(screensRef));
  
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  let deletedCount = 0;

  for (const screenDoc of allScreensSnap.docs) {
    const data = screenDoc.data();
    const name = data.name || "";
    const lastSeen = data.lastSeen;

    // Condition 1: Never given a real name (unclaimed)
    const isUnnamed = name === "New TV" || name === "Nueva TV" || name.trim() === "";

    // Condition 2: Last seen more than 24h ago
    let isStale = false;
    if (lastSeen) {
      const lastSeenMs = lastSeen instanceof Timestamp
        ? lastSeen.toMillis()
        : new Date(lastSeen).getTime();
      isStale = (now - lastSeenMs) > TWENTY_FOUR_HOURS;
    }

    // Only purge abandoned screens: unclaimed AND not seen in 24h. A freshly
    // registered "New TV" is still heartbeating (fresh lastSeen) while it shows
    // its pairing QR, so it is NOT stale and must survive a purge.
    if (isUnnamed && isStale) {
      await deleteDoc(screenDoc.ref);
      deletedCount++;
    }
  }

  return deletedCount;
};
