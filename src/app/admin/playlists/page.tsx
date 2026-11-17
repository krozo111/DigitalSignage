"use client";

import { useState } from "react";
import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatStrip } from "@/components/ui/StatStrip";
import { ViewTabs } from "@/components/ui/ViewTabs";
import { ErrorState } from "@/components/ui/ErrorState";
import { RefreshNotice } from "@/components/ui/RefreshNotice";
import { PageHeader } from "@/components/PageHeader";
import { PlaylistEditor } from "@/features/playlists/components/PlaylistEditor";
import { PlaylistList } from "@/features/playlists/components/PlaylistList";
import { usePlaylistEditor } from "@/features/playlists/hooks/usePlaylistEditor";
import { usePlaylists } from "@/features/playlists/hooks/usePlaylists";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type View = "list" | "create";

export default function PlaylistsConstructorPage() {
  useDocumentTitle("Playlists — Yugo Signage");
  const [view, setView] = useState<View>(() => {
    if (typeof window === "undefined") return "list";
    return new URLSearchParams(window.location.search).get("view") === "create" ? "create" : "list";
  });
  const { mediaList, playlists, loading, error, save, remove, refresh } = usePlaylists();

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

  if (error && playlists.length === 0) {
    return <ErrorState onRetry={refresh} />;
  }

  return (
    <div className="space-y-6">
      {Boolean(error) && playlists.length > 0 && <RefreshNotice onRetry={refresh} />}
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

      <ViewTabs<View>
        label="Playlist views"
        value={view}
        onChange={(nextView) => {
          if (nextView === "create") {
            if (view !== "create") startCreate();
          } else {
            setView("list");
          }
        }}
        tabs={[
          { value: "list", label: "All playlists", count: playlists.length },
          { value: "create", label: view === "create" && editor.editingId ? "Edit playlist" : "Builder" },
        ]}
      />

      {view === "list" ? (
        <>
          <StatStrip
            items={[
              { label: "Playlists", value: playlists.length, detail: "Saved sequences" },
              { label: "Items", value: playlists.reduce((total, playlist) => total + playlist.items.length, 0), detail: "Across all playlists" },
              { label: "Longest list", value: playlists.length ? Math.max(...playlists.map((playlist) => playlist.items.length)) : 0, detail: "Media items" },
              { label: "Status", value: playlists.length ? "Ready" : "Start here", detail: playlists.length ? "Available to assign" : "Create your first list", tone: playlists.length ? "success" : "default" },
            ]}
          />
          <PlaylistList
            playlists={playlists}
            onEdit={startEdit}
            onDuplicate={startDuplicate}
            onDelete={remove}
          />
        </>
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
