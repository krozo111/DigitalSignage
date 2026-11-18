"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase.config";
import {
  ADMIN_SESSION_MAX_AGE_MS,
  SESSION_RENEWAL_CHECK_INTERVAL_MS,
  SESSION_RENEWAL_INTERVAL_MS,
} from "@/lib/auth/session-constants";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const activeUserRef = useRef<User | null>(null);
  const lastSessionRenewalAtRef = useRef(0);
  const sessionSyncRef = useRef<Promise<boolean> | null>(null);
  const sessionRequestControllerRef = useRef<AbortController | null>(null);
  const logoutInProgressRef = useRef(false);
  const logoutRequestRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const logout = useCallback(() => {
    if (logoutRequestRef.current) return logoutRequestRef.current;

    logoutInProgressRef.current = true;
    sessionRequestControllerRef.current?.abort();
    lastSessionRenewalAtRef.current = 0;

    const request = (async () => {
      let failure: Error | null = null;

      try {
        const response = await fetch("/api/auth/session", { method: "DELETE" });
        if (!response.ok) {
          failure = new Error("The server could not end the admin session.");
        }
      } catch (error) {
        failure = error instanceof Error ? error : new Error("Could not reach the session service.");
      }

      try {
        await signOut(auth);
      } catch (error) {
        failure ??= error instanceof Error ? error : new Error("Could not sign out this device.");
      }

      if (failure) throw failure;
    })().finally(() => {
      logoutInProgressRef.current = false;
      logoutRequestRef.current = null;
    });

    logoutRequestRef.current = request;
    return request;
  }, []);

  const syncSession = useCallback((currentUser: User, force = false): Promise<boolean> => {
    if (logoutInProgressRef.current) return Promise.resolve(false);
    if (sessionSyncRef.current) return sessionSyncRef.current;

    const controller = new AbortController();
    sessionRequestControllerRef.current = controller;
    const shouldRenew = force || Date.now() - lastSessionRenewalAtRef.current >= SESSION_RENEWAL_INTERVAL_MS;

    const request = (async () => {
      const tokenResult = await currentUser.getIdTokenResult(shouldRenew);
      const authTime = Number(tokenResult.claims.auth_time);
      const authTimeMs = authTime * 1000;

      if (
        !Number.isFinite(authTimeMs) ||
        authTimeMs > Date.now() + 60_000 ||
        Date.now() - authTimeMs >= ADMIN_SESSION_MAX_AGE_MS
      ) {
        await logout().catch(() => undefined);
        return false;
      }

      if (logoutInProgressRef.current || controller.signal.aborted) return false;
      if (activeUserRef.current?.uid !== currentUser.uid) return false;
      if (!shouldRenew) return true;

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: tokenResult.token }),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await logout().catch(() => undefined);
        }
        return false;
      }

      lastSessionRenewalAtRef.current = Date.now();
      if (pathnameRef.current === "/admin/login") {
        router.replace("/admin");
        router.refresh();
      }
      return true;
    })()
      .catch(() => false)
      .finally(() => {
        if (sessionRequestControllerRef.current === controller) {
          sessionRequestControllerRef.current = null;
        }
        sessionSyncRef.current = null;
      });

    sessionSyncRef.current = request;
    return request;
  }, [logout, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const previousUser = activeUserRef.current;
      activeUserRef.current = currentUser;
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        lastSessionRenewalAtRef.current = 0;
        sessionRequestControllerRef.current?.abort();
        return;
      }

      if (previousUser?.uid !== currentUser.uid) {
        lastSessionRenewalAtRef.current = 0;
      }
      void syncSession(currentUser, true);
    });

    return () => unsubscribe();
  }, [syncSession]);

  useEffect(() => {
    if (pathname === "/admin/login" && user) {
      void syncSession(user, true);
    }
  }, [pathname, syncSession, user]);

  useEffect(() => {
    const checkSession = () => {
      const currentUser = activeUserRef.current;
      if (currentUser) void syncSession(currentUser);
    };

    const interval = window.setInterval(checkSession, SESSION_RENEWAL_CHECK_INTERVAL_MS);
    const checkWhenVisible = () => {
      if (document.visibilityState === "visible") checkSession();
    };

    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", checkWhenVisible);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", checkSession);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, [syncSession]);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
