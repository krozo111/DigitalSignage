// Online: a mint dot so "live" reads at a glance.
// Offline: a hollow ring. Shape carries state alongside color (never color alone).
export function StatusDot({ online }: { online: boolean }) {
  return online ? (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full bg-success"
      aria-hidden="true"
    />
  ) : (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full border border-fg-subtle"
      aria-hidden="true"
    />
  );
}
