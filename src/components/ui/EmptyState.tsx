import { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

interface EmptyStateProps {
  icon?: ComponentType<LucideProps>;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "dashed";
  onClick?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
  onClick,
  className = "",
}: EmptyStateProps) {
  const isInteractive = typeof onClick === "function";
  const baseClasses =
    variant === "dashed"
      ? "border-2 border-dashed border-border-strong rounded-xl"
      : "border border-border rounded-xl bg-surface-1";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={`flex flex-col items-center justify-center text-center py-16 px-6 text-fg-subtle transition-colors focus:outline-none ${baseClasses} ${
        isInteractive
          ? "cursor-pointer hover:border-border-strong hover:text-fg-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          : ""
      } ${className}`}
    >
      {Icon && <Icon size={36} className="mb-3 text-fg-disabled" strokeWidth={1.5} />}
      <p className="text-label font-medium text-fg-muted">{title}</p>
      {description && <p className="text-meta mt-1 max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
