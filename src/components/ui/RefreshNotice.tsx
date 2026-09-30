"use client";

import { Button } from "./Button";

export function RefreshNotice({
  onRetry,
  message = "Refresh failed. Showing the last data that loaded; check your connection and try again.",
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <div role="status" aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3">
      <p className="text-meta text-ink">{message}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>Refresh</Button>
    </div>
  );
}
