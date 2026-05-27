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
      aria-label="Primary navigation"
      className={`hidden md:flex flex-col bg-surface-2 border-r border-border-strong shadow-[1px_0_0_oklch(1_0_0/0.03)_inset] transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`flex items-center border-b border-border h-16 ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/favicon.png"
              alt=""
              width={26}
              height={26}
              className="flex-shrink-0 rounded-full"
            />
            <h1 className="text-h2 text-fg truncate">
              <span className="text-accent">Yugo</span> Signage
            </h1>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="text-fg-subtle hover:text-fg hover:bg-fg/[0.05] p-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent flex-shrink-0"
        >
          {collapsed ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
        </button>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 flex flex-col gap-0.5 px-3 py-4 overflow-y-auto">
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
