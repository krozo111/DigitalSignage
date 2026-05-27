"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import {
  deleteMedia,
  getAllMedia,
  MediaItem,
  uploadMedia,
} from "@/lib/services/mediaService";

export function useMediaLibrary() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllMedia();
      setMediaList(data);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const upload = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        setProgress(0);
        await uploadMedia(file, (prog) => setProgress(Math.round(prog)));
        await fetchMedia();
        toast.success("File uploaded successfully");
      } catch (error) {
        toast.error(errorMessage(error) || "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [fetchMedia]
  );

  const remove = useCallback(async (id: string, storagePath: string) => {
    try {
      await deleteMedia(id, storagePath);
      setMediaList((prev) => prev.filter((item) => item.id !== id));
      toast.success("File deleted");
    } catch (error) {
      toast.error("Error deleting: " + errorMessage(error));
    }
  }, []);

  return { mediaList, loading, uploading, progress, upload, remove };
}
