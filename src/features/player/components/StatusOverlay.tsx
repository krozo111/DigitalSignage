"use client";

import { useEffect, useState } from "react";

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <>{time}</>;
}

interface StatusOverlayProps {
  offline: boolean;
}

export function StatusOverlay({ offline }: StatusOverlayProps) {
  return (
    <div className="absolute bottom-4 right-6 z-40 flex items-center gap-3 text-fg-subtle text-xs font-mono pointer-events-none">
      <span className="flex items-center gap-1.5">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            offline ? "bg-danger" : "bg-success shadow-[0_0_6px_rgba(80,203,173,0.6)]"
          }`}
        />
        {offline ? "Offline" : "Connected"}
      </span>
      {offline && <span role="status" className="rounded bg-black/60 px-2 py-1 text-[10px] text-white">Media files are not saved for offline playback</span>}
      <LiveClock />
    </div>
  );
}
