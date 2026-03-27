"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { adminEmail } = useAuth();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Verificación preliminar antes de enviar a Firebase
    if (adminEmail && email !== adminEmail) {
      setError("Access denied: Email does not belong to administrator.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // El AuthContext interceptará este estado, verificará de nuevo, y seteará la cookie de sesión.
      router.push("/admin"); // Redireccionar al dashboard
    } catch (err: any) {
      console.error(err);
      setError("Login failed: Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-yugo-primary flex items-center justify-center text-white/40">Loading...</div>;

  return (
    <div className="flex bg-yugo-primary justify-center items-center min-vh-100 min-h-screen">
      <div className="bg-yugo-primary/40 p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/5 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
          <span className="text-yugo-accent">Yugo</span> Signage
        </h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-md mb-6 text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-yugo-primary/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yugo-accent focus:border-transparent transition-all"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-yugo-primary/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yugo-accent focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yugo-accent hover:bg-yugo-accent/90 text-yugo-primary font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center h-[52px]"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              "Enter Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
