"use client";

import { useMemo, useState } from "react";
import { Screen } from "@/lib/services/screenService";
import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusDot } from "@/components/ui/StatusDot";
import { isScreenOnline, relativeTime } from "@/lib/screenStatus";
import { CloudScreenControl } from "./CloudScreenControl";

interface ScreenInspectorProps {
  screen: Screen;
  playlists: Playlist[];
  onClose: () => void;
  onUpdate: (screenId: string, name: string, playlistId: string | null) => void;
  onDelete: (screenId: string) => void;
}

export function ScreenInspector({ screen, playlists, onClose, onUpdate, onDelete }: ScreenInspectorProps) {
  const [name, setName] = useState(screen.name);
  const [playlistId, setPlaylistId] = useState(screen.playlistId ?? "");
  const online = isScreenOnline(screen);

  const playlistOptions = useMemo(
    () => [{ value: "", label: "No playlist" }, ...playlists.map((playlist) => ({ value: playlist.id, label: playlist.name }))],
    [playlists]
  );

  return (
    <aside className="rounded-lg border border-surface-border bg-surface-card xl:sticky xl:top-4 xl:self-start" aria-label={`Inspector for ${screen.name}`}>
      <div className="flex items-start justify-between gap-3 border-b border-surface-border px-4 py-4">
        <div className="min-w-0">
          <p className="text-eyebrow text-ink-soft">Screen inspector</p>
          <h3 className="mt-1 truncate text-label text-ink">{screen.name}</h3>
        </div>
        <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-meta text-ink-muted hover:bg-surface-hover hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint" aria-label="Close inspector">Close</button>
      </div>
      <div className="space-y-5 p-4">
        <div className="flex items-center justify-between rounded-md bg-surface-sunken px-3 py-2">
          <span className="text-meta text-ink-muted">Status</span>
          <span className={`flex items-center gap-2 text-meta font-semibold ${screen.pairingCode ? "text-info-cobalt" : online ? "text-cleared-green" : "text-pending-amber"}`}>
            <StatusDot online={online} />
            {screen.pairingCode ? "Awaiting pairing" : online ? "Online" : "Offline"}
          </span>
        </div>
        <div className="space-y-3">
          <Input label="Screen name" value={name} onChange={(event) => setName(event.target.value)} />
          <Select label="Assigned playlist" value={playlistId} onChange={(event) => setPlaylistId(event.target.value)} options={playlistOptions} />
          <Button size="md" className="w-full" disabled={!name.trim()} onClick={() => onUpdate(screen.id, name.trim(), playlistId || null)}>Save changes</Button>
        </div>
        <dl className="space-y-2 border-t border-surface-border pt-4">
          <div className="flex justify-between gap-4"><dt className="text-meta text-ink-muted">Last seen</dt><dd className="font-mono text-meta text-ink tnum">{screen.pairingCode ? "—" : relativeTime(screen.lastSeen)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-meta text-ink-muted">Pairing code</dt><dd className="font-mono text-meta text-ink tnum">{screen.pairingCode ?? "Claimed"}</dd></div>
        </dl>
        {!screen.pairingCode && <CloudScreenControl screen={screen} />}
        <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(screen.id)}>Delete screen</Button>
      </div>
    </aside>
  );
}
