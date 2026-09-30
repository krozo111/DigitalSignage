"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import { MediaItem } from "@/lib/services/mediaService";
import { getAllPlaylists } from "@/lib/services/playlistService";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatStrip } from "@/components/ui/StatStrip";
import { ErrorState } from "@/components/ui/ErrorState";
import { RefreshNotice } from "@/components/ui/RefreshNotice";
import { MediaIcon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { useMediaLibrary } from "@/features/media/hooks/useMediaLibrary";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { MediaUploader } from "@/features/media/components/MediaUploader";
import {
  MediaFilters,
  type MediaTypeFilter,
  type MediaViewMode,
} from "@/features/media/components/MediaFilters";
import { MediaGrid } from "@/features/media/components/MediaGrid";
import { MediaInspector } from "@/features/media/components/MediaInspector";

export default function MediaLibraryPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  useDocumentTitle("Media — Yugo Signage");
  const { mediaList, loading, error, uploading, progress, uploadLabel, upload, remove, refresh } = useMediaLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>("all");
  const [viewMode, setViewMode] = useState<MediaViewMode>("grid");
  const [isDragOver, setIsDragOver] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState("");
  const selectedId = searchParams.get("media");
  const selectedItem = selectedId ? mediaList.find((item) => item.id === selectedId) ?? null : null;

  const setSelection = (mediaId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (mediaId) params.set("media", mediaId);
    else params.delete("media");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  const filteredMedia = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mediaList.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [mediaList, searchQuery, typeFilter]);

  const imageCount = mediaList.filter((item) => item.type === "img").length;
  const videoCount = mediaList.filter((item) => item.type === "vid").length;
  const totalSizeMB = (mediaList.reduce((total, item) => total + item.size, 0) / 1024 / 1024).toFixed(0);

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDropZoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (uploading) return;
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) await upload(files);
  };

  const requestDelete = async (item: MediaItem) => {
    try {
      const playlists = await getAllPlaylists();
      const usedIn = playlists.filter((pl) =>
        pl.items.some((i) => i.mediaId === item.id)
      );
      setDeleteWarning(
        usedIn.length > 0
          ? `Deleting this file will also remove it from ${usedIn.length} ${usedIn.length === 1 ? "playlist" : "playlists"}: ${usedIn
              .map((p) => p.name)
              .join(", ")}.`
          : ""
      );
      setDeleteTarget(item);
    } catch (err) {
      toast.error("Error checking dependencies: " + errorMessage(err));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      const deleted = await remove(deleteTarget.id, deleteTarget.storagePath);
      if (deleted) {
        if (selectedId === deleteTarget.id) setSelection(null);
        setDeleteTarget(null);
        setDeleteWarning("");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Manage the images and videos shown on your paired screens."
        actions={
          <div className="w-full md:w-auto">
            <MediaUploader uploading={uploading} progress={progress} uploadLabel={uploadLabel} onUpload={upload} />
          </div>
        }
      />

      {error && mediaList.length > 0 && <RefreshNotice onRetry={refresh} />}

      <StatStrip
        items={[
          { label: "Total files", value: mediaList.length, detail: "Images and videos" },
          { label: "Images", value: imageCount, detail: "Still content" },
          { label: "Videos", value: videoCount, detail: "Motion content" },
          { label: "Storage", value: `${totalSizeMB} MB`, detail: "50 MB max per file" },
        ]}
      />

      {!loading && mediaList.length > 0 && (
        <MediaFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      <div
        onDrop={handleDropZoneDrop}
        onDragOver={handleDropZoneDragOver}
        onDragLeave={() => setIsDragOver(false)}
      >
        {error && mediaList.length === 0 ? (
          <ErrorState onRetry={refresh} />
        ) : loading ? (
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
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
            <MediaGrid
              items={filteredMedia}
              searchQuery={searchQuery}
              onDelete={requestDelete}
              viewMode={viewMode}
              selectedId={selectedId}
              onSelect={(item) => setSelection(item.id)}
            />
            {selectedItem && <MediaInspector key={selectedItem.id} item={selectedItem} onClose={() => setSelection(null)} onDelete={requestDelete} />}
          </div>
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
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteWarning("");
        }}
      />
    </div>
  );
}
