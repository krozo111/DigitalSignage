"use client";

import { useEffect, useState } from "react";
import { getAllMedia, MediaItem } from "@/lib/services/mediaService";
import { createPlaylist, getAllPlaylists, Playlist } from "@/lib/services/playlistService";

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
      { ...media, duration: media.type === "vid" ? 15 : 10 }, // Predeterminado 10s imagenes, 15s video
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

  const handleSave = async () => {
    if (!playlistName.trim()) {
      alert("Debes poner un nombre a la playlist");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Selecciona al menos un archivo multimedia");
      return;
    }

    try {
      setSaving(true);
      
      const itemsToSave = selectedItems.map((item, index) => ({
        mediaId: item.id,
        duration: item.duration,
        order: index,
      }));

      await createPlaylist(playlistName, itemsToSave);
      
      // Cleanup & success
      setPlaylistName("");
      setSelectedItems([]);
      setView("list");
      alert("Playlist guardada con éxito.");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Playlists</h2>
          <p className="text-slate-400 mt-1">
            {view === "list" ? "Gestiona tus listas creadas." : "Constructor Visual"}
          </p>
        </div>
        <button
          onClick={() => setView(view === "list" ? "create" : "list")}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg border-none"
        >
          {view === "list" ? "+ Nueva Playlist" : "Volver a Mis Playlists"}
        </button>
      </div>

      {view === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
              No tienes listas creadas aún.
            </div>
          ) : (
            playlists.map((pl) => (
              <div key={pl.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white truncate">{pl.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{pl.items.length} recursos asignados</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Col 1: Biblioteca (Pickers) */}
          <div className="w-full lg:w-1/2 bg-slate-800 p-4 border border-slate-700 rounded-xl flex flex-col h-[600px]">
            <h3 className="text-lg font-bold mb-4">Librería</h3>
            <div className="overflow-y-auto flex-1 pr-2 grid grid-cols-2 gap-3 pb-4">
               {mediaList.length === 0 ? (
                  <p className="col-span-2 text-slate-500 text-sm">No hay contenido en Media Library.</p>
               ) : (
                  mediaList.map((media) => (
                    <div 
                      key={media.id} 
                      onClick={() => addItem(media)}
                      className="cursor-pointer group relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-all aspect-video"
                    >
                      {media.type === "vid" ? (
                        <video src={media.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-bold text-sm">+ Añadir</span>
                      </div>
                    </div>
                  ))
               )}
            </div>
          </div>

          {/* Col 2: Constructor (Builder) */}
          <div className="w-full lg:w-1/2 bg-slate-800 p-6 border border-slate-700 rounded-xl flex flex-col min-h-[600px]">
            <input
              type="text"
              placeholder="Nombre de la Playlist (ej: Pantalla Principal Local 1)"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 shadow-inner bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
              {selectedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 mt-20">
                  <span className="text-4xl mb-3">🫙</span>
                  <p>La playlist está vacía.</p>
                  <p className="text-sm">Toca un elemento de la izquierda para añadirlo.</p>
                </div>
              ) : (
                selectedItems.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center gap-3 bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-sm">
                    {/* Controles de orden */}
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => moveItem(idx, "up")}
                        disabled={idx === 0} 
                        className="text-slate-500 hover:text-white disabled:opacity-30 p-1"
                      >▲</button>
                      <button 
                        onClick={() => moveItem(idx, "down")} 
                        disabled={idx === selectedItems.length - 1}
                        className="text-slate-500 hover:text-white disabled:opacity-30 p-1"
                      >▼</button>
                    </div>

                    <div className="h-16 w-16 bg-slate-900 rounded-md overflow-hidden flex-shrink-0">
                      {item.type === "vid" ? (
                        <video src={item.url} className="h-full w-full object-cover" />
                      ) : (
                        <img src={item.url} className="h-full w-full object-cover" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                       <div className="flex items-center gap-2 mt-2">
                         <label className="text-xs text-slate-400">Duración (seg):</label>
                         <input 
                            type="number" 
                            min="1"
                            value={item.duration}
                            onChange={(e) => updateDuration(idx, parseInt(e.target.value) || 1)}
                            className="w-20 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white"
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
               className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              {saving ? "Guardando..." : "💾 Guardar Playlist"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
