"use client";

import { useEffect, useState } from "react";
import { getAllMedia, MediaItem } from "@/lib/services/mediaService";
import { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist, Playlist } from "@/lib/services/playlistService";

interface BuiltItem extends MediaItem {
  duration: number;
}

export default function PlaylistsConstructorPage() {
  // Data
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "create">("list");
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  
  // Form State
  const [playlistName, setPlaylistName] = useState("");
  const [selectedItems, setSelectedItems] = useState<BuiltItem[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, [view]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [mediaRes, playlistsRes] = await Promise.all([
        getAllMedia(), 
        getAllPlaylists()
      ]);
      setMediaList(mediaRes);
      setPlaylists(playlistsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (media: MediaItem) => {
    setSelectedItems((prev) => [
      ...prev,
      { ...media, duration: media.type === "vid" ? 15 : 10 }, // Default 10s images, 15s video
    ]);
  };

  const removeItem = (indexToRemove: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const updateDuration = (index: number, newDuration: number) => {
    setSelectedItems((prev) => {
      const copy = [...prev];
      copy[index].duration = newDuration;
      return copy;
    });
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === selectedItems.length - 1) return;
    
    const newItems = [...selectedItems];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    
    setSelectedItems(newItems);
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    const builtItems: BuiltItem[] = playlist.items.map(item => {
      const mediaInfo = mediaList.find(m => m.id === item.mediaId);
      if (mediaInfo) {
        return { ...mediaInfo, duration: item.duration };
      }
      return { 
        id: item.mediaId, 
        name: "File not found", 
        url: "", 
        type: "img",
        size: 0,
        storagePath: "",
        createdAt: null, 
        duration: item.duration 
      };
    });

    setPlaylistName(playlist.name);
    setSelectedItems(builtItems);
    setEditingPlaylistId(playlist.id);
    setView("create");
  };

  const handleDeletePlaylist = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the playlist "${name}"?`)) {
      try {
        setLoading(true);
        await deletePlaylist(id);
        await fetchInitialData();
      } catch (err: any) {
        alert("Error deleting: " + err.message);
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!playlistName.trim()) {
      alert("You must name the playlist");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Select at least one media file");
      return;
    }

    try {
      setSaving(true);
      
      const itemsToSave = selectedItems.map((item, index) => ({
        mediaId: item.id,
        duration: item.duration,
        order: index,
      }));

      if (editingPlaylistId) {
        await updatePlaylist(editingPlaylistId, playlistName, itemsToSave);
      } else {
        await createPlaylist(playlistName, itemsToSave);
      }
      
      // Cleanup & success
      setPlaylistName("");
      setSelectedItems([]);
      setEditingPlaylistId(null);
      setView("list");
      alert(editingPlaylistId ? "Playlist updated successfully." : "Playlist saved successfully.");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Playlists</h2>
          <p className="text-white/40 mt-1">
            {view === "list" ? "Manage your created lists." : editingPlaylistId ? "Edit Playlist" : "Visual Builder"}
          </p>
        </div>
        <button
          onClick={() => {
            setView(view === "list" ? "create" : "list");
            if (view === "create") {
              setPlaylistName("");
              setSelectedItems([]);
              setEditingPlaylistId(null);
            }
          }}
          className="w-full md:w-auto bg-yugo-accent hover:bg-yugo-accent/90 text-yugo-primary px-6 py-2.5 rounded-lg border-none cursor-pointer font-bold transition-colors"
        >
          {view === "list" ? "+ New Playlist" : "Back to My Playlists"}
        </button>
      </div>

      {view === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.length === 0 ? (
            <div className="col-span-full py-20 text-center text-white/20 border border-dashed border-white/10 rounded-xl">
              You don't have any lists created yet.
            </div>
          ) : (
            playlists.map((pl) => (
              <div key={pl.id} className="bg-yugo-primary/40 p-5 rounded-xl border border-white/5 flex flex-col justify-between backdrop-blur-sm shadow-sm group">
                <div>
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-yugo-accent transition-colors">{pl.name}</h3>
                  <p className="text-sm text-white/40 mt-1">{pl.items.length} resources assigned</p>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => handleEditPlaylist(pl)}
                    className="px-3 py-1.5 bg-yugo-accent/10 border border-yugo-accent/20 text-yugo-accent hover:bg-yugo-accent hover:text-yugo-primary rounded-lg text-sm font-bold transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePlaylist(pl.id, pl.name)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors border-none cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Col 1: Biblioteca (Pickers) */}
          <div className="w-full lg:w-1/2 bg-yugo-primary/40 p-4 border border-white/5 rounded-xl flex flex-col h-[600px] backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4 text-white">Library</h3>
            <div className="overflow-y-auto flex-1 pr-2 grid grid-cols-2 gap-3 pb-4">
               {mediaList.length === 0 ? (
                  <p className="col-span-2 text-white/20 text-sm">No content in Media Library.</p>
               ) : (
                  mediaList.map((media) => (
                    <div 
                      key={media.id} 
                      onClick={() => addItem(media)}
                      className="cursor-pointer group relative bg-yugo-primary/60 rounded-lg overflow-hidden border border-white/5 hover:border-yugo-accent transition-all aspect-video shadow-md"
                    >
                      {media.type === "vid" ? (
                        <video src={media.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-yugo-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-yugo-accent font-bold text-sm">+ Add</span>
                      </div>
                    </div>
                  ))
               )}
            </div>
          </div>

          {/* Col 2: Constructor (Builder) */}
          <div className="w-full lg:w-1/2 bg-yugo-primary/40 p-6 border border-white/5 rounded-xl flex flex-col min-h-[600px] backdrop-blur-sm">
            <input
              type="text"
              placeholder="Playlist Name (ex: Local Main Screen 1)"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full bg-yugo-primary/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yugo-accent mb-6 placeholder-white/20"
            />

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 shadow-inner bg-yugo-primary/20 p-3 rounded-lg border border-white/5">
              {selectedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20 mt-20">
                  <span className="text-4xl mb-3">🫙</span>
                  <p>The playlist is empty.</p>
                  <p className="text-sm">Tap an element on the left to add it.</p>
                </div>
              ) : (
                selectedItems.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center gap-3 bg-yugo-primary/40 border border-white/5 p-3 rounded-lg shadow-sm">
                    {/* Controles de orden */}
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => moveItem(idx, "up")}
                        disabled={idx === 0} 
                        className="text-white/40 hover:text-yugo-accent disabled:opacity-10 p-1 transition-colors"
                      >▲</button>
                      <button 
                        onClick={() => moveItem(idx, "down")} 
                        disabled={idx === selectedItems.length - 1}
                        className="text-white/40 hover:text-yugo-accent disabled:opacity-10 p-1 transition-colors"
                      >▼</button>
                    </div>

                    <div className="h-16 w-16 bg-yugo-primary/60 rounded-md overflow-hidden flex-shrink-0">
                      {item.type === "vid" ? (
                        <video src={item.url} className="h-full w-full object-cover" />
                      ) : (
                        <img src={item.url} className="h-full w-full object-cover" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium text-white truncate">{item.name}</p>
                       <div className="flex items-center gap-2 mt-2">
                         <label className="text-xs text-white/40">Duration (sec):</label>
                         <input 
                            type="number" 
                            min="1"
                            value={item.duration}
                            onChange={(e) => updateDuration(idx, parseInt(e.target.value) || 1)}
                            className="w-20 bg-yugo-primary/60 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yugo-accent"
                         />
                       </div>
                    </div>
                    
                    <button 
                       onClick={() => removeItem(idx)}
                       className="text-red-400 hover:text-red-300 p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
               disabled={saving || selectedItems.length === 0 || !playlistName}
               onClick={handleSave}
               className="mt-6 w-full bg-yugo-secondary hover:bg-yugo-secondary/90 disabled:opacity-50 text-yugo-primary font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all shadow-lg cursor-pointer border-none"
            >
              {saving ? "Saving..." : editingPlaylistId ? "💾 Update Playlist" : "💾 Save Playlist"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
