"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/firebase.config";
import { errorMessage } from "@/lib/errors";
import { ScreenCommand, ScreenCommandAck, ScreenCommandKind } from "@/lib/screenCommands";
import { Screen, sendScreenCommand } from "@/lib/services/screenService";
import { isScreenOnline } from "@/lib/screenStatus";

const playbackControls: Array<{ kind: ScreenCommandKind; label: string }> = [
  { kind: "play", label: "Play" },
  { kind: "pause", label: "Pause" },
  { kind: "next", label: "Next item" },
  { kind: "reload", label: "Reload player" },
];

const volumeControls: Array<{ kind: ScreenCommandKind; label: string }> = [
  { kind: "volume_down", label: "Volume −" },
  { kind: "volume_up", label: "Volume +" },
  { kind: "mute", label: "Mute / unmute" },
];

export function CloudScreenControl({ screen }: { screen: Screen }) {
  const [command, setCommand] = useState<ScreenCommand | null>(screen.controlCommand ?? null);
  const [ack, setAck] = useState<ScreenCommandAck | null>(screen.controlAck ?? null);
  const [lastSeen, setLastSeen] = useState<Timestamp | null>(screen.lastSeen);
  const [sending, setSending] = useState<ScreenCommandKind | null>(null);
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "screens", screen.id), (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      setCommand(data.controlCommand ?? null);
      setAck(data.controlAck ?? null);
      setLastSeen(data.lastSeen ?? null);
    });
    return unsubscribe;
  }, [screen.id]);

  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  const online = isScreenOnline({ ...screen, lastSeen });
  const expired = command?.expiresAt instanceof Timestamp && command.expiresAt.toMillis() < clock;
  const waiting = Boolean(command && ack?.id !== command.id && !expired);
  const status = command && ack?.id === command.id
    ? ack.status === "applied" ? "Applied on TV" : ack.status === "unsupported" ? "Unsupported on this TV" : "Failed on TV"
    : command && !expired ? "Waiting for TV" : command ? "No response from TV" : "No commands sent";

  const send = async (kind: ScreenCommandKind) => {
    setSending(kind);
    try {
      await sendScreenCommand(screen.id, kind);
    } catch (error) {
      toast.error(`Could not send command: ${errorMessage(error)}`);
    } finally {
      setSending(null);
    }
  };

  return (
    <section className="space-y-3 border-t border-surface-border pt-4" aria-label="Cloud screen controls">
      <div>
        <h4 className="text-label font-semibold text-ink">Cloud controls</h4>
        <p className="mt-1 text-meta text-ink-muted">Works from any network while Yugo Player is open and the TV is online.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {playbackControls.map(({ kind, label }) => (
          <Button key={kind} type="button" variant="secondary" size="md" disabled={!online || sending !== null || waiting} onClick={() => send(kind)}>
            {label}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {volumeControls.map(({ kind, label }) => (
          <Button key={kind} type="button" variant="secondary" size="md" disabled={!online || sending !== null || waiting} onClick={() => send(kind)}>
            {label}
          </Button>
        ))}
      </div>
      <p className="text-meta text-ink-muted" role="status">{online ? status : "TV offline — controls unavailable"}</p>
    </section>
  );
}
