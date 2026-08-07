"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "destructive" | "affirm" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent hover:bg-accent-strong text-on-accent font-semibold",
  secondary:
    "bg-surface-1 hover:bg-surface-3 text-fg border border-border font-medium",
  danger:
    "border border-danger text-danger hover:bg-danger/[0.06] font-semibold",
  destructive:
    "border border-danger text-danger hover:bg-danger/[0.06] font-semibold",
  affirm:
    "bg-signal-mint hover:bg-signal-mint/90 text-midnight-violet font-semibold",
  ghost:
    "bg-transparent hover:bg-surface-3 text-fg-muted hover:text-fg font-medium",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-meta rounded-md",
  md: "h-9 px-3.5 text-label rounded-md",
  lg: "h-10 px-4 text-label rounded-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 transition-colors duration-[160ms] cursor-pointer border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
