"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";
import { NavLink } from "./NavLink";
import type { NavItem } from "./navItems";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileDrawer({ open, onClose, navItems }: MobileDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="relative w-72 max-w-[80vw] h-full bg-surface-strong border-r border-border-strong flex flex-col backdrop-blur-md animate-fade-in">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <h1 className="text-xl font-bold text-fg flex items-center gap-2">
            <img src="/favicon.png" alt="" width={32} height={32} className="rounded-full" />
            <span><span className="text-accent">Yugo</span> Signage</span>
          </h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-fg-subtle hover:text-fg hover:bg-white/5 p-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} onNavigate={onClose} />
          ))}
        </nav>
      </aside>
    </div>
  );
}
