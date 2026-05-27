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
      ? "border-2 border-dashed border-border rounded-xl"
      : "border border-border rounded-xl bg-surface-1 backdrop-blur-sm";

  return (
    <div
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={`flex flex-col items-center justify-center text-center py-16 px-6 text-fg-subtle transition-colors ${baseClasses} ${
        isInteractive ? "cursor-pointer hover:border-border-strong hover:text-fg-muted" : ""
      } ${className}`}
    >
      {Icon && <Icon size={40} className="mb-3 text-fg-disabled" />}
      <p className="font-medium text-fg-muted">{title}</p>
      {description && <p className="text-sm mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
