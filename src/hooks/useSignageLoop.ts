import { useState, useEffect, useCallback, useRef } from "react";

export interface PlaybackItem {
  id: string;
  url: string;
  type: "img" | "vid" | "unknown";
  duration: number; // en segundos (usado solo para imágenes y fallbacks)
}

export function useSignageLoop(items: PlaybackItem[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Clamp on read instead of resetting state inside an effect: if the playlist
  // shrinks below the stored index, fall back to 0. goToNext keeps the stored
  // index bounded via modulo, so this only matters right after items change.
  const safeIndex = currentIndex < items.length ? currentIndex : 0;
  const currentItem = items.length > 0 ? items[safeIndex] : null;

  // Length kept in a ref so goToNext is stable across re-renders. items is a new
  // array reference on every Firestore snapshot re-emit; closing over it here used
  // to invalidate goToNext (and therefore the timer effect) on every emit.
  const itemsLengthRef = useRef(items.length);
  itemsLengthRef.current = items.length;

  // Función explícita para forzar el avance (útil para eventos como onEnded de video)
  const goToNext = useCallback(() => {
    const len = itemsLengthRef.current;
    if (len === 0) return;
    setCurrentIndex((prev) => (prev + 1) % len);
  }, []);

  // Bucle Principal: Cambia de slide de forma automática SÓLO para imágenes.
  // Las deps son primitivas del item actual (id/duración/tipo), NO el array: así
  // un re-emit del snapshot con el mismo contenido no reinicia el setTimeout, que
  // antes podía dejar una imagen "trabada" sin avanzar en conexiones inestables.
  useEffect(() => {
    if (!currentItem || currentItem.type === "vid") return;

    const durationMs = Math.max(currentItem.duration, 1) * 1000;
    const timer = setTimeout(goToNext, durationMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem?.id, currentItem?.duration, currentItem?.type, goToNext]);

  // Caché de Resiliencia Offline
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("dsf_offline_playlist", JSON.stringify(items));
    }
  }, [items]);

  // Auto-recarga diaria a las 4 AM (mantenimiento de VRAM / memory leaks).
  // Guard por FECHA en localStorage (persiste el reload, a diferencia de
  // sessionStorage): se setea ANTES de recargar, así no entra en loop dentro de
  // la hora 4:xx, y dispara exactamente una vez por día aunque el intervalo
  // tenga drift y no caiga justo en el minuto 0.
  useEffect(() => {
    const RELOAD_HOUR = 4;
    const RELOAD_GUARD_KEY = "dsf_last_reload_date";

    const checkScheduledReload = () => {
      const now = new Date();
      if (now.getHours() !== RELOAD_HOUR) return;

      const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      if (localStorage.getItem(RELOAD_GUARD_KEY) === today) return;

      localStorage.setItem(RELOAD_GUARD_KEY, today);
      window.location.reload();
    };

    const interval = setInterval(checkScheduledReload, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    currentIndex: safeIndex,
    currentItem,
    nextItem: items.length > 1 ? items[(safeIndex + 1) % items.length] : null,
    goToNext
  };
}
