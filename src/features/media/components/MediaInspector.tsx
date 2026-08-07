"use client";

import Image from "next/image";
import { MediaItem } from "@/lib/services/mediaService";
import { Button } from "@/components/ui/Button";

interface MediaInspectorProps {
  item: MediaItem;
  onClose: () => void;
  onDelete: (item: MediaItem) => void;
}

export function MediaInspector({ item, onClose, onDelete }: MediaInspectorProps) {
  return (
    <aside className="rounded-lg border border-surface-border bg-surface-card xl:sticky xl:top-4 xl:self-start" aria-label={`Inspector for ${item.name}`}>
      <div className="flex items-start justify-between gap-3 border-b border-surface-border px-4 py-4"><div className="min-w-0"><p className="text-eyebrow text-ink-soft">Media inspector</p><h3 className="mt-1 truncate text-label text-ink">{item.name}</h3></div><button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-meta text-ink-muted hover:bg-surface-hover hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint">Close</button></div>
      <div className="space-y-5 p-4">
        <div className="relative aspect-video overflow-hidden rounded-md border border-surface-border bg-surface-sunken">
          {item.type === "vid" ? <video src={item.url} controls className="h-full w-full object-contain" /> : <Image src={item.url} alt={item.name} fill sizes="400px" className="object-contain" />}
        </div>
        <dl className="divide-y divide-surface-border rounded-md border border-surface-border bg-surface-sunken">
          <div className="flex justify-between px-3 py-2.5"><dt className="text-meta text-ink-muted">Type</dt><dd className="text-meta font-semibold uppercase text-ink">{item.type}</dd></div>
          <div className="flex justify-between px-3 py-2.5"><dt className="text-meta text-ink-muted">Size</dt><dd className="font-mono text-meta text-ink tnum">{(item.size / 1024 / 1024).toFixed(1)} MB</dd></div>
          <div className="flex justify-between gap-4 px-3 py-2.5"><dt className="text-meta text-ink-muted">Storage</dt><dd className="truncate font-mono text-meta text-ink-soft" title={item.storagePath}>{item.storagePath}</dd></div>
        </dl>
        <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(item)}>Delete media</Button>
      </div>
    </aside>
  );
}
