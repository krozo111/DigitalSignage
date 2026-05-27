"use client";

import { useState } from "react";
import { MediaItem } from "@/lib/services/mediaService";
import { Button } from "@/components/ui/Button";
import { MediaCard } from "./MediaCard";

const PAGE_SIZE = 20;

interface MediaGridProps {
  items: MediaItem[];
  searchQuery: string;
  onDelete: (item: MediaItem) => void;
}

export function MediaGrid({ items, searchQuery, onDelete }: MediaGridProps) {
  const [page, setPage] = useState(1);
  const displayed = items.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < items.length;

  if (searchQuery && items.length === 0) {
    return (
      <div className="text-center py-10 text-fg-subtle">
        No files match &quot;{searchQuery}&quot;
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayed.map((item) => (
          <MediaCard key={item.id} item={item} onDelete={onDelete} />
        ))}
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
