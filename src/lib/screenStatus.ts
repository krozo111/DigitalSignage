import type { Screen } from "./services/screenService";

// A screen counts as online only if it has checked in recently. The stored
// `status` field can lie (a crashed player never flips itself to "offline"),
// so freshness of lastSeen is the source of truth across the whole admin.
const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;

export function isScreenOnline(screen: Screen): boolean {
  if (screen.pairingCode) return false;
  if (!screen.lastSeen) return false;
  return Date.now() - screen.lastSeen.toMillis() < ONLINE_THRESHOLD_MS;
}

export function relativeTime(lastSeen: Screen["lastSeen"]): string {
  if (!lastSeen) return "never";
  const diffMin = Math.floor((Date.now() - lastSeen.toMillis()) / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}
