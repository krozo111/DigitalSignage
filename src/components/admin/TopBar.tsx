import { NavLink } from "./NavLink";
import { UserMenu } from "./UserMenu";
import type { NavItem } from "./navItems";

interface TopBarProps {
  email: string;
  onLogout: () => void;
  navItems: NavItem[];
}

export function TopBar({ email, onLogout, navItems }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 h-14 md:h-16 px-4 md:px-6 bg-surface-strong border-b border-border-strong backdrop-blur-md">
      <h1 className="text-h2 text-fg flex items-center gap-2 shrink-0">
        <img src="/favicon.png" alt="" width={24} height={24} className="rounded-full" />
        <span><span className="text-accent">Yugo</span> Signage</span>
      </h1>

      {/* Desktop: inline tabs. Mobile: hidden, the bottom tab bar owns navigation. */}
      <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1 ml-2">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="ml-auto shrink-0">
        <UserMenu email={email} onLogout={onLogout} variant="compact" />
      </div>
    </header>
  );
}
