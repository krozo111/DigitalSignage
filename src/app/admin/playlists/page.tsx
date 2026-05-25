"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllMedia, MediaItem } from "@/lib/services/mediaService";
import { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist, Playlist } from "@/lib/services/playlistService";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/PageHeader";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BuiltItem extends MediaItem {
  duration: number;
}

function SortablePlaylistItem({
  item,
  index,
  onRemove,
  onUpdateDuration,
}: {
  item: BuiltItem;
  index: number;
  onRemove: (index: number) => void;
  onUpdateDuration: (index: number, duration: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(index) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isBroken = !item.url;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-yugo-primary/40 border p-3 rounded-lg shadow-sm ${
        isDragging
          ? "z-50 border-yugo-accent"
          : isBroken
          ? "border-red-500/40"
          : "border-white/5"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-white/30 hover:text-white/60 p-1 cursor-grab active:cursor-grabbing select-none text-lg leading-none"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>

      <div className={`h-16 w-16 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center ${isBroken ? "bg-red-900/30" : "bg-yugo-primary/60"}`}>
        {isBroken ? (
          <span className="text-red-400 text-xs font-bold">MISSING</span>
        ) : item.type === "vid" ? (
          <video src={item.url} className="h-full w-full object-cover" />
        ) : (
          <img src={item.url} className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isBroken ? "text-red-400" : "text-white"}`}>
          {item.name}
          {isBroken && <span className="ml-2 text-xs text-red-400/60">(deleted)</span>}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <label className="text-xs text-white/40">Duration (sec):</label>
          <input
            type="number"
            min="1"
            value={item.duration}
            onChange={(e) => onUpdateDuration(index, parseInt(e.target.value) || 1)}
            className="w-20 bg-yugo-primary/60 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yugo-accent"
            aria-label={`Duration for ${item.name}`}
          />
        </div>
      </div>

      <button
        onClick={() => onRemove(index)}
        className="text-red-400 hover:text-red-300 p-2"
        aria-label={`Remove ${item.name}`}
      >
        ✕
      </button>
    </div>
  );
}

export default function PlaylistsConstructorPage() {
  const { setDirty } = useUnsavedChanges();

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "create">("list");
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);

  const [playlistName, setPlaylistName] = useState("");
  const [selectedItems, setSelectedItems] = useState<BuiltItem[]>([]);
  const [nameError, setNameError] = useState("");
  const [itemsError, setItemsError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [mediaSearch, setMediaSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedItems((items) => {
        const oldIndex = Number(active.id);
        const newIndex = Number(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [view]);

  const hasChanges = view === "create" && (playlistName.trim() !== "" || selectedItems.length > 0);

  useEffect(() => {
    setDirty(hasChanges);
  }, [hasChanges, setDirty]);

  useEffect(() => {
    if (!hasChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const goToListView = useCallback(() => {
    if (hasChanges && !window.confirm("You have unsaved changes. Discard them and leave?")) return;
    setView("list");
    setPlaylistName("");
    setSelectedItems([]);
    setEditingPlaylistId(null);
    setNameError("");
    setItemsError("");
  }, [hasChanges]);

  useEffect(() => {
    if (view !== "create") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goToListView();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, goToListView]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [mediaRes, playlistsRes] = await Promise.all([
        getAllMedia(),
        getAllPlaylists()
      ]);
      setMediaList(mediaRes);
      setPlaylists(playlistsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (media: MediaItem) => {
    setSelectedItems((prev) => [
      ...prev,
      { ...media, duration: media.type === "vid" ? 15 : 10 },
    ]);
    setItemsError("");
  };

  const removeItem = (indexToRemove: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const updateDuration = (index: number, newDuration: number) => {
    setSelectedItems((prev) => {
      const copy = [...prev];
      copy[index].duration = newDuration;
      return copy;
    });
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    const builtItems: BuiltItem[] = playlist.items.map(item => {
      const mediaInfo = mediaList.find(m => m.id === item.mediaId);
      if (mediaInfo) {
        return { ...mediaInfo, duration: item.duration };
      }
      return {
        id: item.mediaId,
        name: "File not found",
        url: "",
        type: "img",
        size: 0,
        storagePath: "",
        createdAt: null,
        duration: item.duration
      };
    });

    setPlaylistName(playlist.name);
    setSelectedItems(builtItems);
    setEditingPlaylistId(playlist.id);
    setView("create");
  };

  const handleDuplicatePlaylist = (playlist: Playlist) => {
    const builtItems: BuiltItem[] = playlist.items.map(item => {
      const mediaInfo = mediaList.find(m => m.id === item.mediaId);
      if (mediaInfo) {
        return { ...mediaInfo, duration: item.duration };
      }
      return {
        id: item.mediaId,
        name: "File not found",
        url: "",
        type: "img",
        size: 0,
        storagePath: "",
        createdAt: null,
        duration: item.duration,
      };
    });
    setPlaylistName(`${playlist.name} (Copy)`);
    setSelectedItems(builtItems);
    setEditingPlaylistId(null);
    setView("create");
  };

  const handleDeletePlaylist = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setLoading(true);
      await deletePlaylist(deleteTarget.id);
      await fetchInitialData();
      toast.success("Playlist deleted");
    } catch (err: any) {
      toast.error("Error deleting: " + err.message);
      setLoading(false);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSave = async () => {
    let hasError = false;

    if (!playlistName.trim()) {
      setNameError("Playlist name is required");
      hasError = true;
    } else {
      setNameError("");
    }

    if (selectedItems.length === 0) {
      setItemsError("Add at least one media item");
      hasError = true;
    } else {
      setItemsError("");
    }

    if (hasError) return;

    try {
      setSaving(true);

      const itemsToSave = selectedItems.map((item, index) => ({
        mediaId: item.id,
        duration: item.duration,
        order: index,
      }));

      if (editingPlaylistId) {
        await updatePlaylist(editingPlaylistId, playlistName, itemsToSave);
      } else {
        await createPlaylist(playlistName, itemsToSave);
      }

      setPlaylistName("");
      setSelectedItems([]);
      setEditingPlaylistId(null);
      setNameError("");
      setItemsError("");
      setView("list");
      toast.success(editingPlaylistId ? "Playlist updated successfully" : "Playlist created successfully");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton variant="grid" count={6} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Playlists"
        description={view === "list" ? "Manage your created lists." : editingPlaylistId ? "Edit Playlist" : "Visual Builder"}
        actions={
          <Button
            onClick={() => {
              setView(view === "list" ? "create" : "list");
              if (view === "create") {
                setPlaylistName("");
                setSelectedItems([]);
                setEditingPlaylistId(null);
              }
            }}
          >
            {view === "list" ? "+ New Playlist" : "Back to My Playlists"}
          </Button>
        }
      />

      {view === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.length === 0 ? (
            <div className="col-span-full py-20 text-center text-white/20 border border-dashed border-white/10 rounded-xl">
              You don&apos;t have any lists created yet.
            </div>
          ) : (
            playlists.map((pl) => (
              <div key={pl.id} className="bg-yugo-primary/40 p-5 rounded-xl border border-white/5 flex flex-col justify-between backdrop-blur-sm shadow-sm group">
                <div>
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-yugo-accent transition-colors">{pl.name}</h3>
                  <p className="text-sm text-white/40 mt-1">{pl.items.length} resources assigned</p>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                  <Button variant="ghost" size="sm" onClick={() => handleEditPlaylist(pl)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDuplicatePlaylist(pl)}>
                    Duplicate
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeletePlaylist(pl.id, pl.name)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 bg-yugo-primary/40 p-4 border border-white/5 rounded-xl flex flex-col h-[600px] backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4 text-white">Library</h3>
            <input
              type="text"
              placeholder="Search media..."
              value={mediaSearch}
              onChange={(e) => setMediaSearch(e.target.value)}
              className="w-full bg-yugo-primary/60 border border-white/10 rounded-lg px-3 py-2 mb-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yugo-accent placeholder-white/30"
              aria-label="Search media to add to playlist"
            />
            <div className="overflow-y-auto flex-1 pr-2 grid grid-cols-2 gap-3 pb-4">
               {mediaList.length === 0 ? (
                  <p className="col-span-2 text-white/20 text-sm">No content in Media Library.</p>
               ) : (
                  mediaList
                    .filter((m) => m.name.toLowerCase().includes(mediaSearch.toLowerCase()))
                    .map((media) => (
                    <div
                      key={media.id}
                      onClick={() => addItem(media)}
                      className="cursor-pointer group relative bg-yugo-primary/60 rounded-lg overflow-hidden border border-white/5 hover:border-yugo-accent transition-all aspect-video shadow-md"
                    >
                      {media.type === "vid" ? (
                        <video src={media.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={media.url} alt={media.name} className="w-full h-full object-cover" loading="lazy" />
                      )}
                      <div className="absolute inset-0 bg-yugo-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-yugo-accent font-bold text-sm">+ Add</span>
                      </div>
                    </div>
                  ))
               )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-yugo-primary/40 p-6 border border-white/5 rounded-xl flex flex-col min-h-[600px] backdrop-blur-sm">
            <Input
              placeholder="Playlist Name (ex: Local Main Screen 1)"
              value={playlistName}
              onChange={(e) => {
                setPlaylistName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              error={nameError}
            />

            <div className={`flex-1 overflow-y-auto space-y-3 pr-2 shadow-inner bg-yugo-primary/20 p-3 rounded-lg border mt-4 ${itemsError ? "border-red-500/50" : "border-white/5"}`}>
              {selectedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20 mt-20">
                  <span className="text-4xl mb-3">{itemsError ? "⚠️" : "🫙"}</span>
                  <p>{itemsError || "The playlist is empty."}</p>
                  <p className="text-sm">{itemsError ? "" : "Tap an element on the left to add it."}</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={selectedItems.map((_, i) => String(i))}
                    strategy={verticalListSortingStrategy}
                  >
                    {selectedItems.map((item, idx) => (
                      <SortablePlaylistItem
                        key={`${item.id}-${idx}`}
                        item={item}
                        index={idx}
                        onRemove={removeItem}
                        onUpdateDuration={updateDuration}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>

            <Button
              variant="secondary"
              size="lg"
              disabled={saving || selectedItems.length === 0 || !playlistName}
              loading={saving}
              onClick={handleSave}
              className="mt-6 w-full"
            >
              {saving ? "Saving..." : editingPlaylistId ? "Update Playlist" : "Save Playlist"}
            </Button>
          </div>
        </div>
      )}

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
    </div>
  );
}
