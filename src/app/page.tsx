"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase.config";
import { doc, collection, addDoc, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import { PlaybackItem, useSignageLoop } from "@/hooks/useSignageLoop";
import { useRouter } from "next/navigation";

function generatePairingCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function Home() {
  const router = useRouter();
  const [screenId, setScreenId] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<PlaybackItem[]>([]);
  
  const [loadingMsg, setLoadingMsg] = useState("Inicializando TV...");
  const [networkError, setNetworkError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keyboard shortcut to enter Admin Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + A or Cmd + A might conflict with Select All, let's use Ctrl + Shift + A
      if (e.key.toLowerCase() === 'a' && e.ctrlKey && e.shiftKey) {
        router.push('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // 1. Setup inicial de la pantalla (Emparejamiento o Recuperación)
  useEffect(() => {
    const initializePlayer = async () => {
      let storedScreenId = localStorage.getItem("dsf_screen_id");

      if (!storedScreenId) {
        setLoadingMsg("Generando nueva identidad...");
        const newCode = generatePairingCode();
        try {
           const docRef = await addDoc(collection(db, "screens"), {
            pairingCode: newCode,
            name: "Nueva TV",
            playlistId: null,
            status: "online",
            lastSeen: new Date(),
          });
          
          storedScreenId = docRef.id;
          localStorage.setItem("dsf_screen_id", storedScreenId);
          setScreenId(storedScreenId);
          setPairingCode(newCode);
        } catch (err) {
          console.error("No se pudo iniciar offline mode de primera vez", err);
          fallbackToOfflineCache();
        }
      } else {
        setScreenId(storedScreenId);
        fallbackToOfflineCache(); // En caso de que se demore o falle Firebase
      }
    };

    initializePlayer();
  }, []);

  // 2. Escucha activa de comandos del Admin (Firebase WebSocket)
  useEffect(() => {
    if (!screenId) return;

    const screenRef = doc(db, "screens", screenId);
    
    const unsubscribe = onSnapshot(screenRef, 
      (docSnap) => {
        setNetworkError(false);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.pairingCode) {
            setPairingCode(data.pairingCode);
          } else {
            setPairingCode(null);
          }
          
          if (data.playlistId !== playlistId) {
            setPlaylistId(data.playlistId);
          }
          
          try {
             setDoc(screenRef, { lastSeen: new Date(), status: "online" }, { merge: true });
          } catch(e) {}
        }
      },
      (error) => {
        console.error("Error del Listener (Probablemente offline)", error);
        setNetworkError(true);
      }
    );

    return () => unsubscribe();
  }, [screenId, playlistId]);

  // 3. Obtener Playlist y Construir el Array Reproductor si cambia el `playlistId`
  useEffect(() => {
    if (!playlistId) return;

    setLoadingMsg("Descargando cronograma...");
    const playlistRef = doc(db, "playlists", playlistId);
    
    const unsubPlaylist = onSnapshot(playlistRef, async (plSnap) => {
      if (plSnap.exists()) {
        const plItems = plSnap.data().items || [];
        
        const resolvedItems: PlaybackItem[] = [];
        for (const item of plItems) {
            try {
              const mediaDoc = await getDoc(doc(db, "media", item.mediaId));
              if (mediaDoc.exists()) {
                const md = mediaDoc.data();
                resolvedItems.push({
                   id: item.mediaId,
                   url: md.url,
                   type: md.type,
                   duration: item.duration,
                });
              }
            } catch (err) {
              console.error("Error resolviendo media", item.mediaId);
            }
        }
        
        resolvedItems.sort((a: any, b: any) => a.order - b.order);
        setMediaItems(resolvedItems);
      }
    }, (err) => {
       console.error("Error Playlist listener", err);
       fallbackToOfflineCache();
    });

    return () => unsubPlaylist();
  }, [playlistId]);

  const fallbackToOfflineCache = () => {
    const cached = localStorage.getItem("dsf_offline_playlist");
    if (cached) {
      try {
        setMediaItems(JSON.parse(cached));
        setPairingCode(null);
      } catch (e) {}
    }
  };

  // 4. Instanciar el Bucle
  const { currentItem, nextItem, goToNext } = useSignageLoop(mediaItems);

  // ======= RENDER EN PANTALLA EXTREMA 100% =======
  
  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen w-screen bg-black items-center justify-center text-slate-500 overflow-hidden text-xl font-medium">
        Cargando...
      </div>
    );
  }

  // Wrapper with hidden double-click admin access zone
  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden select-none">
      
      {/* Hidden Admin Access Button (Top Left Corner) */}
      <div 
        className="absolute top-0 left-0 w-16 h-16 z-50 cursor-pointer opacity-0"
        onDoubleClick={() => router.push('/admin')}
        title="Doble clic para ir al Admin"
      />

      {pairingCode ? (
        <div className="flex flex-col h-full w-full items-center justify-center text-white">
          <h1 className="text-2xl text-slate-400 uppercase tracking-widest mb-4">Empareja esta TV desde el Dashboard</h1>
          <div className="text-8xl md:text-9xl font-bold tracking-widest bg-slate-900 border-4 border-slate-700 py-8 px-16 rounded-3xl text-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            {pairingCode}
          </div>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center text-slate-500 text-xl font-medium">
          {networkError ? "Trabajando de forma local (Offline)..." : loadingMsg}
        </div>
      ) : (
        <>
          {/* Preload: Solo renderizado invisible para cachear el stream / blob de imagen */}
          {nextItem && nextItem.id !== currentItem?.id && (
            <div className="absolute inset-0 opacity-0 -z-10 pointer-events-none">
              {nextItem.type === "vid" ? (
                 <video src={nextItem.url} preload="auto" muted playsInline />
              ) : (
                 <img src={nextItem.url} alt="preload" className="w-full h-full object-cover" />
              )}
            </div>
          )}
  
          {/* Item Activo */}
          {currentItem && (
            <div key={currentItem.id} className="absolute inset-0 z-0">
              {currentItem.type === "vid" ? (
                <video 
                  src={currentItem.url} 
                  autoPlay 
                  muted 
                  playsInline 
                  loop={false}
                  onEnded={() => goToNext()} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <img src={currentItem.url} alt="signage" className="w-full h-full object-cover" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
