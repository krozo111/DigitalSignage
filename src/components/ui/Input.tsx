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

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/80"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            bg-yugo-primary/60 border rounded-lg px-4 py-3 text-white
            placeholder:text-white/30
            focus:outline-none focus:ring-2 focus:ring-yugo-accent focus:border-transparent
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500/50" : "border-white/10"}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
