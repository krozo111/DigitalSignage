"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";
import type { NavItem } from "./navItems";

interface NavLinkProps extends NavItem {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function NavLink({ href, label, icon: Icon, collapsed = false, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDirty, setDirty } = useUnsavedChanges();

  const isActive = pathname === href || (pathname.startsWith(href) && href !== "/admin");

  const handleClick = (e: React.MouseEvent) => {
    if (isDirty) {
      e.preventDefault();
      if (window.confirm("You have unsaved changes. Discard them and leave?")) {
        setDirty(false);
        router.push(href);
        onNavigate?.();
      }
      return;
    }
    onNavigate?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={`relative flex items-center gap-3 rounded-lg text-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        collapsed
          ? "justify-center px-2 h-10"
          : "px-3 min-h-11 md:min-h-10"
      } ${
        isActive
          ? "bg-info-soft text-info ring-1 ring-info/20"
          : "text-fg-muted hover:bg-fg/[0.04] hover:text-fg"
      }`}
    >
      <Icon />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
