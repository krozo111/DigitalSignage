"use client";

import { useEffect, useRef } from "react";
import { PlaybackItem } from "@/hooks/useSignageLoop";

interface PlaybackViewProps {
  currentItem: PlaybackItem | null;
  nextItem: PlaybackItem | null;
  fadingItem: PlaybackItem | null;
  currentIndex: number;
  totalItems: number;
  onVideoReady: () => void;
  onVideoEnd: () => void;
  onVideoError: () => void;
  onFadeOutComplete: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function PlaybackView({
  currentItem,
  nextItem,
  fadingItem,
  currentIndex,
  onVideoReady,
  onVideoEnd,
  onVideoError,
  onFadeOutComplete,
  videoRef,
}: PlaybackViewProps) {
  return (
    <>
      {nextItem && nextItem.id !== currentItem?.id && (
        <div className="absolute inset-0 opacity-0 -z-20 pointer-events-none" aria-hidden="true">
          {nextItem.type === "vid" ? (
            <video src={nextItem.url} preload="auto" muted playsInline />
          ) : (
            <img src={nextItem.url} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      )}

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
              onCanPlay={onVideoReady}
              onError={onVideoError}
              onEnded={onVideoEnd}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentItem.url}
              alt=""
              role="presentation"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {fadingItem && (
        <FadingLayer item={fadingItem} onAnimationEnd={onFadeOutComplete} />
      )}
    </>
  );
}

function FadingLayer({
  item,
  onAnimationEnd,
}: {
  item: PlaybackItem;
  onAnimationEnd: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handler = () => onAnimationEnd();
    node.addEventListener("animationend", handler);
    return () => node.removeEventListener("animationend", handler);
  }, [onAnimationEnd]);

  return (
    <div
      ref={ref}
      key={`fade-${item.id}`}
      className="absolute inset-0 z-20"
      style={{ animation: "fadeOut 500ms ease-in-out forwards" }}
      aria-hidden="true"
    >
      {item.type === "vid" ? (
        <video src={item.url} muted className="w-full h-full object-cover" />
      ) : (
        <img src={item.url} alt="" className="w-full h-full object-cover" />
      )}
    </div>
  );
}
