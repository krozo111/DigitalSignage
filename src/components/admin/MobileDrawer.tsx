"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "@/components/icons";
import { NavLink } from "./NavLink";
import type { NavItem } from "./navItems";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileDrawer({ open, onClose, navItems }: MobileDrawerProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="relative w-72 max-w-[80vw] h-full bg-surface-2 border-r border-border-strong flex flex-col shadow-[8px_0_32px_-12px_oklch(0_0_0/0.6)] animate-fade-in">
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <h1 className="text-h2 text-fg flex items-center gap-2.5">
            <img src="/favicon.png" alt="" width={26} height={26} className="rounded-full" />
            <span><span className="text-accent">Yugo</span> Signage</span>
          </h1>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-fg-subtle hover:text-fg hover:bg-fg/[0.05] h-9 w-9 inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <nav aria-label="Primary navigation" className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} onNavigate={onClose} />
          ))}
        </nav>
      </aside>
    </div>
  );
}
