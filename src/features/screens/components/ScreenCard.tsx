import { useMemo } from "react";
import { Screen } from "@/lib/services/screenService";
import { Playlist } from "@/lib/services/playlistService";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { ScreenIcon } from "@/components/icons";

const STALE_THRESHOLD_MS = 5 * 60 * 1000;

type StatusTone = "neutral" | "success" | "warning";

function deriveStatus(screen: Screen): { label: string; tone: StatusTone } {
  if (screen.pairingCode) return { label: "Unpaired", tone: "warning" };

  const lastSeen = screen.lastSeen;
  if (!lastSeen) return { label: "Unknown", tone: "neutral" };

  const diff = Date.now() - lastSeen.toMillis();
  if (diff < STALE_THRESHOLD_MS) return { label: "Online", tone: "success" };
  return { label: "Offline", tone: "neutral" };
}

interface ScreenCardProps {
  screen: Screen;
  playlists: Playlist[];
  onAssignPlaylist: (screenId: string, screenName: string, playlistId: string) => void;
  onDelete: (screenId: string) => void;
}

export function ScreenCard({ screen, playlists, onAssignPlaylist, onDelete }: ScreenCardProps) {
  const status = deriveStatus(screen);
  const options = useMemo(
    () => [
      { value: "", label: "No Playlist" },
      ...playlists.map(pl => ({ value: pl.id, label: pl.name })),
    ],
    [playlists]
  );

  return (
    <Card padding="md" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="h-12 w-12 bg-surface-2 border border-border rounded-lg flex items-center justify-center text-fg-muted group-hover:bg-accent-soft group-hover:text-accent transition-colors">
          <ScreenIcon size={24} />
        </div>
        <div>
          <h4 className="font-bold text-lg text-fg truncate max-w-[200px]">{screen.name}</h4>
          <Badge tone={status.tone} dot className="mt-1">
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Select
          value={screen.playlistId || ""}
          onChange={(e) => onAssignPlaylist(screen.id, screen.name, e.target.value)}
          options={options}
          aria-label={`Assign playlist for ${screen.name}`}
          className="w-full sm:w-48 py-2 text-sm"
        />
        <Button variant="danger" size="sm" onClick={() => onDelete(screen.id)}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
