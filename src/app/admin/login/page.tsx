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

  if (!isMounted) return <div aria-hidden="true" className="min-h-screen" />;

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-surface-1 px-7 py-9 sm:px-9 sm:py-10 rounded-2xl shadow-[0_24px_60px_-20px_oklch(0_0_0/0.7)] w-full max-w-md border border-border-strong">
        <h1 className="text-display text-center text-fg mb-1">
          <span className="text-accent">Yugo</span> Signage
        </h1>
        <p className="text-meta text-fg-subtle text-center mb-8">Sign in to manage your screens.</p>
        <div role="alert" aria-live="polite" aria-atomic="true" className="min-h-0">
          {error && (
            <div className="bg-danger-soft border border-danger/40 text-danger px-3 py-2.5 rounded-md mb-6 text-label">
              {error}
            </div>
          )}
        </div>
        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
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
            {loading ? "Signing in" : "Enter dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
