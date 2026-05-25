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
    "bg-yugo-accent hover:bg-yugo-accent/90 text-yugo-primary font-bold",
  secondary:
    "bg-yugo-secondary hover:bg-yugo-secondary/90 text-yugo-primary font-bold",
  danger: "bg-red-600 hover:bg-red-700 text-white font-medium",
  ghost:
    "bg-transparent hover:bg-white/5 text-white/60 hover:text-white font-medium",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "py-2 px-3 text-sm rounded-lg",
  md: "py-3 px-4 text-sm rounded-lg",
  lg: "py-4 px-6 text-base rounded-xl",
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
        className={`
          inline-flex items-center justify-center gap-2
          transition-all duration-200 cursor-pointer border-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
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
