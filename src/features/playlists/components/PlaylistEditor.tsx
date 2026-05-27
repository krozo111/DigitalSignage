"use client";

import { MediaItem } from "@/lib/services/mediaService";
import { MediaPicker } from "./MediaPicker";
import { PlaylistBuilder } from "./PlaylistBuilder";
import { BuiltItem } from "../types";

interface PlaylistEditorProps {
  mediaList: MediaItem[];
  name: string;
  items: BuiltItem[];
  nameError: string;
  itemsError: string;
  saving: boolean;
  editingId: string | null;
  onAddItem: (media: MediaItem) => void;
  onNameChange: (name: string) => void;
  onRemoveItem: (index: number) => void;
  onUpdateDuration: (index: number, duration: number) => void;
  onReorder: (items: BuiltItem[]) => void;
  onSave: () => void;
}

export function PlaylistEditor({
  mediaList,
  onAddItem,
  ...builderProps
}: PlaylistEditorProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <MediaPicker mediaList={mediaList} onAdd={onAddItem} />
      <PlaylistBuilder {...builderProps} />
    </div>
  );
}
