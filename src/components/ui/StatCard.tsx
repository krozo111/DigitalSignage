import { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ComponentType<LucideProps>;
  iconTone?: "accent" | "success" | "warning" | "danger" | "info" | "muted";
  meta?: ReactNode;
  footer?: { label: string; href: string };
}

const iconToneClass: Record<NonNullable<StatCardProps["iconTone"]>, string> = {
  accent:  "text-accent  bg-accent-soft",
  success: "text-success bg-success-soft",
  warning: "text-warning bg-warning-soft",
  danger:  "text-danger  bg-danger-soft",
  info:    "text-info    bg-info-soft",
  muted:   "text-fg-muted bg-fg/[0.06]",
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
    <div className="bg-surface-1 p-6 rounded-xl border border-border shadow-[0_1px_0_oklch(1_0_0/0.04)_inset,0_12px_28px_-16px_oklch(0_0_0/0.6)] flex flex-col justify-between gap-5">
      <div>
        <h3 className="flex items-center gap-2.5">
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${iconToneClass[iconTone]}`}
            aria-hidden="true"
          >
            <Icon size={16} />
          </span>
          <span className="text-eyebrow text-fg-muted">{label}</span>
        </h3>
        <div className="mt-4">
          {typeof value === "string" || typeof value === "number" ? (
            <span className="text-stat text-fg">{value}</span>
          ) : (
            value
          )}
        </div>
        {meta && <div className="mt-3 space-y-1.5">{meta}</div>}
      </div>
      {footer && (
        <Link
          href={footer.href}
          className="text-label text-accent hover:text-accent/80 inline-flex items-center gap-1"
        >
          {footer.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
