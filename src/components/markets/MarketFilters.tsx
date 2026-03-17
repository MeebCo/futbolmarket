"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { MarketCategory } from "@/lib/polymarket/types";
import type { Competition } from "@/config/site";

type SortOption = "volume" | "volume24hr" | "price" | "newest";
type CategoryFilter = "all" | MarketCategory;
type CompetitionFilter = "all" | Competition;

interface CategoryCounts {
  all: number;
  winner: number;
  group: number;
  qualification: number;
  "cl-winner": number;
  "cl-match": number;
  "cl-knockout": number;
  "cl-stats": number;
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
  selectedCompetition: CompetitionFilter;
  onCompetitionChange: (comp: CompetitionFilter) => void;
  competitionCounts: Record<CompetitionFilter, number>;
}

const competitionTabs: { value: CompetitionFilter; label: string }[] = [
  { value: "all", label: "All Competitions" },
  { value: "worldcup", label: "World Cup 2026" },
  { value: "championsleague", label: "Champions League" },
];

const WC_CATEGORIES: CategoryFilter[] = ["winner", "group", "qualification"];
const CL_CATEGORIES: CategoryFilter[] = [
  "cl-winner",
  "cl-match",
  "cl-knockout",
  "cl-stats",
];

const categoryLabels: Record<CategoryFilter, string> = {
  all: "All",
  winner: "Tournament Winner",
  group: "Group Winner",
  qualification: "Qualification",
  "cl-winner": "UCL Winner",
  "cl-match": "UCL Matches",
  "cl-knockout": "UCL Knockout",
  "cl-stats": "UCL Player Stats",
  other: "Other",
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "volume", label: "Volume" },
  { value: "volume24hr", label: "24h Vol" },
  { value: "price", label: "Price" },
  { value: "newest", label: "Newest" },
];

function getCategoryTabs(competition: CompetitionFilter): CategoryFilter[] {
  switch (competition) {
    case "worldcup":
      return ["all", ...WC_CATEGORIES, "other"];
    case "championsleague":
      return ["all", ...CL_CATEGORIES, "other"];
    default:
      return [
        "all",
        ...WC_CATEGORIES,
        ...CL_CATEGORIES,
        "other",
      ];
  }
}

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
  selectedCompetition,
  onCompetitionChange,
  competitionCounts,
}: MarketFiltersProps) {
  const visibleCategories = getCategoryTabs(selectedCompetition);

  return (
    <div className="space-y-3">
      {/* Competition tabs */}
      <div className="flex flex-wrap gap-2">
        {competitionTabs.map((tab) => {
          const count = competitionCounts[tab.value];
          const isSelected = selectedCompetition === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                onCompetitionChange(tab.value);
                onCategoryChange("all");
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                isSelected
                  ? "bg-purple text-white"
                  : "bg-surface text-silver hover:bg-card-bg"
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        {visibleCategories.map((cat) => {
          const count = categoryCounts[cat] ?? 0;
          if (cat !== "all" && count === 0) return null;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors cursor-pointer ${
                isSelected
                  ? "bg-purple/20 text-purple-tint"
                  : "bg-surface/50 text-silver hover:bg-surface"
              }`}
            >
              {categoryLabels[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Search + sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver" />
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
          <div className="flex items-center rounded-lg border border-border">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors first:rounded-l-lg last:rounded-r-lg cursor-pointer ${
                  sortBy === opt.value
                    ? "bg-purple text-white"
                    : "text-silver hover:bg-surface"
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

export type {
  SortOption,
  CategoryFilter,
  CategoryCounts,
  CompetitionFilter,
};
