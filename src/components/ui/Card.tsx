import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({
  hover = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-yugo-primary/40 border border-white/5 rounded-xl backdrop-blur-sm shadow-sm
        ${
          hover
            ? "transition-all duration-200 hover:bg-yugo-primary/60 hover:border-white/10"
            : ""
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
