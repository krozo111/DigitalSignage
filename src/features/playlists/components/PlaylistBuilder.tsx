"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AlertIcon, EmptyIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BuiltItem } from "../types";
import { SortablePlaylistItem } from "./SortablePlaylistItem";

interface PlaylistBuilderProps {
  name: string;
  items: BuiltItem[];
  nameError: string;
  itemsError: string;
  saving: boolean;
  editingId: string | null;
  onNameChange: (name: string) => void;
  onRemoveItem: (index: number) => void;
  onUpdateDuration: (index: number, duration: number) => void;
  onReorder: (items: BuiltItem[]) => void;
  onSave: () => void;
}

export function PlaylistBuilder({
  name,
  items,
  nameError,
  itemsError,
  saving,
  editingId,
  onNameChange,
  onRemoveItem,
  onUpdateDuration,
  onReorder,
  onSave,
}: PlaylistBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <section className="flex min-h-[600px] w-full flex-col rounded-lg border border-surface-border bg-surface-card p-4 lg:w-1/2">
      <Input
        placeholder="Playlist Name (ex: Local Main Screen 1)"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        error={nameError}
      />

      <div
        className={`mt-4 flex-1 space-y-3 overflow-y-auto rounded-md border bg-surface-sunken p-3 pr-2 ${
          itemsError ? "border-danger" : "border-surface-border"
        }`}
      >
        {items.length === 0 ? (
          <div
            className={`h-full flex flex-col items-center justify-center mt-20 ${
              itemsError ? "text-danger" : "text-fg-disabled"
            }`}
          >
            <span className="mb-3">
              {itemsError ? <AlertIcon size={40} /> : <EmptyIcon size={40} />}
            </span>
            <p className="text-label text-ink-muted">{itemsError || "The playlist is empty."}</p>
            <p className="text-meta text-ink-soft">
              {itemsError ? "" : "Tap an element on the left to add it."}
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((_, i) => String(i))}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, idx) => (
                <SortablePlaylistItem
                  key={`${item.id}-${idx}`}
                  item={item}
                  index={idx}
                  onRemove={onRemoveItem}
                  onUpdateDuration={onUpdateDuration}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <Button
        variant="primary"
        size="lg"
        disabled={saving || items.length === 0 || !name}
        loading={saving}
        onClick={onSave}
        className="mt-6 w-full"
      >
        {saving ? "Saving" : editingId ? "Update Playlist" : "Save Playlist"}
      </Button>
    </section>
  );
}
