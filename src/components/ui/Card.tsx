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
      className={`bg-surface-1 border border-border rounded-xl backdrop-blur-sm shadow-sm ${
        paddingStyles[padding]
      } ${
        hover
          ? "transition-all duration-200 hover:bg-surface-2 hover:border-border-strong"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
