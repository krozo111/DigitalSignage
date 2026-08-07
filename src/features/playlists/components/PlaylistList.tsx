"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Playlist } from "@/lib/services/playlistService";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlaylistIcon } from "@/components/icons";
import { PlaylistCard } from "./PlaylistCard";
import { PlaylistInspector } from "./PlaylistInspector";

interface PlaylistListProps {
  playlists: Playlist[];
  onEdit: (playlist: Playlist) => void;
  onDuplicate: (playlist: Playlist) => void;
  onDelete: (id: string) => Promise<void>;
}

export function PlaylistList({ playlists, onEdit, onDuplicate, onDelete }: PlaylistListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Playlist | null>(null);
  const selectedId = searchParams.get("playlist");
  const selectedPlaylist = selectedId ? playlists.find((playlist) => playlist.id === selectedId) ?? null : null;

  const setSelection = (playlistId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (playlistId) params.set("playlist", playlistId);
    else params.delete("playlist");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    if (deleteTarget.id === selectedId) setSelection(null);
    setDeleteTarget(null);
  };

  if (playlists.length === 0) {
    return (
      <EmptyState
        variant="dashed"
        icon={PlaylistIcon}
        title="You don&apos;t have any lists created yet."
        description="Create your first playlist to organize media for your screens."
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0">
          <div className="hidden overflow-hidden rounded-lg border border-surface-border bg-surface-card lg:block">
            <table className="w-full border-collapse text-left">
              <thead className="bg-surface-sunken text-eyebrow text-ink-soft"><tr><th className="px-4 py-2.5">Playlist</th><th className="px-4 py-2.5">Items</th><th className="px-4 py-2.5">Duration</th><th className="px-4 py-2.5 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-surface-border">
                {playlists.map((playlist) => {
                  const selected = selectedId === playlist.id;
                  const duration = playlist.items.reduce((total, item) => total + item.duration, 0);
                  return (
                    <tr key={playlist.id} tabIndex={0} role="button" data-selected={selected ? "true" : undefined} onClick={() => setSelection(playlist.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelection(playlist.id); } }} className={`cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal-mint ${selected ? "bg-signal-mint/10" : "hover:bg-surface-hover"}`}>
                      <td className="px-4 py-3"><p className="text-label text-ink">{playlist.name}</p><p className="mt-0.5 text-meta text-ink-muted">Available to assign</p></td>
                      <td className="px-4 py-3 font-mono text-meta text-ink tnum">{playlist.items.length}</td>
                      <td className="px-4 py-3 font-mono text-meta text-ink-muted tnum">{duration}s</td>
                      <td className="px-4 py-3 text-right"><button type="button" onClick={(event) => { event.stopPropagation(); onEdit(playlist); }} className="text-meta font-semibold text-info-cobalt hover:underline">Edit</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:hidden">
            {playlists.map((playlist) => <div key={playlist.id} className={selectedId === playlist.id ? "rounded-lg ring-2 ring-signal-mint" : ""}><PlaylistCard playlist={playlist} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={setDeleteTarget} onSelect={() => setSelection(playlist.id)} /></div>)}
          </div>
        </div>
        {selectedPlaylist && <PlaylistInspector key={selectedPlaylist.id} playlist={selectedPlaylist} onClose={() => setSelection(null)} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={setDeleteTarget} />}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Playlist"
        message={`Are you sure you want to delete the playlist "${deleteTarget?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
