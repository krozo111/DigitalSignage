import { MediaItem } from "@/lib/services/mediaService";
import { TrashIcon } from "@/components/icons";

interface MediaCardProps {
  item: MediaItem;
  onDelete: (item: MediaItem) => void;
}

export function MediaCard({ item, onDelete }: MediaCardProps) {
  return (
    <div className="group bg-surface-1 transition-colors hover:bg-surface-2">
      <div className="aspect-square bg-surface-2 relative">
        {item.type === "vid" ? (
          <video
            src={item.url}
            className="w-full h-full object-cover"
            muted
            onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
            onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
          />
        ) : (
          <img
            src={item.url}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onDelete(item)}
            className="bg-danger text-on-danger p-2.5 rounded-full hover:bg-danger/90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Delete ${item.name}`}
          >
            <TrashIcon size={18} />
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-label text-fg truncate">{item.name}</p>
        <p className="mt-1 flex justify-between font-mono text-meta text-fg-subtle tnum">
          <span>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
          <span className="uppercase">{item.type}</span>
        </p>
      </div>
    </div>
  );
}
