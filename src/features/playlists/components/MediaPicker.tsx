"use client";

import { useMemo, useState } from "react";
import { MediaItem } from "@/lib/services/mediaService";

interface MediaPickerProps {
  mediaList: MediaItem[];
  onAdd: (media: MediaItem) => void;
}

export function MediaPicker({ mediaList, onAdd }: MediaPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mediaList.filter((m) => m.name.toLowerCase().includes(q));
  }, [mediaList, search]);

  return (
    <div className="w-full lg:w-1/2 flex flex-col h-[600px] rounded-xl border border-border bg-surface-1 p-4">
      <h2 className="text-h2 mb-4 text-fg">Library</h2>
      <input
        type="text"
        placeholder="Search media..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-surface-2 border border-border-strong rounded-lg px-3 py-2 mb-3 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-fg-subtle"
        aria-label="Search media to add to playlist"
      />
      <div className="overflow-y-auto flex-1 pr-2 grid grid-cols-2 gap-3 pb-4">
        {mediaList.length === 0 ? (
          <p className="col-span-2 text-fg-disabled text-meta">No content in Media Library.</p>
        ) : (
          filtered.map((media) => (
            <button
              key={media.id}
              type="button"
              onClick={() => onAdd(media)}
              className="cursor-pointer group relative bg-surface-2 rounded-lg overflow-hidden border border-border hover:border-accent transition-colors aspect-video text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Add ${media.name} to playlist`}
            >
              {media.type === "vid" ? (
                <video src={media.url} className="w-full h-full object-cover" />
              ) : (
                <img
                  src={media.url}
                  alt={media.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-accent text-label font-semibold">+ Add</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
