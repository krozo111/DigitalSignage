"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import {
  claimScreen,
  deleteScreen as deleteScreenSvc,
  getAllScreens,
  purgeStaleScreens,
  Screen,
  updateScreenDetails,
} from "@/lib/services/screenService";
import { getAllPlaylists, Playlist } from "@/lib/services/playlistService";

export function useScreens() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [screensData, playlistsData] = await Promise.all([
        getAllScreens(),
        getAllPlaylists(),
      ]);
      setScreens(screensData);
      setPlaylists(playlistsData);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const claim = useCallback(
    async (code: string, name: string, playlistId: string | null) => {
      await claimScreen(code, name, playlistId);
      await fetchData();
      toast.success("Screen paired successfully");
    },
    [fetchData]
  );

  const updatePlaylist = useCallback(
    async (screenId: string, screenName: string, playlistId: string | null) => {
      try {
        await updateScreenDetails(screenId, screenName, playlistId);
        setScreens(prev =>
          prev.map(s => (s.id === screenId ? { ...s, playlistId } : s))
        );
        toast.success("Playlist updated");
      } catch (err) {
        toast.error("Error updating screen: " + errorMessage(err));
      }
    },
    []
  );

  const remove = useCallback(async (screenId: string) => {
    try {
      await deleteScreenSvc(screenId);
      setScreens(prev => prev.filter(s => s.id !== screenId));
      toast.success("Screen deleted");
    } catch (err) {
      toast.error("Error deleting screen: " + errorMessage(err));
    }
  }, []);

  const purge = useCallback(async () => {
    try {
      setLoading(true);
      const count = await purgeStaleScreens();
      await fetchData();
      toast.success(`Purged ${count} stale screen(s)`);
    } catch (err) {
      toast.error("Error purging: " + errorMessage(err));
      setLoading(false);
    }
  }, [fetchData]);

  return { screens, playlists, loading, error, claim, updatePlaylist, remove, purge, refresh: fetchData };
}
