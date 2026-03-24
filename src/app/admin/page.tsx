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
    return <div className="text-center py-20 text-slate-400">Cargando métricas...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard General</h2>
        <p className="text-slate-400 mt-1">Resumen del estado actual de tu red de pantallas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Métricas Pantallas */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
             <h3 className="text-slate-400 text-sm font-medium">Pantallas Vinculadas</h3>
             <div className="flex items-end gap-3 mt-2">
                 <span className="text-4xl font-bold text-white">{onlineScreens}</span>
                 <span className="text-slate-500 mb-1">/ {screens.length} total</span>
             </div>
             {missingPlaylistScreens > 0 && (
                <p className="text-yellow-400 text-xs mt-3 flex items-center gap-1">
                   ⚠️ {missingPlaylistScreens} pantalla(s) sin lista asignada
                </p>
             )}
          </div>
          <Link href="/admin/screens" className="text-blue-400 text-sm mt-6 hover:text-blue-300">Administrar Pantallas →</Link>
        </div>

        {/* Métricas Playlists */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
             <h3 className="text-slate-400 text-sm font-medium">Listas de Reproducción</h3>
             <div className="flex items-end gap-3 mt-2">
                 <span className="text-4xl font-bold text-white">{playlists.length}</span>
             </div>
          </div>
          <Link href="/admin/playlists" className="text-blue-400 text-sm mt-6 hover:text-blue-300">Crear Listas →</Link>
        </div>

        {/* Métricas Archivos */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
             <h3 className="text-slate-400 text-sm font-medium">Archivos (Storage)</h3>
             <div className="flex items-end gap-3 mt-2">
                 <span className="text-4xl font-bold text-white">{mediaItems.length}</span>
             </div>
             <p className="text-slate-500 text-xs mt-3">
               Peso Total: ~{(mediaItems.reduce((acc, crr) => acc + crr.size, 0) / 1024 / 1024).toFixed(1)} MB
             </p>
          </div>
          <Link href="/admin/media" className="text-blue-400 text-sm mt-6 hover:text-blue-300">Ir a Biblioteca →</Link>
        </div>
      </div>
      
      {/* Guía Rápida */}
      <div className="bg-gradient-to-r from-blue-900/50 to-slate-900 border border-blue-800/50 p-6 rounded-xl">
        <h3 className="text-lg font-bold text-blue-200 mb-2">🚀 ¿Cómo arrancar una pantalla?</h3>
        <ol className="list-decimal list-inside text-slate-300 space-y-2 text-sm leading-relaxed">
           <li>Sube imágenes y videos (mp4) en la sección <Link href="/admin/media" className="text-blue-400 hover:underline">Media Library</Link>.</li>
           <li>Agrupa esos recursos ordenándolos en <Link href="/admin/playlists" className="text-blue-400 hover:underline">Playlists</Link>.</li>
           <li>Abre la aplicación <b>/player</b> en tu Smart TV para ver el código aleatorio gigante.</li>
           <li>Inserta ese código en la pestaña de <Link href="/admin/screens" className="text-blue-400 hover:underline">Screens</Link> y asóciale la playlist que creaste. ¡Listo!</li>
        </ol>
      </div>
    </div>
  );
}
