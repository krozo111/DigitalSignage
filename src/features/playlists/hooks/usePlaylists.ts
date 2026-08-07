"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import { getAllMedia, MediaItem } from "@/lib/services/mediaService";
import {
  createPlaylist,
  deletePlaylist as deletePlaylistSvc,
  getAllPlaylists,
  Playlist,
  updatePlaylist,
} from "@/lib/services/playlistService";

interface SaveItem {
  mediaId: string;
  duration: number;
  order: number;
}

export function usePlaylists() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [media, lists] = await Promise.all([getAllMedia(), getAllPlaylists()]);
      setMediaList(media);
      setPlaylists(lists);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const save = useCallback(
    async (name: string, items: SaveItem[], editingId: string | null) => {
      if (editingId) {
        await updatePlaylist(editingId, name, items);
      } else {
        await createPlaylist(name, items);
      }
      await fetchAll();
      toast.success(
        editingId ? "Playlist updated successfully" : "Playlist created successfully"
      );
    },
    [fetchAll]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await deletePlaylistSvc(id);
        await fetchAll();
        toast.success("Playlist deleted");
      } catch (err) {
        toast.error("Error deleting: " + errorMessage(err));
      }
    },
    [fetchAll]
  );

  return { mediaList, playlists, loading, error, save, remove, refresh: fetchAll };
}
