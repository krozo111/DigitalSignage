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
        className={`flex items-center gap-3 w-full rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isCompact ? "justify-center p-1" : "px-2 py-2"
        }`}
      >
        <div className="h-8 w-8 rounded-full bg-accent text-on-accent font-bold flex items-center justify-center flex-shrink-0">
          {initial}
        </div>
        {!isCompact && (
          <span className="text-sm text-fg-muted truncate flex-1 text-left">{email}</span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 w-56 bg-surface-strong border border-border-strong rounded-lg shadow-lg p-1 backdrop-blur-md animate-fade-in ${
            isCompact ? "right-0 top-full mt-2" : "bottom-full left-0 right-0 mb-2"
          }`}
        >
          <div className="px-3 py-2 text-xs text-fg-subtle border-b border-border">
            Signed in as
            <div className="text-fg truncate mt-0.5">{email}</div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-left text-sm text-danger hover:bg-danger-soft rounded transition-colors"
          >
            <LogoutIcon size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
