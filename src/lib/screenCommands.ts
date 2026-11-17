import { Timestamp } from "firebase/firestore";

export type ScreenCommandKind =
  | "play"
  | "pause"
  | "next"
  | "reload"
  | "volume_up"
  | "volume_down"
  | "mute";

export interface ScreenCommand {
  id: string;
  kind: ScreenCommandKind;
  issuedAt: Timestamp;
  expiresAt: Timestamp;
}

export interface ScreenCommandAck {
  id: string;
  status: "applied" | "unsupported" | "failed";
  at: Timestamp;
}

export const isScreenCommand = (value: unknown): value is ScreenCommand => {
  if (typeof value !== "object" || value === null) return false;
  const command = value as Partial<ScreenCommand>;
  return typeof command.id === "string"
    && ["play", "pause", "next", "reload", "volume_up", "volume_down", "mute"].includes(command.kind ?? "")
    && command.issuedAt instanceof Timestamp
    && command.expiresAt instanceof Timestamp;
};
