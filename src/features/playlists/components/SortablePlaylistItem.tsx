"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CloseIcon, DragHandleIcon } from "@/components/icons";
import { BuiltItem } from "../types";

interface SortablePlaylistItemProps {
  item: BuiltItem;
  index: number;
  onRemove: (index: number) => void;
  onUpdateDuration: (index: number, duration: number) => void;
}

export function SortablePlaylistItem({
  item,
  index,
  onRemove,
  onUpdateDuration,
}: SortablePlaylistItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: String(index) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isBroken = !item.url;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-surface-1 border p-3 rounded-lg transition-colors ${
        isDragging
          ? "z-50 border-accent"
          : isBroken
          ? "border-danger/40"
          : "border-border"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-fg-subtle hover:text-fg-muted p-1 cursor-grab active:cursor-grabbing select-none flex items-center"
        aria-label="Drag to reorder"
      >
        <DragHandleIcon />
      </button>

      <div
        className={`h-16 w-16 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center ${
          isBroken ? "bg-danger/20" : "bg-surface-2"
        }`}
      >
        {isBroken ? (
          <span className="text-danger text-meta font-semibold">MISSING</span>
        ) : item.type === "vid" ? (
          <video src={item.url} className="h-full w-full object-cover" />
        ) : (
          <img src={item.url} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-label truncate ${isBroken ? "text-danger" : "text-fg"}`}>
          {item.name}
          {isBroken && <span className="ml-2 text-meta text-danger/60">(deleted)</span>}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <label className="text-meta text-fg-subtle">Duration (sec):</label>
          <input
            type="number"
            min="1"
            value={item.duration}
            onChange={(e) => onUpdateDuration(index, parseInt(e.target.value) || 1)}
            className="w-20 bg-surface-2 border border-border-strong rounded px-2 py-1 text-label text-fg font-mono tnum focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label={`Duration for ${item.name}`}
          />
        </div>
      </div>

      <button
        onClick={() => onRemove(index)}
        className="text-danger hover:text-danger/80 p-2"
        aria-label={`Remove ${item.name}`}
      >
        <CloseIcon size={18} />
      </button>
    </div>
  );
}
