"use client";

import Link from "next/link";
import { getAllScreens, Screen } from "@/lib/services/screenService";
import { getAllPlaylists, Playlist } from "@/lib/services/playlistService";
import { getAllMedia, MediaItem } from "@/lib/services/mediaService";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { RefreshNotice } from "@/components/ui/RefreshNotice";
import {
  ScreenIcon,
  PlaylistIcon,
  MediaIcon,
  RocketIcon,
  ChevronRightIcon,
} from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { StatStrip } from "@/components/ui/StatStrip";
import { useCachedQuery, CacheKeys } from "@/lib/cache";
import { isScreenOnline, relativeTime } from "@/lib/screenStatus";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AdminDashboardHome() {
  useDocumentTitle("Dashboard — Yugo Signage");

  const { data: screensData, loading: screensLoading, error: screensError, refresh: refreshScreens } = useCachedQuery<Screen[]>(
    CacheKeys.screens,
    getAllScreens,
  );
  const { data: playlistsData, loading: playlistsLoading, error: playlistsError, refresh: refreshPlaylists } = useCachedQuery<Playlist[]>(
    CacheKeys.playlists,
    getAllPlaylists,
  );
  const { data: mediaData, loading: mediaLoading, error: mediaError, refresh: refreshMedia } = useCachedQuery<MediaItem[]>(
    CacheKeys.media,
    getAllMedia,
  );

  const screens = screensData ?? [];
  const playlists = playlistsData ?? [];
  const mediaItems = mediaData ?? [];
  const hasSavedData = screensData !== undefined || playlistsData !== undefined || mediaData !== undefined;

  const loading = screensLoading || playlistsLoading || mediaLoading;

  const linked = screens.filter((s) => s.pairingCode === null);
  const pending = screens.filter((s) => s.pairingCode !== null);
  const onlineCount = linked.filter(isScreenOnline).length;
  const offlineCount = linked.length - onlineCount;
  const missingPlaylistCount = linked.filter((s) => !s.playlistId).length;
  const totalSizeMB = (mediaItems.reduce((acc, m) => acc + m.size, 0) / 1024 / 1024).toFixed(0);

  const playlistName = (id: string | null) =>
    id
      ? playlistsData === undefined
        ? "Playlist data unavailable"
        : playlists.find((p) => p.id === id)?.name ?? "Unknown playlist"
      : null;

  const networkIsEmpty = screensData !== undefined && screens.length === 0;

  if (loading && !hasSavedData) {
    return <LoadingSkeleton variant="grid" count={3} />;
  }

  const firstError = screensError ?? playlistsError ?? mediaError;
  if (firstError && !hasSavedData) {
    return <ErrorState onRetry={() => { refreshScreens(); refreshPlaylists(); refreshMedia(); }} />;
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

      {firstError ? (
        <RefreshNotice
          message="Some dashboard data could not be refreshed. Saved sections may be out of date; unavailable sections are marked."
          onRetry={() => { refreshScreens(); refreshPlaylists(); refreshMedia(); }}
        />
      ) : loading ? (
        <p role="status" className="text-meta text-ink-muted">Refreshing dashboard data…</p>
      ) : null}

      <StatStrip
        items={[
          { label: "Online", value: screensData === undefined ? "—" : onlineCount, detail: screensData === undefined ? (screensLoading ? "Loading screens" : "Unavailable") : `${linked.length} linked screens`, tone: "success" },
          { label: "Offline", value: screensData === undefined ? "—" : offlineCount, detail: screensData === undefined ? (screensLoading ? "Loading screens" : "Unavailable") : missingPlaylistCount ? `${missingPlaylistCount} without playlist` : "All screens assigned", tone: offlineCount ? "warning" : "default" },
          { label: "Pairing", value: screensData === undefined ? "—" : pending.length, detail: screensData === undefined ? (screensLoading ? "Loading screens" : "Unavailable") : pending.length ? "Awaiting a claim" : "No pending screens", tone: pending.length ? "info" : "default" },
          { label: "Media library", value: mediaData === undefined ? "—" : mediaItems.length, detail: mediaData === undefined ? (mediaLoading ? "Loading media" : "Unavailable") : `${totalSizeMB} MB stored` },
        ]}
      />

      {/* The screen wall: a hairline grid of live tiles, one per claimed screen. */}
      {screensData === undefined ? (
        <section role="status" className="rounded-lg border border-surface-border bg-surface-card px-5 py-6 text-label text-ink-muted">
          {screensLoading ? "Loading screen status…" : "Screen status is unavailable until the next successful refresh."}
        </section>
      ) : networkIsEmpty ? (
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
        <section aria-labelledby="screen-status-heading" className="overflow-hidden rounded-lg border border-surface-border bg-surface-card">
          <div className="flex items-center justify-between border-b border-surface-border bg-surface-sunken px-4 py-3">
            <h2 id="screen-status-heading" className="text-label font-semibold text-ink">Screen status</h2>
            <Link href="/admin/screens" className="text-meta font-semibold text-info-cobalt hover:underline">View all</Link>
          </div>
          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(7rem,0.7fr)_minmax(0,1fr)_7rem] gap-4 border-b border-surface-border bg-surface-sunken px-4 py-2 text-eyebrow text-ink-soft md:grid">
            <span>Screen</span><span>Status</span><span>Playlist</span><span className="text-right">Last seen</span>
          </div>
          <div className="divide-y divide-surface-border">
            {[...linked, ...pending].map((screen) => {
              const online = isScreenOnline(screen);
              const list = playlistName(screen.playlistId);
              const isPending = Boolean(screen.pairingCode);
              return (
                <div key={screen.id} className="grid gap-2 px-4 py-3 transition-colors hover:bg-surface-hover md:grid-cols-[minmax(0,1.5fr)_minmax(7rem,0.7fr)_minmax(0,1fr)_7rem] md:items-center md:gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-label text-ink">{screen.name}</p>
                    <p className="mt-0.5 text-meta text-ink-muted md:hidden">{isPending ? `Pairing code ${screen.pairingCode}` : list ?? "No playlist assigned"}</p>
                  </div>
                  <p className={`text-meta font-semibold ${isPending ? "text-info-cobalt" : online ? "text-cleared-green" : "text-pending-amber"}`}>
                    {isPending ? "Awaiting pairing" : online ? "Online" : "Offline"}
                  </p>
                  <p className="hidden truncate text-meta text-ink-muted md:block">{list ?? "No playlist assigned"}</p>
                  <p className="text-meta text-ink-soft md:text-right">{isPending ? "—" : relativeTime(screen.lastSeen)}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Catalog, kept quiet: two cells in the same hairline language, mono counts. */}
      <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-surface-border bg-surface-card sm:grid-cols-2">
        <Link
          href="/admin/playlists"
          className="flex items-center justify-between gap-3 border-b border-surface-border px-4 py-3 transition-colors hover:bg-surface-hover sm:border-b-0 sm:border-r"
        >
          <span className="flex items-center gap-2 text-meta text-fg-muted">
            <PlaylistIcon size={14} className="text-ink-soft" aria-hidden="true" /> Playlists
          </span>
          <span className="font-mono text-label text-fg tnum">{playlistsData === undefined ? "—" : playlists.length}</span>
        </Link>
        <Link
          href="/admin/media"
          className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-surface-hover"
        >
          <span className="flex items-center gap-2 text-meta text-fg-muted">
            <MediaIcon size={14} className="text-ink-soft" aria-hidden="true" /> Library
          </span>
          <span className="font-mono text-label text-fg tnum">
            {mediaData === undefined ? "—" : mediaItems.length}
            {mediaData !== undefined && <span className="text-fg-subtle"> · {totalSizeMB} MB</span>}
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
