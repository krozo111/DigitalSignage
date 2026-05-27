import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// App Check — runs only in the browser. Requires NEXT_PUBLIC_APP_CHECK_SITE_KEY
// (reCAPTCHA v3 site key registered in Firebase Console → App Check).
// In dev, set NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN to bypass with a registered debug token.
if (typeof window !== "undefined") {
  const siteKey = process.env.NEXT_PUBLIC_APP_CHECK_SITE_KEY;
  if (siteKey) {
    if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN) {
      (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
        process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN;
    }
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (err) {
      // Multiple init or unsupported environment — safe to ignore
      console.warn("App Check init skipped:", err);
    }
  }
}

const auth = getAuth(app);

function createDb(): Firestore {
  if (typeof window === "undefined") return getFirestore(app);
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    return getFirestore(app);
  }
}

const db = createDb();

const storage = getStorage(app);

export { app, auth, db, storage };
