// Online: a mint dot with a soft glow so "live" reads at a glance.
// Offline: a hollow ring. Shape carries state alongside color (never color alone).
export function StatusDot({ online }: { online: boolean }) {
  return online ? (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full bg-success text-success shadow-[0_0_8px_currentColor]"
      aria-hidden="true"
    />
  ) : (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full border border-fg-subtle"
      aria-hidden="true"
    />
  );
}
