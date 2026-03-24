"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  adminEmail: string | undefined;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  adminEmail: undefined 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use environment variable to define the single admin email
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Enforce admin-only access at the auth state level
        if (currentUser.email === adminEmail) {
          setUser(currentUser);
          // Set a cookie so the middleware can read the session
          Cookies.set("admin-session", "true", { expires: 1 }); // Expires in 1 day
        } else {
          // If a non-admin user somehow signs in, sign them out immediately
          signOut(auth);
          setUser(null);
          Cookies.remove("admin-session");
        }
      } else {
        setUser(null);
        Cookies.remove("admin-session");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [adminEmail]);

  return (
    <AuthContext.Provider value={{ user, loading, adminEmail }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
