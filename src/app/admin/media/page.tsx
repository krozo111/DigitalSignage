"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { uploadMedia, getAllMedia, deleteMedia, MediaItem } from "@/lib/services/mediaService";
import { getAllPlaylists } from "@/lib/services/playlistService";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/PageHeader";

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; storagePath: string } | null>(null);
  const [deleteWarning, setDeleteWarning] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "img" | "vid">("all");
  const [mediaPage, setMediaPage] = useState(1);
  const PAGE_SIZE = 20;

  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [mediaList, searchQuery, typeFilter]);

  const displayedMedia = filteredMedia.slice(0, mediaPage * PAGE_SIZE);
  const hasMore = displayedMedia.length < filteredMedia.length;

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    setMediaPage(1);
  }, [searchQuery, typeFilter]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await getAllMedia();
      setMediaList(data);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const doUpload = async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);

      await uploadMedia(file, (prog) => {
        setProgress(Math.round(prog));
      });

      await fetchMedia();
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await doUpload(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await doUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDelete = async (id: string, storagePath: string) => {
    const playlists = await getAllPlaylists();
    const usedIn = playlists.filter(pl =>
      pl.items.some(item => item.mediaId === id)
    );
    if (usedIn.length > 0) {
      setDeleteWarning(
        `This file is used in ${usedIn.length} playlist(s): ${usedIn.map(p => p.name).join(", ")}. Deleting it will break those playlists.`
      );
    } else {
      setDeleteWarning("");
    }
    setDeleteTarget({ id, storagePath });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMedia(deleteTarget.id, deleteTarget.storagePath);
      setMediaList((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      toast.success("File deleted");
    } catch (error: any) {
      toast.error("Error deleting: " + error.message);
    } finally {
      setDeleteTarget(null);
      setDeleteWarning("");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Image and video management (Max 50MB per file)."
        actions={
          <div className="w-full md:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
              accept="image/*,video/*"
            />
            <Button
              onClick={triggerUpload}
              disabled={uploading}
              loading={uploading}
              size="md"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        }
      />

      {!loading && mediaList.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
            aria-label="Search media files"
          />
          <div className="flex gap-1 bg-yugo-primary/40 rounded-lg p-1 border border-white/5">
            {(["all", "img", "vid"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  typeFilter === t
                    ? "bg-yugo-accent text-yugo-primary"
                    : "text-white/40 hover:text-white"
                }`}
                aria-label={`Filter ${t === "all" ? "all files" : t === "img" ? "images" : "videos"}`}
              >
                {t === "all" ? "All" : t === "img" ? "Images" : "Videos"}
              </button>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="w-full bg-yugo-primary/60 border border-white/5 rounded-full h-2.5 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-label="Upload progress">
          <div
            className="bg-yugo-accent h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {loading ? (
          <LoadingSkeleton variant="grid" count={8} />
        ) : mediaList.length === 0 ? (
          <div
            className={`text-center py-20 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
              isDragOver
                ? "border-yugo-accent bg-yugo-accent/5 text-yugo-accent"
                : "border-white/5 text-white/40"
            }`}
            onClick={triggerUpload}
          >
            <p className="mb-2">{isDragOver ? "Drop file here" : "The library is empty."}</p>
            <p className="text-sm">Upload photos or videos to start creating playlists.</p>
            <p className="text-xs mt-4 text-white/20">or drag and drop a file here</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayedMedia.map((item) => (
              <div key={item.id} className="bg-yugo-primary/40 rounded-xl overflow-hidden border border-white/5 shadow-sm group backdrop-blur-sm">
                <div className="aspect-square bg-yugo-primary/60 relative">
                  {item.type === "vid" ? (
                    <video
                       src={item.url}
                       className="w-full h-full object-cover"
                       muted
                       onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                       onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                    />
                  ) : (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-yugo-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button
                        onClick={() => handleDelete(item.id, item.storagePath)}
                        className="bg-red-600/90 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                        aria-label={`Delete ${item.name}`}
                     >
                       🗑️
                     </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-white/40 mt-1 flex justify-between uppercase font-bold tracking-wider">
                    <span>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
                    <span>{item.type}</span>
                  </p>
                </div>
              </div>
            ))}
            </div>

            {hasMore && (
              <div className="text-center mt-4">
                <Button variant="ghost" onClick={() => setMediaPage((p) => p + 1)}>
                  Load More ({filteredMedia.length - displayedMedia.length} remaining)
                </Button>
              </div>
            )}

            {searchQuery && filteredMedia.length === 0 && (
              <div className="text-center py-10 text-white/40">
                No files match &quot;{searchQuery}&quot;
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete File"
        message={deleteWarning || "Are you sure you want to delete this file? This cannot be undone."}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteTarget(null); setDeleteWarning(""); }}
      />
    </div>
  );
}
