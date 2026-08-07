"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";
import type { NavItem } from "./navItems";

interface NavLinkProps extends NavItem {
  onNavigate?: () => void;
}

export function NavLink({ href, label, icon: Icon, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDirty, confirmNavigation } = useUnsavedChanges();

  const isActive = pathname === href || (pathname.startsWith(href) && href !== "/admin");

  const handleClick = (e: React.MouseEvent) => {
    if (isDirty) {
      e.preventDefault();
      confirmNavigation(() => {
        router.push(href);
        onNavigate?.();
      });
      return;
    }
    onNavigate?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      className={`relative flex items-center gap-3 rounded-md px-3 min-h-10 text-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint ${
        isActive
          ? "bg-signal-mint/15 text-white ring-1 ring-signal-mint/30"
          : "text-white/75 hover:bg-white/[0.08] hover:text-white"
      }`}
    >
      <Icon />
      <span className="truncate">{label}</span>
    </Link>
  );
}
