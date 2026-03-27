"use client";

import { useEffect, useState, useRef } from "react";
import { uploadMedia, getAllMedia, deleteMedia, MediaItem } from "@/lib/services/mediaService";

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await getAllMedia();
      setMediaList(data);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);
      
      await uploadMedia(file, (prog) => {
        setProgress(Math.round(prog));
      });

      // Reload list
      await fetchMedia();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      alert("File uploaded successfully");
    } catch (error: any) {
      alert(error.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm("Are you sure you want to delete this file? This cannot be undone.")) return;
    
    try {
      await deleteMedia(id, storagePath);
      // Remove from UI without fetching everything again
      setMediaList(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      alert("Error deleting: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Media Library</h2>
          <p className="text-white/40 mt-1">Image and video management (Max 50MB per file).</p>
        </div>

        <div className="w-full md:w-auto">
          <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleUpload} 
             className="hidden" 
             accept="image/*,video/*"
          />
          <button 
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full md:w-auto bg-yugo-accent hover:bg-yugo-accent/90 disabled:opacity-50 text-yugo-primary px-6 py-2.5 rounded-lg shadow-sm transition-all font-bold flex items-center justify-center gap-2"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-yugo-primary"></span>
                Uploading...
              </span>
            ) : (
               "Upload File 📤"
            )}
          </button>
        </div>
      </div>

      {uploading && (
        <div className="w-full bg-yugo-primary/60 border border-white/5 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-yugo-accent h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-white/40 font-medium">Loading media...</div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-xl text-white/40">
          <p className="mb-2">The library is empty.</p>
          <p className="text-sm">Upload photos or videos to start creating playlists.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaList.map((item) => (
            <div key={item.id} className="bg-yugo-primary/40 rounded-xl overflow-hidden border border-white/5 shadow-sm group backdrop-blur-sm">
              <div className="aspect-square bg-yugo-primary/60 relative">
                {item.type === "vid" ? (
                  <video 
                     src={item.url} 
                     className="w-full h-full object-cover" 
                     muted 
                     onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                     onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                ) : (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-yugo-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                      onClick={() => handleDelete(item.id, item.storagePath)}
                      className="bg-red-600/90 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                      title="Delete file"
                   >
                     🗑️
                   </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{item.name}</p>
                <p className="text-xs text-white/40 mt-1 flex justify-between uppercase font-bold tracking-wider">
                  <span>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
                  <span>{item.type}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
