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
      className={`relative flex items-center gap-3 rounded-lg px-3 min-h-11 md:min-h-10 text-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isActive
          ? "bg-info-soft text-info ring-1 ring-info/20"
          : "text-fg-muted hover:bg-fg/[0.04] hover:text-fg"
      }`}
    >
      <Icon />
      <span className="truncate">{label}</span>
    </Link>
  );
}
