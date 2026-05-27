"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border-strong)",
          color: "var(--color-fg)",
          boxShadow:
            "0 20px 50px -20px oklch(0 0 0 / 0.7), 0 0 0 1px oklch(0.985 0.004 80 / 0.03) inset",
        },
      }}
    />
  );
}
