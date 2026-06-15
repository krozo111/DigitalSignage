"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase.config";
import { doc, collection, addDoc, onSnapshot, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { PlaybackItem, useSignageLoop } from "@/hooks/useSignageLoop";
import QRCode from "qrcode";
import { IdleScreen } from "@/features/player/components/IdleScreen";
import { PairingScreen } from "@/features/player/components/PairingScreen";
import { PlaybackView } from "@/features/player/components/PlaybackView";
import { RegisterScreen } from "@/features/player/components/RegisterScreen";
import { StatusOverlay } from "@/features/player/components/StatusOverlay";
import { UpdateBadge } from "@/features/player/components/UpdateBadge";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function generatePairingCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[array[i] % chars.length];
  }
  return code;
}

export default function Home() {
  useDocumentTitle("Yugo Signage Player");
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

  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (pairingCode) {
      QRCode.toDataURL(pairingCode, { width: 300, margin: 1 })
        .then(setQrDataUrl)
        .catch(console.error);
    } else {
      setQrDataUrl("");
    }
  }, [pairingCode]);

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

      setNeedsRegistration(true);
    };

    initializePlayer();
  }, []);

  const handleRegisterScreen = async () => {
    setRegistering(true);
    setRegisterError("");

    const newCode = generatePairingCode();
    const PAIRING_CODE_TTL_MS = 15 * 60 * 1000;
    try {
      const docRef = await addDoc(collection(db, "screens"), {
        pairingCode: newCode,
        pairingCodeExpiresAt: new Date(Date.now() + PAIRING_CODE_TTL_MS),
        name: "New TV",
        playlistId: null,
        status: "online",
        lastSeen: new Date(),
      });

      localStorage.setItem("dsf_screen_id", docRef.id);
      setScreenId(docRef.id);
      setPairingCode(newCode);
      setNeedsRegistration(false);
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
        const plItems: Array<{ mediaId: string; duration: number; order: number }> =
          [...(plData.items || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        (async () => {
          // Resolve all media docs in parallel. Awaiting inside a for-loop
          // turned a 20-item playlist into 20 serial round-trips; Promise.all
          // collapses that into one. Order is preserved by mapping over plItems.
          const resolved = await Promise.all(
            plItems.map(async (item) => {
              try {
                const mediaDoc = await getDoc(doc(db, "media", item.mediaId));
                if (mediaDoc.exists()) {
                  const md = mediaDoc.data();
                  return {
                    id: item.mediaId,
                    url: md.url,
                    type: md.type,
                    duration: item.duration,
                  } as PlaybackItem;
                }
              } catch {
                console.error("Error resolving media", item.mediaId);
              }
              return null;
            })
          );
          const resolvedItems = resolved.filter(
            (item): item is PlaybackItem => item !== null
          );

          if (currentResolveId === resolveIdRef.current) {
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

      const codeExpiry = data.pairingCodeExpiresAt as Timestamp | undefined;
      if (data.pairingCode && codeExpiry && codeExpiry.toMillis() < Date.now()) {
        const PAIRING_CODE_TTL_MS = 15 * 60 * 1000;
        const fresh = generatePairingCode();
        updateDoc(doc(db, "screens", snap.id), {
          pairingCode: fresh,
          pairingCodeExpiresAt: new Date(Date.now() + PAIRING_CODE_TTL_MS),
          lastSeen: new Date(),
        }).catch((err) => console.warn("Failed to refresh pairing code:", err));
      } else {
        setPairingCode(data.pairingCode || null);
      }

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

  // Polling fallback — safety net if WebSocket disconnects silently on TV WebViews
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
        // onSnapshot handles connectivity, this is just a backup
      }
    };

    const interval = setInterval(fallbackCheck, 180_000);
    return () => clearInterval(interval);
  }, [screenId]);

  // Heartbeat: update lastSeen every 60s
  useEffect(() => {
    if (!screenId) return;

    const sendHeartbeat = () => {
      const screenRef = doc(db, "screens", screenId);
      setDoc(screenRef, { lastSeen: new Date(), status: "online" }, { merge: true })
        .catch(() => {});
    };

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
  }, [currentItem?.url, currentItem?.type, goToNext]);

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
    prevCurrentItemRef.current = currentItem ?? null;

    if (prev && prev.id !== currentItem?.id && currentItem) {
      setFadingItem(prev);
    }
  }, [currentItem?.id, currentItem?.url, currentItem]);

  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen w-screen bg-black items-center justify-center text-fg-muted overflow-hidden text-xl font-medium">
        Loading...
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen bg-black overflow-hidden select-none">
      {!needsRegistration && !pairingCode && <StatusOverlay offline={networkError} />}
      {showUpdateBadge && <UpdateBadge />}

      {needsRegistration ? (
        <RegisterScreen
          registering={registering}
          error={registerError}
          onRegister={handleRegisterScreen}
        />
      ) : pairingCode ? (
        <PairingScreen code={pairingCode} qrDataUrl={qrDataUrl} />
      ) : mediaItems.length === 0 ? (
        <IdleScreen offline={networkError} />
      ) : (
        <PlaybackView
          currentItem={currentItem}
          nextItem={nextItem}
          fadingItem={fadingItem}
          currentIndex={currentIndex}
          totalItems={mediaItems.length}
          videoRef={videoRef}
          onVideoReady={handleVideoReady}
          onVideoEnd={handleVideoEnd}
          onVideoError={() => {
            clearVideoTimer();
            goToNext();
          }}
          onFadeOutComplete={() => setFadingItem(null)}
        />
      )}
    </main>
  );
}
