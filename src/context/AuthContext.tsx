"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          const res = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          if (res.ok) {
            setUser(currentUser);
          } else {
            await signOut(auth);
            setUser(null);
          }
        } catch {
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
        try {
          await fetch("/api/auth/session", { method: "DELETE" });
        } catch {}
        Cookies.remove("admin-session");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
