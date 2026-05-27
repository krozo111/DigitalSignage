import { MenuIcon } from "@/components/icons";
import { UserMenu } from "./UserMenu";

interface MobileTopBarProps {
  email: string;
  onLogout: () => void;
  onOpenDrawer: () => void;
}

export function MobileTopBar({ email, onLogout, onOpenDrawer }: MobileTopBarProps) {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-surface-strong border-b border-border px-3 py-3 backdrop-blur-md">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Open navigation menu"
        className="text-fg hover:bg-white/5 p-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <MenuIcon size={22} />
      </button>
      <h1 className="text-base font-bold text-fg flex items-center gap-2">
        <img src="/favicon.png" alt="" width={24} height={24} className="rounded-full" />
        <span><span className="text-accent">Yugo</span> Signage</span>
      </h1>
      <UserMenu email={email} onLogout={onLogout} variant="compact" />
    </header>
  );
}
