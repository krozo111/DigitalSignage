"use client";

import { useEffect, useState } from "react";
import { 
  claimScreen, 
  getAllScreens, 
  updateScreenDetails, 
  deleteScreen,
  purgeStaleScreens,
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
      alert("✅ Screen paired successfully.");
    } catch (err: any) {
      alert("❌ Pairing error: " + err.message);
    } finally {
      setClaiming(false);
    }
  };

  const handleUpdatePlaylist = async (screenId: string, screenName: string, newPlaylistId: string) => {
    try {
      await updateScreenDetails(screenId, screenName, newPlaylistId);
      setScreens(prev => prev.map(s => s.id === screenId ? { ...s, playlistId: newPlaylistId } : s));
    } catch (err: any) {
      alert("Error updating screen: " + err.message);
    }
  };

  const handleDelete = async (screenId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY DELETE this screen? This cannot be undone.")) return;
    
    try {
      await deleteScreen(screenId);
      setScreens(prev => prev.filter(s => s.id !== screenId));
    } catch (err: any) {
      alert("Error deleting screen: " + err.message);
    }
  };

  const handlePurge = async () => {
    if (!confirm("This will permanently delete all screens that:\n• Are still named \"New TV\"\n• Haven't been seen in 24+ hours\n\nContinue?")) return;
    
    try {
      setLoading(true);
      const count = await purgeStaleScreens();
      await fetchData();
      alert(`✅ Purged ${count} stale screen(s).`);
    } catch (err: any) {
      alert("Error purging: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Screen Management</h2>
        <p className="text-white/40 mt-1">Sync your Smart TVs by entering the pairing code.</p>
      </div>

      {/* Bloque de Emparejamiento */}
      <div className="bg-yugo-primary/40 p-6 rounded-xl border border-white/5 shadow-sm backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
           <span className="text-yugo-accent">🔗</span> Pair New Screen
        </h3>
        <form onSubmit={handleClaim} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-medium text-white/70 mb-2">TV Code</label>
            <input
              type="text"
              required
              minLength={6}
              maxLength={6}
              placeholder="Ex: 1A2B3C"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
              className="w-full bg-yugo-primary/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yugo-accent uppercase tracking-widest font-mono placeholder-white/20"
            />
          </div>
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-medium text-white/70 mb-2">Assigned Name</label>
            <input
              type="text"
              required
              placeholder="Ex: Main Reception"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-yugo-primary/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yugo-accent placeholder-white/20"
            />
          </div>
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-medium text-white/70 mb-2">Initial Playlist (Optional)</label>
            <select
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              className="w-full bg-yugo-primary/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yugo-accent appearance-none"
            >
              <option value="">-- None --</option>
              {playlists.map(pl => (
                <option key={pl.id} value={pl.id}>{pl.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={claiming}
            className="w-full md:w-auto bg-yugo-accent hover:bg-yugo-accent/90 disabled:opacity-50 text-yugo-primary font-bold py-3 px-8 rounded-lg transition-all h-[52px]"
          >
            {claiming ? "Connecting..." : "Pair"}
          </button>
        </form>
      </div>

      {/* Lista de Pantallas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">My Active Screens</h3>
          <button
            onClick={handlePurge}
            className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🧹 Purge Stale Screens
          </button>
        </div>
        {loading ? (
          <div className="text-center py-10 text-white/40">Loading screens...</div>
        ) : screens.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-xl text-white/20">
            You have no configured screens. Enter a code above.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {screens.map(screen => (
              <div key={screen.id} className="bg-yugo-primary/40 p-5 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm shadow-sm group">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-12 w-12 bg-yugo-primary/60 border border-white/5 rounded-lg flex items-center justify-center text-2xl group-hover:bg-yugo-accent/10 transition-colors">
                    🖥️
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white truncate max-w-[200px]">{screen.name}</h4>
                    {/* Status Placeholder (En el futuro puedes validar lastSeen con Firestore) */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full bg-yugo-secondary shadow-[0_0_8px_rgba(80,203,173,0.8)]"></div>
                      <span className="text-xs text-white/40">Linked</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={screen.playlistId || ""}
                    onChange={(e) => handleUpdatePlaylist(screen.id, screen.name, e.target.value)}
                    className="w-full sm:w-48 bg-yugo-primary/60 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-yugo-accent appearance-none"
                  >
                    <option value="">No Playlist</option>
                    {playlists.map(pl => (
                      <option key={pl.id} value={pl.id}>{pl.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(screen.id)}
                    className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Delete
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
