import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit: (playlist: Playlist) => void;
  onDuplicate: (playlist: Playlist) => void;
  onDelete: (playlist: Playlist) => void;
  onSelect?: () => void;
}

export function PlaylistCard({ playlist, onEdit, onDuplicate, onDelete, onSelect }: PlaylistCardProps) {
  const count = playlist.items.length;
  return (
    <article className="flex min-h-[132px] flex-col justify-between gap-4 border-b border-r border-surface-border bg-surface-card p-4 transition-colors hover:bg-surface-hover">
      <div>
        {onSelect ? (
          <button type="button" onClick={onSelect} className="truncate text-left text-label text-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint">{playlist.name}</button>
        ) : (
          <h3 className="truncate text-label text-ink">{playlist.name}</h3>
        )}
        <p className="mt-1 font-mono text-meta text-ink-muted tnum">
          {count} item{count === 1 ? "" : "s"} · Ready to assign
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(playlist)}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDuplicate(playlist)}>
          Duplicate
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(playlist)}>
          Delete
        </Button>
      </div>
    </article>
  );
}
