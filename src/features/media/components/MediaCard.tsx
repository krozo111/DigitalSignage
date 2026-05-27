import { MediaItem } from "@/lib/services/mediaService";
import { Card } from "@/components/ui/Card";
import { TrashIcon } from "@/components/icons";

interface MediaCardProps {
  item: MediaItem;
  onDelete: (item: MediaItem) => void;
}

export function MediaCard({ item, onDelete }: MediaCardProps) {
  return (
    <Card className="overflow-hidden group">
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
        <div className="absolute inset-0 bg-surface-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onDelete(item)}
            className="bg-danger text-fg p-2.5 rounded-full hover:bg-danger/90 transition shadow-lg"
            aria-label={`Delete ${item.name}`}
          >
            <TrashIcon size={18} />
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-fg truncate">{item.name}</p>
        <p className="text-xs text-fg-subtle mt-1 flex justify-between uppercase font-bold tracking-wider">
          <span>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
          <span>{item.type}</span>
        </p>
      </div>
    </Card>
  );
}
