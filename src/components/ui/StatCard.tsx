import { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ComponentType<LucideProps>;
  iconTone?: "accent" | "success" | "warning" | "danger" | "muted";
  meta?: ReactNode;
  footer?: { label: string; href: string };
}

const iconToneClass: Record<NonNullable<StatCardProps["iconTone"]>, string> = {
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  muted: "text-fg-muted",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  iconTone = "accent",
  meta,
  footer,
}: StatCardProps) {
  return (
    <div className="bg-surface-1 p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between backdrop-blur-sm">
      <div>
        <h3 className="text-fg-muted text-sm font-medium flex items-center gap-2">
          <Icon className={iconToneClass[iconTone]} /> {label}
        </h3>
        <div className="mt-2">
          {typeof value === "string" || typeof value === "number" ? (
            <span className="text-4xl font-bold text-fg">{value}</span>
          ) : (
            value
          )}
        </div>
        {meta && <div className="mt-2 space-y-1">{meta}</div>}
      </div>
      {footer && (
        <Link
          href={footer.href}
          className="text-accent text-sm mt-6 hover:text-accent/80 font-medium"
        >
          {footer.label} →
        </Link>
      )}
    </div>
  );
}
