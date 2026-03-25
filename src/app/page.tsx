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
  
  const [loadingMsg, setLoadingMsg] = useState("Initializing TV...");
  const [networkError, setNetworkError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keyboard shortcut to enter Admin Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a' && e.ctrlKey && e.shiftKey) {
        router.push('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // 1. Screen setup: Recover existing identity or prompt for registration
  useEffect(() => {
    const initializePlayer = async () => {
      const storedScreenId = localStorage.getItem("dsf_screen_id");

      if (storedScreenId) {
        try {
          const snap = await getDoc(doc(db, "screens", storedScreenId));
          if (snap.exists()) {
            setScreenId(storedScreenId);
            fallbackToOfflineCache();
            return;
          } else {
            console.warn("Stored screen was deleted by admin. Clearing...");
            localStorage.removeItem("dsf_screen_id");
          }
        } catch {
          console.warn("Cannot validate screen (offline?), trusting localStorage.");
          setScreenId(storedScreenId);
          fallbackToOfflineCache();
          return;
        }
      }

      // No valid stored ID → show registration button (don't auto-create)
      setNeedsRegistration(true);
    };

    initializePlayer();
  }, []);

  // Explicit registration — only triggered by user clicking the button
  const handleRegisterScreen = async () => {
    setRegistering(true);
    setNeedsRegistration(false);
    setLoadingMsg("Registering screen...");
    
    const newCode = generatePairingCode();
    try {
      const docRef = await addDoc(collection(db, "screens"), {
        pairingCode: newCode,
        name: "New TV",
        playlistId: null,
        status: "online",
        lastSeen: new Date(),
      });

      localStorage.setItem("dsf_screen_id", docRef.id);
      setScreenId(docRef.id);
      setPairingCode(newCode);
    } catch (err) {
      console.error("Failed to register screen:", err);
      setNeedsRegistration(true);
      setLoadingMsg("Registration failed. Check your connection.");
    } finally {
      setRegistering(false);
    }
  };

  // 2. Listen for admin commands via Firebase realtime
  useEffect(() => {
    if (!screenId) return;

    const screenRef = doc(db, "screens", screenId);
    
    const unsubscribe = onSnapshot(screenRef, 
      (docSnap) => {
        setNetworkError(false);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPairingCode(data.pairingCode || null);
          
          if (data.playlistId !== playlistId) {
            setPlaylistId(data.playlistId);
          }
        }
      },
      (error) => {
        console.error("Listener Error (Probably offline)", error);
        setNetworkError(true);
      }
    );

    return () => unsubscribe();
  }, [screenId, playlistId]);

  // 2b. Heartbeat: update lastSeen every 60s (NOT inside onSnapshot to avoid write loops)
  useEffect(() => {
    if (!screenId) return;

    const sendHeartbeat = () => {
      const screenRef = doc(db, "screens", screenId);
      setDoc(screenRef, { lastSeen: new Date(), status: "online" }, { merge: true })
        .catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60_000);
    return () => clearInterval(interval);
  }, [screenId]);

  // 3. Resolve playlist items when playlistId changes
  useEffect(() => {
    if (!playlistId) return;

    setLoadingMsg("Downloading schedule...");
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
            console.error("Error resolving media", item.mediaId);
          }
        }
        
        resolvedItems.sort((a: any, b: any) => a.order - b.order);
        setMediaItems(resolvedItems);

        // Persist for offline use
        try {
          localStorage.setItem("dsf_offline_playlist", JSON.stringify(resolvedItems));
        } catch {}
      }
    }, (err) => {
      console.error("Playlist listener error", err);
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

  // 4. Playback loop
  const { currentItem, nextItem, goToNext } = useSignageLoop(mediaItems);

  // ======= RENDER =======
  
  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen w-screen bg-black items-center justify-center text-slate-500 overflow-hidden text-xl font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden select-none">
      
      {/* Hidden Admin Access (Top Left Corner) */}
      <div 
        className="absolute top-0 left-0 w-16 h-16 z-50 cursor-pointer opacity-0"
        onDoubleClick={() => router.push('/admin')}
        title="Double click to go to Admin"
      />

      {/* State: Needs Registration — no screen identity, show button */}
      {needsRegistration ? (
        <div className="flex flex-col h-full w-full items-center justify-center text-white gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Digital Signage Player</h1>
            <p className="text-slate-400 text-lg">No screen is registered on this device.</p>
          </div>
          <button
            onClick={handleRegisterScreen}
            disabled={registering}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 px-10 rounded-2xl text-xl transition-all border-none cursor-pointer shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            {registering ? "Registering..." : "📺 Register New Screen"}
          </button>
          <p className="text-slate-600 text-sm max-w-md text-center">
            This will create a screen identity and show a pairing code. You&apos;ll link it from the admin dashboard.
          </p>
        </div>

      /* State: Has pairing code — waiting for admin to claim */
      ) : pairingCode ? (
        <div className="flex flex-col h-full w-full items-center justify-center text-white">
          <h1 className="text-2xl text-slate-400 uppercase tracking-widest mb-4">Pair your screen</h1>
          <p className="text-lg text-slate-500 mb-8">Enter this code in your control panel</p>
          <div className="text-8xl md:text-9xl font-bold tracking-widest bg-slate-900 border-4 border-slate-700 py-8 px-16 rounded-3xl text-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            {pairingCode}
          </div>
        </div>

      /* State: No media yet — loading or offline */
      ) : mediaItems.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center text-slate-500 text-xl font-medium">
          {networkError ? "Working locally (Offline)..." : loadingMsg}
        </div>

      /* State: Playing content */
      ) : (
        <>
          {nextItem && nextItem.id !== currentItem?.id && (
            <div className="absolute inset-0 opacity-0 -z-10 pointer-events-none">
              {nextItem.type === "vid" ? (
                <video src={nextItem.url} preload="auto" muted playsInline />
              ) : (
                <img src={nextItem.url} alt="preload" className="w-full h-full object-cover" />
              )}
            </div>
          )}

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
