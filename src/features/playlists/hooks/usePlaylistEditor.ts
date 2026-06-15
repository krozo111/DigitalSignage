"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import { MediaItem } from "@/lib/services/mediaService";
import { Playlist } from "@/lib/services/playlistService";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";
import { BuiltItem, buildItemsFromPlaylist } from "../types";

interface UsePlaylistEditorArgs {
  mediaList: MediaItem[];
  onSave: (
    name: string,
    items: { mediaId: string; duration: number; order: number }[],
    editingId: string | null
  ) => Promise<void>;
  onDone: () => void;
}

export function usePlaylistEditor({ mediaList, onSave, onDone }: UsePlaylistEditorArgs) {
  const { setDirty, confirmNavigation } = useUnsavedChanges();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [items, setItems] = useState<BuiltItem[]>([]);
  const [nameError, setNameError] = useState("");
  const [itemsError, setItemsError] = useState("");
  const [saving, setSaving] = useState(false);

  const isDirty = name.trim() !== "" || items.length > 0;

  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const reset = useCallback(() => {
    setEditingId(null);
    setName("");
    setItems([]);
    setNameError("");
    setItemsError("");
  }, []);

  const cancel = useCallback(() => {
    // Routes through the shared in-app dialog: runs immediately when clean,
    // otherwise asks to discard before resetting and closing the editor.
    confirmNavigation(() => {
      reset();
      onDone();
    });
  }, [confirmNavigation, reset, onDone]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cancel]);

  const loadForEdit = useCallback(
    (playlist: Playlist) => {
      setEditingId(playlist.id);
      setName(playlist.name);
      setItems(buildItemsFromPlaylist(playlist, mediaList));
    },
    [mediaList]
  );

  const loadForDuplicate = useCallback(
    (playlist: Playlist) => {
      setEditingId(null);
      setName(`${playlist.name} (Copy)`);
      setItems(buildItemsFromPlaylist(playlist, mediaList));
    },
    [mediaList]
  );

  const addItem = useCallback((media: MediaItem) => {
    setItems((prev) => [
      ...prev,
      { ...media, duration: media.type === "vid" ? 15 : 10 },
    ]);
    setItemsError("");
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateDuration = useCallback((index: number, duration: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], duration };
      return copy;
    });
  }, []);

  const reorder = useCallback((updated: BuiltItem[]) => {
    setItems(updated);
  }, []);

  const updateName = useCallback((value: string) => {
    setName(value);
    if (value.trim()) setNameError("");
  }, []);

  const save = useCallback(async () => {
    let hasError = false;
    if (!name.trim()) {
      setNameError("Playlist name is required");
      hasError = true;
    }
    if (items.length === 0) {
      setItemsError("Add at least one media item");
      hasError = true;
    }
    if (hasError) return;

    try {
      setSaving(true);
      const itemsToSave = items.map((item, index) => ({
        mediaId: item.id,
        duration: item.duration,
        order: index,
      }));
      await onSave(name, itemsToSave, editingId);
      reset();
      onDone();
    } catch (error) {
      toast.error("Error: " + errorMessage(error));
    } finally {
      setSaving(false);
    }
  }, [name, items, editingId, onSave, reset, onDone]);

  return {
    editingId,
    name,
    items,
    nameError,
    itemsError,
    saving,
    isDirty,
    updateName,
    addItem,
    removeItem,
    updateDuration,
    reorder,
    loadForEdit,
    loadForDuplicate,
    save,
    cancel,
    reset,
  };
}
