"use client";

import { getAllScreens, Screen } from "@/lib/services/screenService";
import { getAllPlaylists, Playlist } from "@/lib/services/playlistService";
import { getAllMedia, MediaItem } from "@/lib/services/mediaService";
import Link from "next/link";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ScreenIcon } from "@/components/icons/ScreenIcon";
import { PlaylistIcon } from "@/components/icons/PlaylistIcon";
import { MediaIcon } from "@/components/icons/MediaIcon";
import { PageHeader } from "@/components/PageHeader";
import { useCachedQuery, CacheKeys } from "@/lib/cache";

export default function AdminDashboardHome() {
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

  if (loading) {
    return <LoadingSkeleton variant="grid" count={3} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="General Dashboard"
        description="Overview of your screen network&apos;s current state."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Métricas Pantallas */}
        <div className="bg-yugo-primary/40 p-6 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between backdrop-blur-sm">
          <div>
             <h3 className="text-white/60 text-sm font-medium flex items-center gap-2">
               <ScreenIcon className="text-yugo-secondary" /> Linked Screens
             </h3>
             <div className="flex items-end gap-3 mt-2">
                 <span className="text-4xl font-bold text-white">{linkedScreens}</span>
                  <span className="text-white/20 mb-1">/ {screens.length} registrations</span>
             </div>
             {onlineScreens > 0 && (
               <p className="text-yugo-secondary text-xs mt-2 flex items-center gap-1">
                 <span className="inline-block w-1.5 h-1.5 rounded-full bg-yugo-secondary" />
                 {onlineScreens} currently online
               </p>
             )}
             {missingPlaylistScreens > 0 && (
                <p className="text-yugo-accent text-xs mt-1 flex items-center gap-1">
                   ⚠️ {missingPlaylistScreens} without assigned playlist
                </p>
             )}
          </div>
          <Link href="/admin/screens" className="text-yugo-accent text-sm mt-6 hover:text-yugo-accent/80 font-medium">Manage Screens →</Link>
        </div>

        {/* Métricas Playlists */}
        <div className="bg-yugo-primary/40 p-6 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between backdrop-blur-sm">
          <div>
             <h3 className="text-white/60 text-sm font-medium flex items-center gap-2">
               <PlaylistIcon className="text-yugo-accent" /> Playlists
             </h3>
             <div className="flex items-end gap-3 mt-2">
                 <span className="text-4xl font-bold text-white">{playlists.length}</span>
             </div>
          </div>
          <Link href="/admin/playlists" className="text-yugo-accent text-sm mt-6 hover:text-yugo-accent/80 font-medium">Create Playlists →</Link>
        </div>

        {/* Métricas Archivos */}
        <div className="bg-yugo-primary/40 p-6 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between backdrop-blur-sm">
          <div>
             <h3 className="text-white/60 text-sm font-medium flex items-center gap-2">
               <MediaIcon className="text-yugo-vibrant" /> Files (Storage)
             </h3>
             <div className="flex items-end gap-3 mt-2">
                 <span className="text-4xl font-bold text-white">{mediaItems.length}</span>
             </div>
             <p className="text-white/20 text-xs mt-3">
               Total Size: ~{(mediaItems.reduce((acc, crr) => acc + crr.size, 0) / 1024 / 1024).toFixed(1)} MB
             </p>
          </div>
          <Link href="/admin/media" className="text-yugo-accent text-sm mt-6 hover:text-yugo-accent/80 font-medium">Go to Library →</Link>
        </div>
      </div>
      
      {/* Guía Rápida */}
      <div className="bg-gradient-to-r from-yugo-vibrant/20 to-yugo-primary/40 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
        <h3 className="text-lg font-bold text-yugo-accent mb-2">🚀 How to start a screen?</h3>
        <ol className="list-decimal list-inside text-white/70 space-y-2 text-sm leading-relaxed">
           <li>Upload images and videos (mp4) in the <Link href="/admin/media" className="text-yugo-accent hover:underline">Media</Link> section.</li>
           <li>Group these resources by ordering them in <Link href="/admin/playlists" className="text-yugo-accent hover:underline">Playlists</Link>.</li>
           <li>Open the <b>/player</b> app on your Smart TV to see the giant random code.</li>
           <li>Enter that code in the <Link href="/admin/screens" className="text-yugo-accent hover:underline">Screens</Link> tab and associate the playlist you created. Done!</li>
        </ol>
      </div>
    </div>
  );
}
