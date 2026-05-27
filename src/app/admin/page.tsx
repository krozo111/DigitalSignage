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

  const loading = screensLoading && playlistsLoading && mediaLoading;

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
        title="General Dashboard"
        description="Overview of your screen network&apos;s current state."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Linked Screens"
          icon={ScreenIcon}
          iconTone="success"
          value={
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-fg">{linkedScreens}</span>
              <span className="text-fg-disabled mb-1">/ {screens.length} registrations</span>
            </div>
          }
          meta={
            <>
              {onlineScreens > 0 && (
                <p className="text-success text-xs flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-success" />
                  {onlineScreens} currently online
                </p>
              )}
              {missingPlaylistScreens > 0 && (
                <p className="text-accent text-xs flex items-center gap-1.5">
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
          iconTone="accent"
          value={playlists.length}
          footer={{ label: "Create Playlists", href: "/admin/playlists" }}
        />

        <StatCard
          label="Files (Storage)"
          icon={MediaIcon}
          iconTone="muted"
          value={mediaItems.length}
          meta={
            <p className="text-fg-disabled text-xs">
              Total Size: ~{totalSizeMB} MB
            </p>
          }
          footer={{ label: "Go to Library", href: "/admin/media" }}
        />
      </div>

      <div className="bg-gradient-to-r from-yugo-vibrant/20 to-surface-1 border border-border-strong p-6 rounded-xl backdrop-blur-sm">
        <h3 className="text-lg font-bold text-accent mb-2 flex items-center gap-2">
          <RocketIcon /> How to start a screen?
        </h3>
        <ol className="list-decimal list-inside text-fg-muted space-y-2 text-sm leading-relaxed">
          <li>Upload images and videos (mp4) in the <Link href="/admin/media" className="text-accent hover:underline">Media</Link> section.</li>
          <li>Group these resources by ordering them in <Link href="/admin/playlists" className="text-accent hover:underline">Playlists</Link>.</li>
          <li>Open the <b>/player</b> app on your Smart TV to see the giant random code.</li>
          <li>Enter that code in the <Link href="/admin/screens" className="text-accent hover:underline">Screens</Link> tab and associate the playlist you created. Done!</li>
        </ol>
      </div>
    </div>
  );
}
