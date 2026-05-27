"use client";

import { useMemo, useState } from "react";
import { Screen } from "@/lib/services/screenService";
import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ScreenIcon } from "@/components/icons";
import { ScreenCard } from "./ScreenCard";

interface ScreensListProps {
  screens: Screen[];
  playlists: Playlist[];
  loading: boolean;
  onUpdatePlaylist: (screenId: string, screenName: string, playlistId: string) => void;
  onDelete: (screenId: string) => Promise<void>;
  onPurge: () => Promise<void>;
}

export function ScreensList({
  screens,
  playlists,
  loading,
  onUpdatePlaylist,
  onDelete,
  onPurge,
}: ScreensListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [purgeOpen, setPurgeOpen] = useState(false);

  const filteredScreens = useMemo(() => {
    if (!searchQuery.trim()) return screens;
    const q = searchQuery.toLowerCase();
    return screens.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.pairingCode && s.pairingCode.toLowerCase().includes(q))
    );
  }, [screens, searchQuery]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget);
    setDeleteTarget(null);
  };

  const confirmPurge = async () => {
    await onPurge();
    setPurgeOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold">My Active Screens</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {screens.length > 0 && (
            <Input
              placeholder="Search screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56"
              aria-label="Search screens"
            />
          )}
          <Button variant="ghost" onClick={() => setPurgeOpen(true)}>
            Purge Stale Screens
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton variant="card" count={4} />
      ) : filteredScreens.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={ScreenIcon}
          title={searchQuery ? "No screens match your search." : "You have no configured screens."}
          description={searchQuery ? undefined : "Enter a pairing code above to add one."}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredScreens.map(screen => (
            <ScreenCard
              key={screen.id}
              screen={screen}
              playlists={playlists}
              onAssignPlaylist={onUpdatePlaylist}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Screen"
        message="Are you sure you want to permanently delete this screen? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={purgeOpen}
        title="Purge Stale Screens"
        message={'This will permanently delete all screens that are still named "New TV" or haven\'t been seen in 24+ hours. Continue?'}
        confirmText="Purge"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmPurge}
        onCancel={() => setPurgeOpen(false)}
      />
    </div>
  );
}
