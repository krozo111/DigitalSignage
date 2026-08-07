import { Input } from "@/components/ui/Input";
import { ModuleToolbar } from "@/components/ui/ModuleToolbar";
import { ViewTabs } from "@/components/ui/ViewTabs";

export type MediaTypeFilter = "all" | "img" | "vid";
export type MediaViewMode = "grid" | "list";

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
  viewMode: MediaViewMode;
  onViewModeChange: (mode: MediaViewMode) => void;
}

export function MediaFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  viewMode,
  onViewModeChange,
}: MediaFiltersProps) {
  return (
    <ModuleToolbar>
      <Input
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-72"
        aria-label="Search media files"
      />
      <ViewTabs tabs={FILTERS} value={typeFilter} onChange={onTypeChange} label="Media type" />
      <div className="sm:ml-auto">
        <ViewTabs tabs={[{ value: "grid" as const, label: "Grid" }, { value: "list" as const, label: "List" }]} value={viewMode} onChange={onViewModeChange} label="Media view" />
      </div>
    </ModuleToolbar>
  );
}
