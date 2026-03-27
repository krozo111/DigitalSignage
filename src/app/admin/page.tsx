"use client";

import { useEffect, useState } from "react";
import { getAllScreens, Screen } from "@/lib/services/screenService";
import { getAllPlaylists, Playlist } from "@/lib/services/playlistService";
import { getAllMedia, MediaItem } from "@/lib/services/mediaService";
import Link from "next/link";

export default function AdminDashboardHome() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [screensRes, playlistsRes, mediaRes] = await Promise.all([
          getAllScreens(),
          getAllPlaylists(),
          getAllMedia(),
        ]);
        setScreens(screensRes);
        setPlaylists(playlistsRes);
        setMediaItems(mediaRes);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const onlineScreens = screens.filter(s => s.pairingCode === null).length; // Si no tiene pairing code, asumimos que está ligada (vinculada)
  const missingPlaylistScreens = screens.filter(s => !s.pairingCode && !s.playlistId).length;

  if (loading) {
    return <div className="text-center py-20 text-white/40">Loading metrics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">General Dashboard</h2>
        <p className="text-white/40 mt-1">Overview of your screen network's current state.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Métricas Pantallas */}
        <div className="bg-yugo-primary/40 p-6 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between backdrop-blur-sm">
          <div>
             <h3 className="text-white/60 text-sm font-medium">Linked Screens</h3>
             <div className="flex items-end gap-3 mt-2">
                 <span className="text-4xl font-bold text-white">{onlineScreens}</span>
                 <span className="text-white/20 mb-1">/ {screens.length} total</span>
             </div>
             {missingPlaylistScreens > 0 && (
                <p className="text-yugo-accent text-xs mt-3 flex items-center gap-1">
                   ⚠️ {missingPlaylistScreens} screen(s) without assigned playlist
                </p>
             )}
          </div>
          <Link href="/admin/screens" className="text-yugo-accent text-sm mt-6 hover:text-yugo-accent/80 font-medium">Manage Screens →</Link>
        </div>

        {/* Métricas Playlists */}
        <div className="bg-yugo-primary/40 p-6 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between backdrop-blur-sm">
          <div>
             <h3 className="text-white/60 text-sm font-medium">Playlists</h3>
             <div className="flex items-end gap-3 mt-2">
                 <span className="text-4xl font-bold text-white">{playlists.length}</span>
             </div>
          </div>
          <Link href="/admin/playlists" className="text-yugo-accent text-sm mt-6 hover:text-yugo-accent/80 font-medium">Create Playlists →</Link>
        </div>

        {/* Métricas Archivos */}
        <div className="bg-yugo-primary/40 p-6 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between backdrop-blur-sm">
          <div>
             <h3 className="text-white/60 text-sm font-medium">Files (Storage)</h3>
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
