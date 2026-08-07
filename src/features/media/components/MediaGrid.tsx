"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaItem } from "@/lib/services/mediaService";
import { Button } from "@/components/ui/Button";
import { MediaCard } from "./MediaCard";

const PAGE_SIZE = 20;

interface MediaGridProps {
  items: MediaItem[];
  searchQuery: string;
  onDelete: (item: MediaItem) => void;
  selectedId?: string | null;
  onSelect?: (item: MediaItem) => void;
  viewMode?: "grid" | "list";
}

export function MediaGrid({ items, searchQuery, onDelete, selectedId, onSelect, viewMode = "grid" }: MediaGridProps) {
  const [page, setPage] = useState(1);
  const displayed = items.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < items.length;

  if (searchQuery && items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-surface-border-strong bg-surface-card px-6 py-12 text-center text-meta text-ink-muted">
        No media matches &quot;{searchQuery}&quot;. Try a different search.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-surface-border bg-surface-card">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {displayed.map((item) => (
              <div key={item.id} className={selectedId === item.id ? "ring-2 ring-inset ring-signal-mint" : ""}>
                <MediaCard item={item} onDelete={onDelete} onSelect={onSelect ? () => onSelect(item) : undefined} />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            <div className="hidden grid-cols-[minmax(0,1.5fr)_7rem_8rem_7rem] gap-4 bg-surface-sunken px-4 py-2.5 text-eyebrow text-ink-soft sm:grid"><span>Media</span><span>Type</span><span>Size</span><span className="text-right">Action</span></div>
            {displayed.map((item) => (
              <div key={item.id} role="button" tabIndex={0} data-selected={selectedId === item.id ? "true" : undefined} onClick={() => onSelect?.(item)} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && onSelect) { event.preventDefault(); onSelect(item); } }} className={`grid cursor-pointer grid-cols-[minmax(0,1fr)_5rem] items-center gap-3 px-4 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal-mint sm:grid-cols-[minmax(0,1.5fr)_7rem_8rem_7rem] sm:gap-4 ${selectedId === item.id ? "bg-signal-mint/10" : "hover:bg-surface-hover"}`}>
                <div className="flex min-w-0 items-center gap-3"><div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-surface-sunken">{item.type === "img" ? <Image src={item.url} alt="" fill sizes="56px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-meta font-semibold text-info-cobalt">VIDEO</span>}</div><span className="truncate text-label text-ink">{item.name}</span></div>
                <span className="text-meta font-semibold uppercase text-ink-muted">{item.type}</span>
                <span className="hidden font-mono text-meta text-ink-muted tnum sm:block">{(item.size / 1024 / 1024).toFixed(1)} MB</span>
                <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(item); }} className="text-right text-meta font-semibold text-critical-red hover:underline">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {hasMore && (
        <div className="text-center mt-4">
          <Button variant="ghost" onClick={() => setPage((p) => p + 1)}>
            Load More ({items.length - displayed.length} remaining)
          </Button>
        </div>
      )}
    </>
  );
}
