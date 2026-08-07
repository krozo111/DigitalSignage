import Image from "next/image";
import { MediaItem } from "@/lib/services/mediaService";
import { TrashIcon } from "@/components/icons";

interface MediaCardProps {
  item: MediaItem;
  onDelete: (item: MediaItem) => void;
  onSelect?: () => void;
}

export function MediaCard({ item, onDelete, onSelect }: MediaCardProps) {
  return (
    <div className="group border-b border-r border-surface-border bg-surface-card transition-colors hover:bg-surface-hover">
      <div className="relative aspect-[4/3] bg-surface-sunken">
        {item.type === "vid" ? (
          <video
            src={item.url}
            className="w-full h-full object-cover"
            muted
            onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
            onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
          />
        ) : (
          <Image
            src={item.url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onDelete(item)}
            className="rounded-md border border-danger bg-surface-card p-2 text-danger transition hover:bg-danger-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Delete ${item.name}`}
          >
            <TrashIcon size={18} />
          </button>
        </div>
      </div>
      <div className="p-3">
        {onSelect ? <button type="button" onClick={onSelect} className="block max-w-full truncate text-left text-label text-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint">{item.name}</button> : <p className="truncate text-label text-ink">{item.name}</p>}
        <p className="mt-1 flex justify-between font-mono text-meta text-ink-soft tnum">
          <span>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
          <span className="uppercase">{item.type}</span>
        </p>
      </div>
    </div>
  );
}
