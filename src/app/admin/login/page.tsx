"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AdminLogin() {
  useDocumentTitle("Sign in — Yugo Signage");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        await signOut(auth);
        setError("Login failed: server rejected session.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Login failed: Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-yugo-primary flex items-center justify-center text-fg-subtle">Loading...</div>;

  return (
    <div className="flex bg-yugo-primary justify-center items-center min-h-screen">
      <div className="bg-surface-1 p-8 rounded-2xl shadow-xl w-full max-w-md border border-border backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center text-fg mb-6 tracking-tight">
          <span className="text-accent">Yugo</span> Signage
        </h1>
        {error && (
          <div className="bg-danger-soft border border-danger text-danger p-3 rounded-md mb-6 text-sm text-center">
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
