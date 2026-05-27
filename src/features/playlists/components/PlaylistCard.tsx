import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit: (playlist: Playlist) => void;
  onDuplicate: (playlist: Playlist) => void;
  onDelete: (playlist: Playlist) => void;
}

export function PlaylistCard({ playlist, onEdit, onDuplicate, onDelete }: PlaylistCardProps) {
  return (
    <Card padding="md" className="flex flex-col justify-between group">
      <div>
        <h3 className="text-lg font-bold text-fg truncate group-hover:text-accent transition-colors">
          {playlist.name}
        </h3>
        <p className="text-sm text-fg-subtle mt-1">
          {playlist.items.length} resources assigned
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
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
    </Card>
  );
}
