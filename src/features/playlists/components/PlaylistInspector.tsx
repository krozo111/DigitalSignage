"use client";

import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";

interface PlaylistInspectorProps {
  playlist: Playlist;
  onClose: () => void;
  onEdit: (playlist: Playlist) => void;
  onDuplicate: (playlist: Playlist) => void;
  onDelete: (playlist: Playlist) => void;
}

export function PlaylistInspector({ playlist, onClose, onEdit, onDuplicate, onDelete }: PlaylistInspectorProps) {
  const totalDuration = playlist.items.reduce((total, item) => total + item.duration, 0);
  return (
    <aside className="rounded-lg border border-surface-border bg-surface-card xl:sticky xl:top-4 xl:self-start" aria-label={`Inspector for ${playlist.name}`}>
      <div className="flex items-start justify-between gap-3 border-b border-surface-border px-4 py-4">
        <div className="min-w-0"><p className="text-eyebrow text-ink-soft">Playlist inspector</p><h3 className="mt-1 truncate text-label text-ink">{playlist.name}</h3></div>
        <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-meta text-ink-muted hover:bg-surface-hover hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint">Close</button>
      </div>
      <div className="space-y-5 p-4">
        <dl className="divide-y divide-surface-border rounded-md border border-surface-border bg-surface-sunken">
          <div className="flex justify-between px-3 py-2.5"><dt className="text-meta text-ink-muted">Media items</dt><dd className="font-mono text-label text-ink tnum">{playlist.items.length}</dd></div>
          <div className="flex justify-between px-3 py-2.5"><dt className="text-meta text-ink-muted">Playback duration</dt><dd className="font-mono text-label text-ink tnum">{totalDuration}s</dd></div>
          <div className="flex justify-between px-3 py-2.5"><dt className="text-meta text-ink-muted">Status</dt><dd className="text-meta font-semibold text-cleared-green">Ready</dd></div>
        </dl>
        <div className="grid grid-cols-2 gap-2"><Button onClick={() => onEdit(playlist)}>Edit playlist</Button><Button variant="secondary" onClick={() => onDuplicate(playlist)}>Duplicate</Button></div>
        <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(playlist)}>Delete playlist</Button>
      </div>
    </aside>
  );
}
