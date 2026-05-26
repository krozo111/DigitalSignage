"use client";

import { useEffect, useState, useMemo } from "react";
import { errorMessage } from "@/lib/errors";
import {
  claimScreen,
  getAllScreens,
  updateScreenDetails,
  deleteScreen,
  purgeStaleScreens,
  Screen
} from "@/lib/services/screenService";
import { getAllPlaylists, Playlist } from "@/lib/services/playlistService";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/PageHeader";

const STALE_THRESHOLD_MS = 5 * 60 * 1000;

function screenStatus(screen: Screen): { label: string; color: string; dot: string } {
  if (screen.pairingCode) return { label: "Unpaired", color: "text-yellow-400", dot: "bg-yellow-400" };

  const now = Date.now();
  const lastSeen = screen.lastSeen;
  if (!lastSeen) return { label: "Unknown", color: "text-white/40", dot: "bg-white/20" };

  const lastSeenMs = lastSeen.toMillis();
  const diff = now - lastSeenMs;

  if (diff < STALE_THRESHOLD_MS) return { label: "Online", color: "text-yugo-secondary", dot: "bg-yugo-secondary" };
  return { label: "Offline", color: "text-white/40", dot: "bg-white/20" };
}

export default function ScreensPage() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [pairingCode, setPairingCode] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [nameError, setNameError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [purgeOpen, setPurgeOpen] = useState(false);

  const filteredScreens = useMemo(() => {
    if (!searchQuery.trim()) return screens;
    const q = searchQuery.toLowerCase();
    return screens.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.pairingCode && s.pairingCode.toLowerCase().includes(q))
    );
  }, [screens, searchQuery]);

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

    if (pairingCode.length !== 6) {
      setCodeError("Code must be exactly 6 characters");
      return;
    }
    if (!newName.trim()) {
      setNameError("Screen name is required");
      return;
    }

    try {
      setClaiming(true);
      await claimScreen(pairingCode, newName, selectedPlaylistId || null);

      setPairingCode("");
      setNewName("");
      setSelectedPlaylistId("");
      setCodeError("");
      setNameError("");
      await fetchData();
      toast.success("Screen paired successfully");
    } catch (err) {
      toast.error("Pairing error: " + errorMessage(err));
    } finally {
      setClaiming(false);
    }
  };

  const handleUpdatePlaylist = async (screenId: string, screenName: string, newPlaylistId: string) => {
    try {
      await updateScreenDetails(screenId, screenName, newPlaylistId);
      setScreens(prev => prev.map(s => s.id === screenId ? { ...s, playlistId: newPlaylistId } : s));
      toast.success("Playlist updated");
    } catch (err) {
      toast.error("Error updating screen: " + errorMessage(err));
    }
  };

  const handleDelete = (screenId: string) => {
    setDeleteTarget(screenId);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteScreen(deleteTarget);
      setScreens(prev => prev.filter(s => s.id !== deleteTarget));
      toast.success("Screen deleted");
    } catch (err) {
      toast.error("Error deleting screen: " + errorMessage(err));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handlePurge = () => {
    setPurgeOpen(true);
  };

  const confirmPurge = async () => {
    try {
      setLoading(true);
      const count = await purgeStaleScreens();
      await fetchData();
      toast.success(`Purged ${count} stale screen(s)`);
    } catch (err) {
      toast.error("Error purging: " + errorMessage(err));
    } finally {
      setLoading(false);
      setPurgeOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Screen Management"
        description="Sync your Smart TVs by entering the pairing code."
      />

      <div className="bg-yugo-primary/40 p-6 rounded-xl border border-white/5 shadow-sm backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
           <span className="text-yugo-accent">🔗</span> Pair New Screen
        </h3>
        <form onSubmit={handleClaim} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <Input
              label="TV Code"
              required
              minLength={6}
              maxLength={6}
              placeholder="Ex: 1A2B3C"
              value={pairingCode}
              onChange={(e) => {
                setPairingCode(e.target.value.toUpperCase());
                if (e.target.value.length === 6) setCodeError("");
              }}
              error={codeError}
              className="uppercase tracking-widest font-mono"
            />
          </div>
          <div className="w-full md:w-auto flex-1">
            <Input
              label="Assigned Name"
              required
              placeholder="Ex: Main Reception"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              error={nameError}
            />
          </div>
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-medium text-white/70 mb-2">Initial Playlist</label>
            <select
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              className="w-full bg-yugo-primary/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yugo-accent appearance-none"
              aria-label="Select initial playlist"
            >
              <option value="">-- None --</option>
              {playlists.map(pl => (
                <option key={pl.id} value={pl.id}>{pl.name}</option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={claiming} loading={claiming} className="w-full md:w-auto">
            {claiming ? "Connecting..." : "Pair"}
          </Button>
        </form>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold">My Active Screens</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {screens.length > 0 && (
              <Input
                placeholder="Search screens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56"
                aria-label="Search screens"
              />
            )}
            <Button variant="ghost" onClick={handlePurge}>
              Purge Stale Screens
            </Button>
          </div>
        </div>
        {loading ? (
          <LoadingSkeleton variant="card" count={4} />
        ) : filteredScreens.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-xl text-white/20">
            {searchQuery ? "No screens match your search." : "You have no configured screens. Enter a code above."}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredScreens.map(screen => {
              const status = screenStatus(screen);
              return (
              <div key={screen.id} className="bg-yugo-primary/40 p-5 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm shadow-sm group">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-12 w-12 bg-yugo-primary/60 border border-white/5 rounded-lg flex items-center justify-center text-2xl group-hover:bg-yugo-accent/10 transition-colors">
                    🖥️
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white truncate max-w-[200px]">{screen.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={`w-2 h-2 rounded-full ${status.dot} shadow-[0_0_8px_rgba(80,203,173,0.8)]`} />
                      <span className={`text-xs ${status.color}`}>{status.label}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={screen.playlistId || ""}
                    onChange={(e) => handleUpdatePlaylist(screen.id, screen.name, e.target.value)}
                    className="w-full sm:w-48 bg-yugo-primary/60 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-yugo-accent appearance-none"
                    aria-label={`Assign playlist for ${screen.name}`}
                  >
                    <option value="">No Playlist</option>
                    {playlists.map(pl => (
                      <option key={pl.id} value={pl.id}>{pl.name}</option>
                    ))}
                  </select>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(screen.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Screen"
        message="Are you sure you want to permanently delete this screen? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={purgeOpen}
        title="Purge Stale Screens"
        message={'This will permanently delete all screens that are still named "New TV" or haven\'t been seen in 24+ hours. Continue?'}
        confirmText="Purge"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmPurge}
        onCancel={() => setPurgeOpen(false)}
      />
    </div>
  );
}
