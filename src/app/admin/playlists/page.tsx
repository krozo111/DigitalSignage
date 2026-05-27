"use client";

import { useState } from "react";
import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { PlaylistEditor } from "@/features/playlists/components/PlaylistEditor";
import { PlaylistList } from "@/features/playlists/components/PlaylistList";
import { usePlaylistEditor } from "@/features/playlists/hooks/usePlaylistEditor";
import { usePlaylists } from "@/features/playlists/hooks/usePlaylists";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type View = "list" | "create";

export default function PlaylistsConstructorPage() {
  useDocumentTitle("Playlists — Yugo Signage");
  const [view, setView] = useState<View>("list");
  const { mediaList, playlists, loading, save, remove } = usePlaylists();

  const editor = usePlaylistEditor({
    mediaList,
    onSave: save,
    onDone: () => setView("list"),
  });

  const startCreate = () => {
    editor.reset();
    setView("create");
  };

  const startEdit = (playlist: Playlist) => {
    editor.loadForEdit(playlist);
    setView("create");
  };

  const startDuplicate = (playlist: Playlist) => {
    editor.loadForDuplicate(playlist);
    setView("create");
  };

  if (loading) {
    return <LoadingSkeleton variant="grid" count={6} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Playlists"
        description={
          view === "list"
            ? "Manage your created lists."
            : editor.editingId
            ? "Edit Playlist"
            : "Visual Builder"
        }
        actions={
          <Button onClick={view === "list" ? startCreate : editor.cancel}>
            {view === "list" ? "+ New Playlist" : "Back to My Playlists"}
          </Button>
        }
      />

      {view === "list" ? (
        <PlaylistList
          playlists={playlists}
          onEdit={startEdit}
          onDuplicate={startDuplicate}
          onDelete={remove}
        />
      ) : (
        <PlaylistEditor
          mediaList={mediaList}
          name={editor.name}
          items={editor.items}
          nameError={editor.nameError}
          itemsError={editor.itemsError}
          saving={editor.saving}
          editingId={editor.editingId}
          onAddItem={editor.addItem}
          onNameChange={editor.updateName}
          onRemoveItem={editor.removeItem}
          onUpdateDuration={editor.updateDuration}
          onReorder={editor.reorder}
          onSave={editor.save}
        />
      )}
    </div>
  );
}
