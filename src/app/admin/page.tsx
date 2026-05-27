"use client";

import { getAllScreens, Screen } from "@/lib/services/screenService";
import { getAllPlaylists, Playlist } from "@/lib/services/playlistService";
import { getAllMedia, MediaItem } from "@/lib/services/mediaService";
import Link from "next/link";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatCard } from "@/components/ui/StatCard";
import { ScreenIcon, PlaylistIcon, MediaIcon, RocketIcon, AlertIcon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { useCachedQuery, CacheKeys } from "@/lib/cache";
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

  const linkedScreens = screens.filter(s => s.pairingCode === null).length;
  const onlineScreens = screens.filter(s => s.status === "online").length;
  const missingPlaylistScreens = screens.filter(s => s.pairingCode === null && !s.playlistId).length;
  const totalSizeMB = (mediaItems.reduce((acc, m) => acc + m.size, 0) / 1024 / 1024).toFixed(1);

  if (loading) {
    return <LoadingSkeleton variant="grid" count={3} />;
  }

  return (
    <div className="space-y-8 relative isolate">
      <div
        aria-hidden="true"
        className="absolute -inset-x-4 md:-inset-x-8 -inset-y-4 md:-inset-y-8 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage: "url(/yugobuilding.jpg)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.2) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      <PageHeader
        title="Dashboard"
        description="A snapshot of your screen network: what's online, what needs a playlist, what's in the library."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Linked Screens"
          icon={ScreenIcon}
          iconTone="success"
          value={
            <div className="flex items-baseline gap-2.5">
              <span className="text-stat text-fg">{linkedScreens}</span>
              <span className="text-meta text-fg-subtle tnum">/ {screens.length} registered</span>
            </div>
          }
          meta={
            <>
              {onlineScreens > 0 && (
                <p className="text-meta text-success flex items-center gap-1.5 tnum">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-success" />
                  {onlineScreens} currently online
                </p>
              )}
              {missingPlaylistScreens > 0 && (
                <p className="text-meta text-warning flex items-center gap-1.5 tnum">
                  <AlertIcon size={14} /> {missingPlaylistScreens} without assigned playlist
                </p>
              )}
            </>
          }
          footer={{ label: "Manage Screens", href: "/admin/screens" }}
        />

        <StatCard
          label="Playlists"
          icon={PlaylistIcon}
          iconTone="info"
          value={playlists.length}
          footer={{ label: "Create Playlists", href: "/admin/playlists" }}
        />

        <StatCard
          label="Files (Storage)"
          icon={MediaIcon}
          iconTone="muted"
          value={mediaItems.length}
          meta={
            <p className="text-meta text-fg-subtle tnum">
              Total Size: ~{totalSizeMB} MB
            </p>
          }
          footer={{ label: "Go to Library", href: "/admin/media" }}
        />
      </div>

      <section
        aria-labelledby="how-to-start"
        className="border border-border rounded-xl bg-surface-1 px-6 py-6 shadow-[0_1px_0_oklch(1_0_0/0.04)_inset]"
      >
        <div className="flex items-center gap-2 mb-4">
          <RocketIcon size={16} className="text-fg-subtle" />
          <h2 id="how-to-start" className="text-eyebrow text-fg-muted">
            How to start a screen
          </h2>
        </div>
        <ol className="text-fg-muted text-label leading-relaxed max-w-[68ch] space-y-2 list-decimal list-inside marker:text-fg-subtle marker:font-medium">
          <li>Upload images and videos in the <Link href="/admin/media" className="text-accent hover:text-accent-strong underline-offset-2 hover:underline">Media</Link> section.</li>
          <li>Group them into <Link href="/admin/playlists" className="text-accent hover:text-accent-strong underline-offset-2 hover:underline">Playlists</Link> in the order you want them to play.</li>
          <li>Open <code className="text-fg font-mono text-[0.875em] bg-fg/[0.06] px-1.5 py-0.5 rounded">/player</code> on the Smart TV. A pairing code appears.</li>
          <li>Enter the code in <Link href="/admin/screens" className="text-accent hover:text-accent-strong underline-offset-2 hover:underline">Screens</Link> and assign a playlist.</li>
        </ol>
      </section>
    </div>
  );
}
