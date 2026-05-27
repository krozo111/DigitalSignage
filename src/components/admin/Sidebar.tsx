import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { NavLink } from "./NavLink";
import { UserMenu } from "./UserMenu";
import type { NavItem } from "./navItems";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  email: string;
  onLogout: () => void;
  navItems: NavItem[];
}

export function Sidebar({ collapsed, onToggle, email, onLogout, navItems }: SidebarProps) {
  return (
    <aside
      className={`hidden md:flex flex-col bg-surface-2 border-r border-border backdrop-blur-sm transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`flex items-center border-b border-border h-16 justify-between ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/favicon.png"
            alt=""
            width={32}
            height={32}
            className="flex-shrink-0 rounded-full"
          />
          {!collapsed && (
            <h1 className="text-xl font-bold text-fg tracking-tight truncate">
              <span className="text-accent">Yugo</span> Signage
            </h1>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-fg-subtle hover:text-fg hover:bg-white/5 p-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent flex-shrink-0"
        >
          {collapsed ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={18} />}
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <UserMenu
          email={email}
          onLogout={onLogout}
          variant={collapsed ? "compact" : "expanded"}
        />
      </div>
    </aside>
  );
}
