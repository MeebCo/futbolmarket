"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { MarketCategory } from "@/lib/polymarket/types";

type SortOption = "volume" | "volume24hr" | "price" | "newest";
type CategoryFilter = "all" | MarketCategory;

interface CategoryCounts {
  all: number;
  winner: number;
  group: number;
  qualification: number;
  other: number;
}

interface MarketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showActive: boolean;
  onActiveToggle: (active: boolean) => void;
  selectedCategory: CategoryFilter;
  onCategoryChange: (cat: CategoryFilter) => void;
  categoryCounts: CategoryCounts;
}

const categoryTabs: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "winner", label: "Tournament Winner" },
  { value: "group", label: "Group Winner" },
  { value: "qualification", label: "Qualification" },
  { value: "other", label: "Other" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "volume", label: "Volume" },
  { value: "volume24hr", label: "24h Vol" },
  { value: "price", label: "Price" },
  { value: "newest", label: "Newest" },
];

export function MarketFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  showActive,
  onActiveToggle,
  selectedCategory,
  onCategoryChange,
  categoryCounts,
}: MarketFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categoryTabs.map((tab) => {
          const count = categoryCounts[tab.value];
          const isSelected = selectedCategory === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onCategoryChange(tab.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                isSelected
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search + sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search markets..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Active filter */}
          <Button
            variant={showActive ? "default" : "outline"}
            size="sm"
            onClick={() => onActiveToggle(!showActive)}
          >
            Active Only
          </Button>

          {/* Sort options */}
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors first:rounded-l-lg last:rounded-r-lg cursor-pointer ${
                  sortBy === opt.value
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { SortOption, CategoryFilter, CategoryCounts };
