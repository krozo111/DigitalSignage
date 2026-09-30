"use client";

import { useEffect, useCallback, useRef, useId } from "react";
import { Button } from "./ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "normal";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function focusTrap(element: HTMLElement, e: KeyboardEvent) {
  const focusable = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "normal",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!busy) onCancel();
        return;
      }
      if (dialogRef.current) focusTrap(dialogRef.current, e);
    },
    [busy, onCancel]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      const timer = setTimeout(() => {
        const firstButton = dialogRef.current?.querySelector<HTMLElement>("button");
        firstButton?.focus();
      }, 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm animate-fade-in"
      onClick={() => { if (!busy) onCancel(); }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-surface-2 border border-border-strong rounded-xl p-6 max-w-md w-full mx-4 shadow-[0_24px_60px_-20px_oklch(0_0_0/0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id={titleId} className="text-h2 text-fg mb-2">{title}</h3>
        <p className="text-fg-muted text-label mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            loading={busy}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
