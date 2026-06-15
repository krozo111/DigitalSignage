"use client";

import Link from "next/link";
import { getAllScreens, Screen } from "@/lib/services/screenService";
import { getAllPlaylists, Playlist } from "@/lib/services/playlistService";
import { getAllMedia, MediaItem } from "@/lib/services/mediaService";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusDot } from "@/components/ui/StatusDot";
import {
  ScreenIcon,
  PlaylistIcon,
  MediaIcon,
  RocketIcon,
  AlertIcon,
  ChevronRightIcon,
} from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { useCachedQuery, CacheKeys } from "@/lib/cache";
import { isScreenOnline, relativeTime } from "@/lib/screenStatus";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AdminDashboardHome() {
  useDocumentTitle("Dashboard — Yugo Signage");

  const { data: screens = [], loading: screensLoading } = useCachedQuery<Screen[]>(
    CacheKeys.screens,
    getAllScreens,
  );
  const { data: playlists = [], loading: playlistsLoading } = useCachedQuery<Playlist[]>(
    CacheKeys.playlists,
    getAllPlaylists,
  );
  const { data: mediaItems = [], loading: mediaLoading } = useCachedQuery<MediaItem[]>(
    CacheKeys.media,
    getAllMedia,
  );

  const loading = screensLoading || playlistsLoading || mediaLoading;

  const linked = screens.filter((s) => s.pairingCode === null);
  const pending = screens.filter((s) => s.pairingCode !== null);
  const onlineCount = linked.filter(isScreenOnline).length;
  const offlineCount = linked.length - onlineCount;
  const missingPlaylistCount = linked.filter((s) => !s.playlistId).length;
  const totalSizeMB = (mediaItems.reduce((acc, m) => acc + m.size, 0) / 1024 / 1024).toFixed(0);

  const playlistName = (id: string | null) =>
    id ? playlists.find((p) => p.id === id)?.name ?? "Unknown playlist" : null;

  const networkIsEmpty = screens.length === 0;

  if (loading) {
    return <LoadingSkeleton variant="grid" count={3} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Live status of every screen on the network."
        actions={
          <Link
            href="/admin/screens"
            className="inline-flex items-center gap-1 text-label font-medium text-accent hover:text-accent-strong"
          >
            Manage screens <span aria-hidden="true">→</span>
          </Link>
        }
      />

      {/* Instrument readout: the aggregate answer in one mono line. */}
      {!networkIsEmpty && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-meta tnum">
          <span className="flex items-center gap-2 text-success">
            <StatusDot online /> {onlineCount} online
          </span>
          <span className="flex items-center gap-2 text-fg-muted">
            <StatusDot online={false} /> {offlineCount} offline
          </span>
          {missingPlaylistCount > 0 && (
            <span className="flex items-center gap-2 text-warning">
              <AlertIcon size={13} aria-hidden="true" /> {missingPlaylistCount} no playlist
            </span>
          )}
          {pending.length > 0 && (
            <span className="flex items-center gap-2 text-info">
              <ScreenIcon size={13} aria-hidden="true" /> {pending.length} pairing
            </span>
          )}
        </div>
      )}

      {/* The screen wall: a hairline grid of live tiles, one per claimed screen. */}
      {networkIsEmpty ? (
        <EmptyState
          icon={ScreenIcon}
          title="No screens yet"
          description="Open the player on a Smart TV to generate a pairing code, then claim it from the Screens page."
          action={
            <Link
              href="/admin/screens"
              className="inline-flex items-center gap-1 text-label font-medium text-accent hover:text-accent-strong"
            >
              Go to Screens <span aria-hidden="true">→</span>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-border">
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
            {linked.map((screen) => {
              const online = isScreenOnline(screen);
              const list = playlistName(screen.playlistId);
              return (
                <div
                  key={screen.id}
                  className="flex min-h-[7.5rem] flex-col gap-3 bg-surface-1 p-5 transition-colors hover:bg-surface-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <StatusDot online={online} />
                      <span className="truncate text-label font-semibold text-fg">{screen.name}</span>
                      <span className="sr-only">{online ? "online" : "offline"}</span>
                    </span>
                    <span className="shrink-0 font-mono text-meta text-fg-subtle tnum">
                      {relativeTime(screen.lastSeen)}
                    </span>
                  </div>
                  <div className="mt-auto">
                    {list ? (
                      <span className="flex items-center gap-1.5 truncate text-meta text-fg-muted">
                        <PlaylistIcon size={13} className="shrink-0 text-fg-subtle" aria-hidden="true" />
                        {list}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-meta text-warning">
                        <AlertIcon size={13} className="shrink-0" aria-hidden="true" />
                        No playlist assigned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {pending.map((screen) => (
              <div
                key={screen.id}
                className="flex min-h-[7.5rem] flex-col justify-between gap-3 bg-surface-1 p-5"
              >
                <span className="text-eyebrow text-info">Awaiting pairing</span>
                <div>
                  <p className="font-mono text-h2 tracking-[0.15em] text-fg tnum">{screen.pairingCode}</p>
                  <p className="mt-1 text-meta text-fg-subtle">Enter this code on the Screens page.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalog, kept quiet: two cells in the same hairline language, mono counts. */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
        <Link
          href="/admin/playlists"
          className="flex items-center justify-between gap-3 bg-surface-1 px-5 py-4 transition-colors hover:bg-surface-2"
        >
          <span className="flex items-center gap-2 text-meta text-fg-muted">
            <PlaylistIcon size={14} className="text-fg-subtle" aria-hidden="true" /> Playlists
          </span>
          <span className="font-mono text-label text-fg tnum">{playlists.length}</span>
        </Link>
        <Link
          href="/admin/media"
          className="flex items-center justify-between gap-3 bg-surface-1 px-5 py-4 transition-colors hover:bg-surface-2"
        >
          <span className="flex items-center gap-2 text-meta text-fg-muted">
            <MediaIcon size={14} className="text-fg-subtle" aria-hidden="true" /> Library
          </span>
          <span className="font-mono text-label text-fg tnum">
            {mediaItems.length}
            <span className="text-fg-subtle"> · {totalSizeMB} MB</span>
          </span>
        </Link>
      </div>

      {/* Onboarding as progressive disclosure: open when there's nothing yet, tucked away otherwise. */}
      <details
        open={networkIsEmpty}
        className="group rounded-xl border border-border bg-surface-3 px-5 py-4"
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 text-eyebrow text-fg-muted [&::-webkit-details-marker]:hidden">
          <RocketIcon size={15} className="text-fg-subtle" aria-hidden="true" />
          How to start a screen
          <ChevronRightIcon
            size={14}
            className="ml-auto text-fg-subtle transition-transform group-open:rotate-90"
            aria-hidden="true"
          />
        </summary>
        <ol className="mt-4 max-w-[68ch] list-inside list-decimal space-y-2 text-label leading-relaxed text-fg-muted marker:font-medium marker:text-fg-subtle">
          <li>
            Upload images and videos in the{" "}
            <Link href="/admin/media" className="text-info underline-offset-2 hover:text-info-strong hover:underline">
              Media
            </Link>{" "}
            section.
          </li>
          <li>
            Group them into{" "}
            <Link href="/admin/playlists" className="text-info underline-offset-2 hover:text-info-strong hover:underline">
              Playlists
            </Link>{" "}
            in the order you want them to play.
          </li>
          <li>
            Open{" "}
            <code className="rounded bg-fg/[0.06] px-1.5 py-0.5 font-mono text-[0.875em] text-fg">/player</code>{" "}
            on the Smart TV. A pairing code appears.
          </li>
          <li>
            Enter the code in{" "}
            <Link href="/admin/screens" className="text-info underline-offset-2 hover:text-info-strong hover:underline">
              Screens
            </Link>{" "}
            and assign a playlist.
          </li>
        </ol>
      </details>
    </div>
  );
}
