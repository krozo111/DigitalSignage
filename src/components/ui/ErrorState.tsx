import { ReactNode } from "react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: ReactNode;
}

export function ErrorState({
  title = "We couldn’t load this view.",
  description = "Check your connection and try again. Your existing data has not been changed.",
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-lg border border-danger/30 bg-danger-soft px-6 py-12 text-center">
      <p className="text-label font-semibold text-danger">{title}</p>
      <p className="mt-1 max-w-md text-meta text-ink-muted">{description}</p>
      {(onRetry || action) && <div className="mt-5">{action ?? <Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button>}</div>}
    </div>
  );
}
