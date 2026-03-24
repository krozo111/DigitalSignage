"use client";

import { useEffect, useState } from "react";
import { 
  claimScreen, 
  getAllScreens, 
  updateScreenDetails, 
  deleteScreen, 
  Screen 
} from "@/lib/services/screenService";
import { getAllPlaylists, Playlist } from "@/lib/services/playlistService";

export default function ScreensPage() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State para Reclamar
  const [pairingCode, setPairingCode] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [screensData, playlistsData] = await Promise.all([
        getAllScreens(),
        getAllPlaylists()
      ]);
      setScreens(screensData);
      setPlaylists(playlistsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingCode || !newName) return;

    try {
      setClaiming(true);
      await claimScreen(pairingCode, newName, selectedPlaylistId || "");
      
      // Reset form & Refresh
      setPairingCode("");
      setNewName("");
      setSelectedPlaylistId("");
      await fetchData();
      alert("✅ Pantalla emparejada con éxito.");
    } catch (err: any) {
      alert("❌ Error al emparejar: " + err.message);
    } finally {
      setClaiming(false);
    }
  };

  const handleUpdatePlaylist = async (screenId: string, screenName: string, newPlaylistId: string) => {
    try {
      await updateScreenDetails(screenId, screenName, newPlaylistId);
      setScreens(prev => prev.map(s => s.id === screenId ? { ...s, playlistId: newPlaylistId } : s));
    } catch (err: any) {
      alert("Error actualizando pantalla: " + err.message);
    }
  };

  const handleDelete = async (screenId: string) => {
    if (!confirm("¿Seguro que deseas desvincular esta pantalla? Tendrás que volver a ingresar su código para usarla.")) return;
    
    try {
      await deleteScreen(screenId);
      // Remove or mark as deleted depending on your service logic
      // In our logic, it just unpairs the playlist and resets name. Keep it simple and refresh.
      await fetchData();
    } catch (err: any) {
      alert("Error eliminando pantalla: " + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Pantallas</h2>
        <p className="text-slate-400 mt-1">Sincroniza tus Smart TVs ingresando el código de emparejamiento.</p>
      </div>

      {/* Bloque de Emparejamiento */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
           🔗 Emparejar Nueva Pantalla
        </h3>
        <form onSubmit={handleClaim} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">Código de la TV</label>
            <input
              type="text"
              required
              minLength={6}
              maxLength={6}
              placeholder="Ej: 1A2B3C"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 uppercase tracking-widest font-mono"
            />
          </div>
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Asignado</label>
            <input
              type="text"
              required
              placeholder="Ej: Recepción Principal"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">Playlist Inicial (Opcional)</label>
            <select
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">-- Ninguna --</option>
              {playlists.map(pl => (
                <option key={pl.id} value={pl.id}>{pl.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={claiming}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-8 rounded-lg transition-colors h-[52px]"
          >
            {claiming ? "Conectando..." : "Emparejar"}
          </button>
        </form>
      </div>

      {/* Lista de Pantallas */}
      <div>
        <h3 className="text-xl font-bold mb-4">Mis Pantallas Activas</h3>
        {loading ? (
          <div className="text-center py-10 text-slate-400">Cargando pantallas...</div>
        ) : screens.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
            No tienes pantallas configuradas. Ingresa un código arriba.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {screens.map(screen => (
              <div key={screen.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-12 w-12 bg-slate-900 rounded-lg flex items-center justify-center text-2xl">
                    🖥️
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white truncate max-w-[200px]">{screen.name}</h4>
                    {/* Status Placeholder (En el futuro puedes validar lastSeen con Firestore) */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                      <span className="text-xs text-slate-400">Vinculada</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={screen.playlistId || ""}
                    onChange={(e) => handleUpdatePlaylist(screen.id, screen.name, e.target.value)}
                    className="w-full sm:w-48 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Sin Playlist</option>
                    {playlists.map(pl => (
                      <option key={pl.id} value={pl.id}>{pl.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(screen.id)}
                    className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Desvincular
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
