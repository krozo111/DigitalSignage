import Image from "next/image";
import { NavLink } from "./NavLink";
import type { NavGroup } from "./navItems";

interface SidebarProps {
  groups: NavGroup[];
}

export function Sidebar({ groups }: SidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-nav-surface text-white lg:flex" aria-label="Sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <Image src="/favicon.png" alt="" width={26} height={26} className="rounded-md" />
        <span className="text-label"><span className="text-signal-mint">Yugo</span> Signage</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Main navigation">
        <div className="space-y-6">
          {groups.map((group, index) => (
            <div key={group.label ?? index}>
              {group.label && <p className="mb-2 px-3 text-eyebrow text-white/50">{group.label}</p>}
              <div className="space-y-1">
                {group.items.map((item) => <NavLink key={item.href} {...item} />)}
              </div>
            </div>
          ))}
        </div>
      </nav>
      <div className="border-t border-white/10 px-5 py-4 text-meta text-white/50">Yugo Signage · Fleet console</div>
    </aside>
  );
}
