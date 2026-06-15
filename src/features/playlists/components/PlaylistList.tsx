"use client";

import { useState } from "react";
import { Playlist } from "@/lib/services/playlistService";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlaylistIcon } from "@/components/icons";
import { PlaylistCard } from "./PlaylistCard";

interface PlaylistListProps {
  playlists: Playlist[];
  onEdit: (playlist: Playlist) => void;
  onDuplicate: (playlist: Playlist) => void;
  onDelete: (id: string) => Promise<void>;
}

export function PlaylistList({ playlists, onEdit, onDuplicate, onDelete }: PlaylistListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Playlist | null>(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
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
      <div className="overflow-hidden rounded-xl border border-border bg-border">
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((pl) => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
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
