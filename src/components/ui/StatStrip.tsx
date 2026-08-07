import { ReactNode } from "react";

export interface StatStripItem {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

const toneClasses: Record<NonNullable<StatStripItem["tone"]>, string> = {
  default: "text-ink",
  success: "text-cleared-green",
  warning: "text-pending-amber",
  danger: "text-critical-red",
  info: "text-info-cobalt",
};

export function StatStrip({ items }: { items: StatStripItem[] }) {
  return (
    <section aria-label="Summary" className="grid grid-cols-2 overflow-hidden rounded-lg border border-surface-border bg-surface-card md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="min-h-[76px] border-b border-surface-border px-4 py-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
          <p className="text-eyebrow text-ink-soft">{item.label}</p>
          <p className={`mt-1 text-stat ${toneClasses[item.tone ?? "default"]}`}>{item.value}</p>
          {item.detail && <p className="mt-1 text-meta text-ink-muted">{item.detail}</p>}
        </div>
      ))}
    </section>
  );
}
