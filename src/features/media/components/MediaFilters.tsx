import { Input } from "@/components/ui/Input";

export type MediaTypeFilter = "all" | "img" | "vid";

const FILTERS: { value: MediaTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "img", label: "Images" },
  { value: "vid", label: "Videos" },
];

interface MediaFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  typeFilter: MediaTypeFilter;
  onTypeChange: (t: MediaTypeFilter) => void;
}

export function MediaFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
}: MediaFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-64"
        aria-label="Search media files"
      />
      <div className="flex gap-1 bg-surface-1 rounded-lg p-1 border border-border">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onTypeChange(value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              typeFilter === value
                ? "bg-accent text-on-accent"
                : "text-fg-subtle hover:text-fg"
            }`}
            aria-label={`Filter ${label.toLowerCase()}`}
            aria-pressed={typeFilter === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
