import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit: (playlist: Playlist) => void;
  onDuplicate: (playlist: Playlist) => void;
  onDelete: (playlist: Playlist) => void;
}

export function PlaylistCard({ playlist, onEdit, onDuplicate, onDelete }: PlaylistCardProps) {
  const count = playlist.items.length;
  return (
    <div className="flex flex-col justify-between gap-4 bg-surface-1 p-5 transition-colors hover:bg-surface-2">
      <div>
        <h3 className="truncate text-label font-semibold text-fg">{playlist.name}</h3>
        <p className="mt-1 font-mono text-meta text-fg-subtle tnum">
          {count} item{count === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(playlist)}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDuplicate(playlist)}>
          Duplicate
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(playlist)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
