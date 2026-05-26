"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) router.push("/admin");
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      setError("Login failed: Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (user) return <div className="min-h-screen bg-yugo-primary flex items-center justify-center text-white/40">Redirecting...</div>;

  if (!isMounted) return <div className="min-h-screen bg-yugo-primary flex items-center justify-center text-white/40">Loading...</div>;

  return (
    <div className="flex bg-yugo-primary justify-center items-center min-h-screen">
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
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-full"
            size="md"
          >
            {loading ? "Signing in..." : "Enter Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
