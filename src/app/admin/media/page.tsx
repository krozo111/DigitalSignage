"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import { MediaItem } from "@/lib/services/mediaService";
import { getAllPlaylists } from "@/lib/services/playlistService";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { MediaIcon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { useMediaLibrary } from "@/features/media/hooks/useMediaLibrary";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { MediaUploader } from "@/features/media/components/MediaUploader";
import {
  MediaFilters,
  type MediaTypeFilter,
} from "@/features/media/components/MediaFilters";
import { MediaGrid } from "@/features/media/components/MediaGrid";

export default function MediaLibraryPage() {
  useDocumentTitle("Media — Yugo Signage");
  const { mediaList, loading, uploading, progress, upload, remove } = useMediaLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>("all");
  const [isDragOver, setIsDragOver] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleteWarning, setDeleteWarning] = useState("");

  const filteredMedia = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mediaList.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [mediaList, searchQuery, typeFilter]);

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDropZoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await upload(file);
  };

  const requestDelete = async (item: MediaItem) => {
    try {
      const playlists = await getAllPlaylists();
      const usedIn = playlists.filter((pl) =>
        pl.items.some((i) => i.mediaId === item.id)
      );
      setDeleteWarning(
        usedIn.length > 0
          ? `This file is used in ${usedIn.length} playlist(s): ${usedIn
              .map((p) => p.name)
              .join(", ")}. Deleting it will break those playlists.`
          : ""
      );
      setDeleteTarget(item);
    } catch (err) {
      toast.error("Error checking dependencies: " + errorMessage(err));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget.id, deleteTarget.storagePath);
    setDeleteTarget(null);
    setDeleteWarning("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Image and video management (Max 50MB per file)."
        actions={
          <div className="w-full md:w-auto">
            <MediaUploader uploading={uploading} progress={progress} onUpload={upload} />
          </div>
        }
      />

      {!loading && mediaList.length > 0 && (
        <MediaFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        />
      )}

      <div
        onDrop={handleDropZoneDrop}
        onDragOver={handleDropZoneDragOver}
        onDragLeave={() => setIsDragOver(false)}
      >
        {loading ? (
          <LoadingSkeleton variant="grid" count={8} />
        ) : mediaList.length === 0 ? (
          <EmptyState
            variant="dashed"
            icon={MediaIcon}
            title={isDragOver ? "Drop file here" : "The library is empty."}
            description="Upload photos or videos, or drag and drop a file here."
            className={isDragOver ? "border-accent bg-accent/5 text-accent" : ""}
          />
        ) : (
          <MediaGrid
            items={filteredMedia}
            searchQuery={searchQuery}
            onDelete={requestDelete}
          />
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete File"
        message={
          deleteWarning || "Are you sure you want to delete this file? This cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteWarning("");
        }}
      />
    </div>
  );
}
