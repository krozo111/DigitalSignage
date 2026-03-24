import { useState, useEffect, useCallback } from "react";

export interface PlaybackItem {
  id: string;
  url: string;
  type: "img" | "vid" | "unknown";
  duration: number; // en segundos (usado solo para imágenes y fallbacks)
}

export function useSignageLoop(items: PlaybackItem[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función explícita para forzar el avance (útil para eventos como onEnded de video)
  const goToNext = useCallback(() => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items]);

  // Bucle Principal: Cambia de slide de forma automática SÓLO para imágenes
  useEffect(() => {
    if (items.length === 0) return;

    if (currentIndex >= items.length) {
      setCurrentIndex(0);
      return;
    }

    const currentItem = items[currentIndex];

    // Si es imagen, usamos el temporizador
    // Si es video, el temporizador NO corre aquí, la UI invocará goToNext al finalizar
    if (currentItem.type !== "vid") {
      const durationMs = Math.max(currentItem.duration, 1) * 1000;
      const timer = setTimeout(goToNext, durationMs);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, items, goToNext]);

  // Caché de Resiliencia Offline
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("dsf_offline_playlist", JSON.stringify(items));
    }
  }, [items]);

  // Auto-recarga programada (Mantenimiento VRAM / Memory Leak Prevent)
  useEffect(() => {
    const memoryLeakInterval = setInterval(() => {
      const now = new Date();
      // A las 4:00 AM en punto, forzamos recarga para liberar VRAM
      if (now.getHours() === 4 && now.getMinutes() === 0) {
         if (!sessionStorage.getItem('reloaded_today')) {
             sessionStorage.setItem('reloaded_today', 'true');
             window.location.reload();
         }
      } else {
         sessionStorage.removeItem('reloaded_today');
      }
    }, 60000); // Checkea cada minuto

    return () => clearInterval(memoryLeakInterval);
  }, []);

  return {
    currentIndex,
    currentItem: items.length > 0 ? items[currentIndex] : null,
    nextItem: items.length > 1 ? items[(currentIndex + 1) % items.length] : null,
    goToNext
  };
}
