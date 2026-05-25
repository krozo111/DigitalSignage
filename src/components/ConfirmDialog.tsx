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
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (dialogRef.current) focusTrap(dialogRef.current, e);
    },
    [onCancel]
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-yugo-primary/95 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id={titleId} className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/60 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel} aria-label={cancelText}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            aria-label={confirmText}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
