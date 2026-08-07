"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/lib/services/screenService";
import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ModuleToolbar } from "@/components/ui/ModuleToolbar";
import { ViewTabs } from "@/components/ui/ViewTabs";
import { ScreenIcon } from "@/components/icons";
import { isScreenOnline, relativeTime } from "@/lib/screenStatus";
import { ScreenCard } from "./ScreenCard";
import { ScreenInspector } from "./ScreenInspector";

interface ScreensListProps {
  screens: Screen[];
  playlists: Playlist[];
  loading: boolean;
  onUpdatePlaylist: (screenId: string, screenName: string, playlistId: string | null) => void;
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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "attention">("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [purgeOpen, setPurgeOpen] = useState(false);
  const selectedId = searchParams.get("screen");
  const selectedScreen = selectedId ? screens.find((screen) => screen.id === selectedId) ?? null : null;

  const setSelection = (screenId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (screenId) params.set("screen", screenId);
    else params.delete("screen");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  const filteredScreens = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return screens.filter((s) => {
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || Boolean(s.pairingCode?.toLowerCase().includes(q));
      const matchesStatus = statusFilter === "all"
        || (statusFilter === "online" && !s.pairingCode && isScreenOnline(s))
        || (statusFilter === "attention" && (Boolean(s.pairingCode) || !isScreenOnline(s)));
      return matchesSearch && matchesStatus;
    });
  }, [screens, searchQuery, statusFilter]);

  const onlineCount = screens.filter((screen) => !screen.pairingCode && isScreenOnline(screen)).length;
  const attentionCount = screens.length - onlineCount;

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget);
    if (selectedId === deleteTarget) setSelection(null);
    setDeleteTarget(null);
  };

  const confirmPurge = async () => {
    await onPurge();
    setPurgeOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-3 border-b border-surface-border pb-3 sm:flex-row sm:items-center">
        <h2 className="text-label text-ink">Configured screens</h2>
        <ModuleToolbar>
          {screens.length > 0 && (
            <Input
              placeholder="Search screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56"
              aria-label="Search screens"
            />
          )}
          <Button variant="destructive" size="sm" onClick={() => setPurgeOpen(true)}>
            Purge Stale Screens
          </Button>
        </ModuleToolbar>
      </div>

      <ViewTabs
        label="Screen status"
        value={statusFilter}
        onChange={setStatusFilter}
        tabs={[
          { value: "all", label: "All screens", count: screens.length },
          { value: "online", label: "Online", count: onlineCount },
          { value: "attention", label: "Needs attention", count: attentionCount },
        ]}
      />

      {loading ? (
        <LoadingSkeleton variant="card" count={4} />
      ) : filteredScreens.length === 0 ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
          <EmptyState
            variant="dashed"
            icon={ScreenIcon}
            title={searchQuery ? "No screens match your search." : "You have no configured screens."}
            description={searchQuery ? undefined : "Enter a pairing code above to add one."}
          />
          {selectedScreen && (
            <ScreenInspector
              key={selectedScreen.id}
              screen={selectedScreen}
              playlists={playlists}
              onClose={() => setSelection(null)}
              onUpdate={onUpdatePlaylist}
              onDelete={setDeleteTarget}
            />
          )}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0">
            <div className="hidden overflow-hidden rounded-lg border border-surface-border bg-surface-card lg:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-surface-sunken text-eyebrow text-ink-soft">
                  <tr>
                    <th scope="col" className="px-4 py-2.5">Screen</th>
                    <th scope="col" className="px-4 py-2.5">Status</th>
                    <th scope="col" className="px-4 py-2.5">Playlist</th>
                    <th scope="col" className="px-4 py-2.5 text-right">Last seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredScreens.map((screen) => {
                    const online = isScreenOnline(screen);
                    const selected = selectedId === screen.id;
                    return (
                      <tr
                        key={screen.id}
                        tabIndex={0}
                        role="button"
                        data-selected={selected ? "true" : undefined}
                        onClick={() => setSelection(screen.id)}
                        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelection(screen.id); } }}
                        className={`cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal-mint ${selected ? "bg-signal-mint/10" : "hover:bg-surface-hover"}`}
                      >
                        <td className="px-4 py-3">
                          <p className="text-label text-ink">{screen.name}</p>
                          {screen.pairingCode && <p className="mt-0.5 font-mono text-meta text-info-cobalt tnum">Code {screen.pairingCode}</p>}
                        </td>
                        <td className={`px-4 py-3 text-meta font-semibold ${screen.pairingCode ? "text-info-cobalt" : online ? "text-cleared-green" : "text-pending-amber"}`}>
                          {screen.pairingCode ? "Awaiting pairing" : online ? "Online" : "Offline"}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={screen.playlistId ?? ""}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => onUpdatePlaylist(screen.id, screen.name, event.target.value || null)}
                            className="h-8 max-w-full rounded-md border border-surface-border bg-surface-card px-2 text-meta text-ink focus:outline-none focus:ring-2 focus:ring-signal-mint"
                            aria-label={`Assign playlist for ${screen.name}`}
                          >
                            <option value="">No playlist</option>
                            {playlists.map((playlist) => <option key={playlist.id} value={playlist.id}>{playlist.name}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-meta text-ink-soft tnum">{screen.pairingCode ? "—" : relativeTime(screen.lastSeen)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:hidden">
              {filteredScreens.map((screen) => (
                <div key={screen.id} className={selectedId === screen.id ? "rounded-lg ring-2 ring-signal-mint" : ""}>
                  <ScreenCard
                    screen={screen}
                    playlists={playlists}
                    onAssignPlaylist={onUpdatePlaylist}
                    onDelete={setDeleteTarget}
                    onSelect={() => setSelection(screen.id)}
                  />
                </div>
              ))}
            </div>
          </div>
          {selectedScreen && (
            <ScreenInspector
              key={selectedScreen.id}
              screen={selectedScreen}
              playlists={playlists}
              onClose={() => setSelection(null)}
              onUpdate={onUpdatePlaylist}
              onDelete={setDeleteTarget}
            />
          )}
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
