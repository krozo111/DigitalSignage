"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import {
  cleanupMediaStorage,
  deleteMedia,
  getAllMedia,
  MediaItem,
  uploadMedia,
} from "@/lib/services/mediaService";

export function useMediaLibrary() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadLabel, setUploadLabel] = useState("");

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMedia();
      setMediaList(data);
    } catch (error) {
      setError(error);
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const upload = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      try {
        setUploading(true);
        setProgress(0);
        let processed = 0;
        let completed = 0;
        const failures: string[] = [];
        for (const [index, file] of files.entries()) {
          setUploadLabel(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
          try {
            await uploadMedia(file, (prog) => {
              setProgress(Math.round(((processed + prog / 100) / files.length) * 100));
            });
            completed++;
          } catch (error) {
            failures.push(`${file.name}: ${errorMessage(error)}`);
          } finally {
            processed++;
            setProgress(Math.round((processed / files.length) * 100));
          }
        }
        await fetchMedia();
        if (completed) toast.success(`${completed} file${completed === 1 ? "" : "s"} uploaded`);
        if (failures.length) {
          const remaining = failures.length > 1 ? ` (+${failures.length - 1} more)` : "";
          toast.error(`Could not upload ${failures[0]}${remaining}`);
        }
      } catch (error) {
        toast.error(errorMessage(error) || "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
        setUploadLabel("");
      }
    },
    [fetchMedia]
  );

  const remove = useCallback(async (id: string, storagePath: string): Promise<boolean> => {
    try {
      const result = await deleteMedia(id, storagePath);
      setMediaList((prev) => prev.filter((item) => item.id !== id));
      if (result.storageCleanupPending) {
        toast.warning("Removed from playlists; the Storage file still needs cleanup.", {
          action: {
            label: "Retry cleanup",
            onClick: () => {
              void cleanupMediaStorage(storagePath)
                .then(() => toast.success("Unused Storage file removed"))
                .catch((error) => toast.error("Storage cleanup failed: " + errorMessage(error)));
            },
          },
        });
      } else {
        toast.success("File deleted and removed from its playlists");
      }
      return true;
    } catch (error) {
      toast.error("Error deleting: " + errorMessage(error));
      return false;
    }
  }, []);

  return { mediaList, loading, error, uploading, progress, uploadLabel, upload, remove, refresh: fetchMedia };
}
