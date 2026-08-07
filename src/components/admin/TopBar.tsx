import { UserMenu } from "./UserMenu";
import { CommandPalette } from "./CommandPalette";

interface TopBarProps {
  email: string;
  onLogout: () => void;
}

export function TopBar({ email, onLogout }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-surface-border bg-surface-card px-4 text-ink md:h-16 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <CommandPalette />
        <span className="text-label text-ink lg:hidden"><span className="text-action-coral">Yugo</span> Signage</span>
      </div>
      <div className="shrink-0">
        <UserMenu email={email} onLogout={onLogout} variant="compact" />
      </div>
    </header>
  );
}
