"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "@/components/icons";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";
import type { NavItem } from "./navItems";
import { UserMenu } from "./UserMenu";

interface MobileTabBarProps {
  navItems: NavItem[];
  email: string;
  onLogout: () => void;
}

export function MobileTabBar({ navItems, email, onLogout }: MobileTabBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDirty, confirmNavigation } = useUnsavedChanges();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (isDirty) {
      e.preventDefault();
      confirmNavigation(() => router.push(href));
    }
    setMoreOpen(false);
  };

  return (
    <nav aria-label="Primary navigation" className="relative shrink-0 border-t border-surface-border bg-surface-card pb-[env(safe-area-inset-bottom)] lg:hidden">
      {moreOpen && (
        <div className="absolute bottom-full right-2 z-40 mb-2 w-64 rounded-lg border border-surface-border bg-surface-card p-3 shadow-[0_16px_40px_-18px_rgba(26,23,38,0.35)]" role="dialog" aria-label="More options">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-label text-ink">More</p>
            <button type="button" onClick={() => setMoreOpen(false)} className="text-meta text-ink-muted hover:text-ink">Close</button>
          </div>
          <UserMenu email={email} onLogout={onLogout} variant="expanded" />
        </div>
      )}
      <ul className="grid grid-cols-5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (pathname.startsWith(href) && href !== "/admin");
          return (
            <li key={href}>
              <Link href={href} onClick={(e) => handleClick(e, href)} aria-current={isActive ? "page" : undefined} className="flex min-h-16 flex-col items-center justify-center gap-1 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal-mint">
                <span className={`inline-flex h-7 w-12 items-center justify-center rounded-full transition-colors ${isActive ? "bg-signal-mint/15 text-mint-ink" : "text-ink-muted"}`}><Icon size={19} /></span>
                <span className={`text-[0.6875rem] leading-none ${isActive ? "font-semibold text-mint-ink" : "text-ink-soft"}`}>{label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button type="button" onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} className="flex min-h-16 w-full flex-col items-center justify-center gap-1 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal-mint">
            <span className={`inline-flex h-7 w-12 items-center justify-center rounded-full ${moreOpen ? "bg-signal-mint/15 text-mint-ink" : "text-ink-muted"}`}><MenuIcon size={19} /></span>
            <span className={`text-[0.6875rem] leading-none ${moreOpen ? "font-semibold text-mint-ink" : "text-ink-soft"}`}>More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
