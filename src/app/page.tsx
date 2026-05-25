"use client";

import { useEffect, useState, useRef } from "react";
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
  const [mediaItems, setMediaItems] = useState<PlaybackItem[]>([]);
  
  const [networkError, setNetworkError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const [fadingItem, setFadingItem] = useState<PlaybackItem | null>(null);
  const [showUpdateBadge, setShowUpdateBadge] = useState(false);

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

  const handleRegisterScreen = async () => {
    setRegistering(true);
    setRegisterError("");

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
      setRegisterError("Could not connect. Check your internet and try again.");
    } finally {
      setRegistering(false);
    }
  };

  // 2. Real-time listener: screen doc → playlist doc → resolve media
  const playlistIdRef = useRef<string | null>(null);
  const unsubPlaylistRef = useRef<(() => void) | null>(null);
  const resolveIdRef = useRef(0);

  const subscribeToPlaylist = (playlistId: string) => {
    if (unsubPlaylistRef.current) {
      unsubPlaylistRef.current();
      unsubPlaylistRef.current = null;
    }

    const playlistRef = doc(db, "playlists", playlistId);
    unsubPlaylistRef.current = onSnapshot(playlistRef, (plSnap) => {
      if (plSnap.exists()) {
        resolveIdRef.current++;
        const currentResolveId = resolveIdRef.current;

        const plData = plSnap.data();
        const plItems = plData.items || [];

        (async () => {
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
            } catch {
              console.error("Error resolving media", item.mediaId);
            }
          }

          if (currentResolveId === resolveIdRef.current) {
            resolvedItems.sort((a: any, b: any) => a.order - b.order);
            setMediaItems(resolvedItems);
            localStorage.setItem("dsf_offline_playlist", JSON.stringify(resolvedItems));
            setShowUpdateBadge(true);
            setTimeout(() => setShowUpdateBadge(false), 3000);
          }
        })();
      } else {
        setMediaItems([]);
        localStorage.setItem("dsf_offline_playlist", JSON.stringify([]));
      }
    });
  };

  const clearPlaylist = () => {
    if (unsubPlaylistRef.current) {
      unsubPlaylistRef.current();
      unsubPlaylistRef.current = null;
    }
    setMediaItems([]);
    localStorage.setItem("dsf_offline_playlist", JSON.stringify([]));
  };

  useEffect(() => {
    if (!screenId) return;

    const screenRef = doc(db, "screens", screenId);
    const unsubScreen = onSnapshot(screenRef, (snap) => {
      if (!snap.exists()) {
        localStorage.removeItem("dsf_screen_id");
        setScreenId(null);
        setNeedsRegistration(true);
        setPairingCode(null);
        setNetworkError(false);
        return;
      }

      setNetworkError(false);
      const data = snap.data();
      setPairingCode(data.pairingCode || null);

      const newPlaylistId = data.playlistId || null;

      if (newPlaylistId !== playlistIdRef.current) {
        playlistIdRef.current = newPlaylistId;

        if (newPlaylistId) {
          subscribeToPlaylist(newPlaylistId);
        } else {
          clearPlaylist();
        }
      }
    }, (error) => {
      console.error("Screen listener error:", error);
      setNetworkError(true);
    });

    return () => {
      unsubScreen();
      if (unsubPlaylistRef.current) {
        unsubPlaylistRef.current();
      }
    };
  }, [screenId]);

  // 2b. Polling fallback — safety net if WebSocket disconnects silently on TV WebViews
  useEffect(() => {
    if (!screenId) return;

    const fallbackCheck = async () => {
      try {
        const screenSnap = await getDoc(doc(db, "screens", screenId));
        if (!screenSnap.exists()) {
          localStorage.removeItem("dsf_screen_id");
          setScreenId(null);
          setNeedsRegistration(true);
          setPairingCode(null);
          return;
        }

        const data = screenSnap.data();
        setPairingCode(data.pairingCode || null);
        const fbPlaylistId = data.playlistId || null;

        if (fbPlaylistId !== playlistIdRef.current) {
          playlistIdRef.current = fbPlaylistId;
          if (fbPlaylistId) {
            subscribeToPlaylist(fbPlaylistId);
          } else {
            clearPlaylist();
          }
        }
      } catch {
        // Silent fail — onSnapshot handles connectivity, this is just a backup
      }
    };

    const interval = setInterval(fallbackCheck, 180_000);
    return () => clearInterval(interval);
  }, [screenId]);

  // 2b. Heartbeat: update lastSeen every 60s
  useEffect(() => {
    if (!screenId) return;

    const sendHeartbeat = () => {
      const screenRef = doc(db, "screens", screenId);
      setDoc(screenRef, { lastSeen: new Date(), status: "online" }, { merge: true })
        .catch(() => {});
    };

    // Debounce inicial para no pisar el boot
    const timer = setTimeout(sendHeartbeat, 5000);
    const interval = setInterval(sendHeartbeat, 60_000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [screenId]);

  const fallbackToOfflineCache = () => {
    const cached = localStorage.getItem("dsf_offline_playlist");
    if (cached) {
      try {
        setMediaItems(JSON.parse(cached));
        setPairingCode(null);
      } catch {}
    }
  };

  const { currentItem, nextItem, goToNext, currentIndex } = useSignageLoop(mediaItems);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoLoadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearVideoTimer = () => {
    if (videoLoadTimerRef.current) {
      clearTimeout(videoLoadTimerRef.current);
      videoLoadTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (currentItem?.type !== "vid") {
      clearVideoTimer();
      return;
    }
    videoLoadTimerRef.current = setTimeout(() => {
      console.warn("Video load timeout, skipping to next item");
      goToNext();
    }, 15000);
    return clearVideoTimer;
  }, [currentItem?.url, goToNext]);

  const handleVideoReady = () => {
    clearVideoTimer();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoEnd = () => {
    if (mediaItems.length === 1) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    } else {
      goToNext();
    }
  };

  const prevCurrentItemRef = useRef<PlaybackItem | null>(null);

  useEffect(() => {
    const prev = prevCurrentItemRef.current;
    prevCurrentItemRef.current = currentItem;

    if (prev && prev.id !== currentItem?.id && currentItem) {
      setFadingItem(prev);
    }
  }, [currentItem?.id, currentItem?.url]);

  function LiveClock() {
    const [time, setTime] = useState("");
    useEffect(() => {
      const update = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      update();
      const id = setInterval(update, 1000);
      return () => clearInterval(id);
    }, []);
    return <>{time}</>;
  }

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

      {/* Status overlay */}
      {!needsRegistration && !pairingCode && (
        <div className="absolute bottom-4 right-6 z-40 flex items-center gap-3 text-white/30 text-xs font-mono pointer-events-none">
          <span className="flex items-center gap-1.5">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${networkError ? "bg-red-500" : "bg-yugo-secondary shadow-[0_0_6px_rgba(80,203,173,0.6)]"}`} />
            {networkError ? "Offline" : "Connected"}
          </span>
          <LiveClock />
        </div>
      )}

      {/* Live-update badge */}
      {showUpdateBadge && (
        <div
          className="absolute top-4 right-6 z-40 bg-yugo-accent/20 text-yugo-accent text-xs font-medium px-3 py-1.5 rounded-full border border-yugo-accent/10 transition-opacity duration-500"
        >
          Content Updated
        </div>
      )}

      {/* State: Needs Registration — no screen identity, show button */}
      {needsRegistration ? (
        <div className="flex flex-col h-full w-full items-center justify-center text-white gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Digital Signage Player</h1>
            <p className="text-slate-400 text-lg">No screen is registered on this device.</p>
          </div>
          {registerError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm max-w-md">
              {registerError}
            </div>
          )}
          <button
            onClick={handleRegisterScreen}
            disabled={registering}
            className="bg-yugo-accent hover:bg-yugo-accent/90 disabled:opacity-50 text-yugo-primary font-bold py-4 px-10 rounded-2xl text-xl transition-all border-none cursor-pointer shadow-[0_0_30px_rgba(239,184,81,0.3)]"
          >
            {registering ? "Registering..." : "Register New Screen"}
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
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div
              className="text-8xl md:text-9xl font-bold tracking-widest bg-slate-900 border-4 border-slate-700 py-8 px-16 rounded-3xl text-blue-500"
              style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
            >
              {pairingCode}
            </div>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${pairingCode}`}
              alt={`QR code for pairing code ${pairingCode}`}
              className="rounded-xl bg-white p-2 w-32 h-32 md:w-40 md:h-40"
            />
          </div>
          <p className="text-slate-500 text-sm mt-6">Scan the QR code or enter the code manually</p>
        </div>

      /* State: No media yet — loading or offline */
      ) : mediaItems.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center text-slate-500 text-xl font-medium">
          {networkError ? "Offline — no content cached" : "Waiting for playlist..."}
        </div>

      /* State: Playing content */
      ) : (
        <>
          {/* Preload next item */}
          {nextItem && nextItem.id !== currentItem?.id && (
            <div className="absolute inset-0 opacity-0 -z-20 pointer-events-none">
              {nextItem.type === "vid" ? (
                <video src={nextItem.url} preload="auto" muted playsInline />
              ) : (
                <img src={nextItem.url} alt="preload" className="w-full h-full object-cover" />
              )}
            </div>
          )}

          {/* Current item */}
          {currentItem && (
            <div
              key={`${currentItem.id}-${currentIndex}`}
              className="absolute inset-0 z-10 animate-[fadeIn_500ms_ease-in-out]"
            >
              {currentItem.type === "vid" ? (
                <video
                  ref={videoRef}
                  src={currentItem.url}
                  autoPlay
                  muted
                  playsInline
                  onCanPlay={handleVideoReady}
                  onError={() => { clearVideoTimer(); goToNext(); }}
                  onEnded={handleVideoEnd}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={currentItem.url} alt="signage" className="w-full h-full object-cover" />
              )}
            </div>
          )}

          {/* Fading out previous item */}
          {fadingItem && (
            <div
              key={`fade-${fadingItem.id}`}
              className="absolute inset-0 z-20"
              style={{ animation: "fadeOut 500ms ease-in-out forwards" }}
              onAnimationEnd={() => setFadingItem(null)}
            >
              {fadingItem.type === "vid" ? (
                <video src={fadingItem.url} muted className="w-full h-full object-cover" />
              ) : (
                <img src={fadingItem.url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
