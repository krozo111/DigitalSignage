import { ReactNode } from "react";

export interface ViewTab<T extends string> {
  value: T;
  label: string;
  count?: ReactNode;
}

interface ViewTabsProps<T extends string> {
  tabs: ViewTab<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

export function ViewTabs<T extends string>({ tabs, value, onChange, label }: ViewTabsProps<T>) {
  return (
    <div className="overflow-x-auto border-b border-surface-border" role="tablist" aria-label={label}>
      <div className="flex min-w-max gap-5">
        {tabs.map((tab) => {
          const active = tab.value === value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.value)}
              className={`border-b-2 px-0.5 py-2.5 text-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-mint focus-visible:ring-offset-2 focus-visible:ring-offset-background ${active ? "border-signal-mint text-ink" : "border-transparent text-ink-muted hover:border-surface-border-strong hover:text-ink"}`}
            >
              {tab.label}
              {tab.count !== undefined && <span className="ml-1.5 font-mono text-meta text-ink-soft tnum">{tab.count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
