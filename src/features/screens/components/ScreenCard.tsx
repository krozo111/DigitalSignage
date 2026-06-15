import { useMemo } from "react";
import { Screen } from "@/lib/services/screenService";
import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { StatusDot } from "@/components/ui/StatusDot";
import { isScreenOnline, relativeTime } from "@/lib/screenStatus";

interface ScreenCardProps {
  screen: Screen;
  playlists: Playlist[];
  onAssignPlaylist: (screenId: string, screenName: string, playlistId: string) => void;
  onDelete: (screenId: string) => void;
}

export function ScreenCard({ screen, playlists, onAssignPlaylist, onDelete }: ScreenCardProps) {
  const online = isScreenOnline(screen);
  const options = useMemo(
    () => [
      { value: "", label: "No Playlist" },
      ...playlists.map((pl) => ({ value: pl.id, label: pl.name })),
    ],
    [playlists]
  );

  return (
    <div className="flex flex-col gap-4 bg-surface-1 p-5 transition-colors hover:bg-surface-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <StatusDot online={online} />
          <span className="truncate text-label font-semibold text-fg">{screen.name}</span>
          <span className="sr-only">{screen.pairingCode ? "unpaired" : online ? "online" : "offline"}</span>
        </span>
        <span className="shrink-0 font-mono text-meta text-fg-subtle tnum">
          {screen.pairingCode ? "unpaired" : relativeTime(screen.lastSeen)}
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <Select
          value={screen.playlistId || ""}
          onChange={(e) => onAssignPlaylist(screen.id, screen.name, e.target.value)}
          options={options}
          aria-label={`Assign playlist for ${screen.name}`}
          className="flex-1 py-2 text-sm"
        />
        <Button variant="danger" size="sm" onClick={() => onDelete(screen.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
