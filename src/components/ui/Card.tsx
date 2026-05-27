import { HTMLAttributes } from "react";

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: CardPadding;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  hover = false,
  padding = "none",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-surface-1 border border-border rounded-xl shadow-[0_1px_0_oklch(1_0_0/0.04)_inset,0_8px_24px_-12px_oklch(0_0_0/0.5)] ${
        paddingStyles[padding]
      } ${
        hover
          ? "transition-colors duration-200 hover:bg-surface-2 hover:border-border-strong"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
