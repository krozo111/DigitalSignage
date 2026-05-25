"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#2B1F41",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#ffffff",
        },
      }}
    />
  );
}
