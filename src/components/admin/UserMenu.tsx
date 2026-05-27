"use client";

import { useEffect, useRef, useState } from "react";
import { LogoutIcon } from "@/components/icons";

type UserMenuVariant = "expanded" | "compact";

interface UserMenuProps {
  email: string;
  onLogout: () => void;
  variant?: UserMenuVariant;
}

export function UserMenu({ email, onLogout, variant = "expanded" }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const initial = email[0]?.toUpperCase() ?? "?";
  const isCompact = variant === "compact";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${email}`}
        className={`flex items-center gap-3 rounded-lg hover:bg-fg/[0.05] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isCompact ? "h-11 w-11 justify-center" : "w-full px-2 py-2"
        }`}
      >
        <div className="h-8 w-8 rounded-full bg-accent-soft text-accent text-label font-semibold flex items-center justify-center flex-shrink-0 ring-1 ring-accent/25">
          {initial}
        </div>
        {!isCompact && (
          <span className="text-label text-fg-muted truncate flex-1 text-left">{email}</span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className={`absolute z-50 w-60 bg-surface-2 border border-border-strong rounded-lg shadow-[0_24px_60px_-20px_oklch(0_0_0/0.7)] p-1.5 animate-fade-in ${
            isCompact ? "right-0 top-full mt-2" : "bottom-full left-0 right-0 mb-2"
          }`}
        >
          <div className="px-3 py-2.5 border-b border-border">
            <div className="text-eyebrow text-fg-subtle">Signed in as</div>
            <div className="text-label text-fg truncate mt-1">{email}</div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 mt-1 text-left text-label text-danger hover:bg-danger-soft rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
          >
            <LogoutIcon size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
