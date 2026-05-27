"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id: externalId, ...props }, ref) => {
    const autoId = useId();
    const inputId = externalId || autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label text-fg">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`bg-surface-2 border rounded-lg px-4 py-2.5 text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-danger/50" : "border-border-strong"} ${className}`}
          {...props}
        />
        {error && (
          <span id={errorId} className="text-meta text-danger">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
