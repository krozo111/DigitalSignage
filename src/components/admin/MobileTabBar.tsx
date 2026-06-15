"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";
import type { NavItem } from "./navItems";

interface MobileTabBarProps {
  navItems: NavItem[];
}

export function MobileTabBar({ navItems }: MobileTabBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDirty, confirmNavigation } = useUnsavedChanges();

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (isDirty) {
      e.preventDefault();
      confirmNavigation(() => router.push(href));
    }
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="md:hidden shrink-0 border-t border-border-strong bg-surface-strong backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (pathname.startsWith(href) && href !== "/admin");
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={(e) => handleClick(e, href)}
                aria-current={isActive ? "page" : undefined}
                className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
              >
                {/* Material-3 style pill indicator: the active tab's icon sits in a violet lozenge. */}
                <span
                  className={`inline-flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-info-soft text-info" : "text-fg-muted"
                  }`}
                >
                  <Icon size={20} />
                </span>
                <span
                  className={`text-[0.6875rem] leading-none ${
                    isActive ? "font-semibold text-info" : "text-fg-subtle"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
