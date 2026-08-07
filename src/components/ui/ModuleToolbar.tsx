import { ReactNode } from "react";

export function ModuleToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-11 flex-col gap-2 rounded-lg border border-surface-border bg-surface-sunken p-2 sm:flex-row sm:items-center">
      {children}
    </div>
  );
}
