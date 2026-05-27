import { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  dot?: boolean;
}

const toneStyles: Record<BadgeTone, { text: string; dot: string; bg: string; ring: string }> = {
  neutral: { text: "text-fg-muted",  dot: "bg-fg-subtle",  bg: "bg-fg/[0.06]",   ring: "ring-border-strong" },
  accent:  { text: "text-accent",    dot: "bg-accent",     bg: "bg-accent-soft", ring: "ring-accent/25" },
  success: { text: "text-success",   dot: "bg-success",    bg: "bg-success-soft",ring: "ring-success/25" },
  warning: { text: "text-warning",   dot: "bg-warning",    bg: "bg-warning-soft",ring: "ring-warning/25" },
  danger:  { text: "text-danger",    dot: "bg-danger",     bg: "bg-danger-soft", ring: "ring-danger/25" },
  info:    { text: "text-info",      dot: "bg-info",       bg: "bg-info-soft",   ring: "ring-info/25" },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-2.5 py-1 gap-1.5",
};

export function Badge({
  tone = "neutral",
  size = "sm",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const styles = toneStyles[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${styles.ring} ${styles.text} ${styles.bg} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${
            tone === "success" ? "shadow-[0_0_8px_currentColor]" : ""
          }`}
        />
      )}
      {children}
    </span>
  );
}
