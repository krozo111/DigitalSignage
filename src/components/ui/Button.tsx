"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent hover:bg-accent-strong text-on-accent font-semibold shadow-[0_1px_0_oklch(1_0_0/0.25)_inset,0_8px_20px_-10px_oklch(0.81_0.155_75/0.6)]",
  secondary:
    "bg-surface-2 hover:bg-surface-1 text-fg border border-border-strong font-medium",
  danger:
    "bg-danger hover:bg-danger/90 text-on-danger font-semibold",
  ghost:
    "bg-transparent hover:bg-fg/[0.05] text-fg-muted hover:text-fg font-medium",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "py-2 px-3 text-label rounded-lg",
  md: "py-2.5 px-4 text-label rounded-lg",
  lg: "py-3.5 px-6 text-base rounded-xl",
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
        className={`inline-flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
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
