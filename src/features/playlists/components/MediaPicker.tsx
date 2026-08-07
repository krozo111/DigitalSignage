"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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
    <section className="flex h-[600px] w-full flex-col rounded-lg border border-surface-border bg-surface-card p-4 lg:w-1/2">
      <h2 className="text-h2 mb-4 text-ink">Media library</h2>
      <input
        type="text"
        placeholder="Search media..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 w-full rounded-md border border-surface-border bg-surface-sunken px-3 text-label text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-signal-mint"
        aria-label="Search media to add to playlist"
      />
      <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto pb-4 pr-2">
        {mediaList.length === 0 ? (
            <p className="col-span-2 text-meta text-ink-soft">No media is available yet. Upload content first.</p>
        ) : (
          filtered.map((media) => (
            <button
              key={media.id}
              type="button"
              onClick={() => onAdd(media)}
              className="group relative aspect-video cursor-pointer overflow-hidden rounded-md border border-surface-border bg-surface-sunken text-left transition-colors hover:border-signal-mint focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint"
              aria-label={`Add ${media.name} to playlist`}
            >
              {media.type === "vid" ? (
                <video src={media.url} className="w-full h-full object-cover" />
              ) : (
                <Image
                  src={media.url}
                  alt={media.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 240px"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-signal-mint text-label font-semibold">+ Add</span>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
