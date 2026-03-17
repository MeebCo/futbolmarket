"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { MarketGrid, MarketGroupedGrid } from "@/components/markets/MarketGrid";
import {
  MarketFilters,
  type SortOption,
  type CategoryFilter,
  type CategoryCounts,
  type CompetitionFilter,
} from "@/components/markets/MarketFilters";
import type { MarketSummary, MarketCategory } from "@/lib/polymarket/types";
import { Trophy } from "lucide-react";

async function fetchMarkets(): Promise<MarketSummary[]> {
  const res = await fetch("/api/polymarket/markets");
  if (!res.ok) throw new Error("Failed to fetch markets");
  const data = await res.json();
  return data.markets;
}

const CATEGORY_ORDER: MarketCategory[] = [
  "winner",
  "group",
  "qualification",
  "cl-winner",
  "cl-match",
  "cl-knockout",
  "cl-stats",
  "other",
];

function sortMarkets(markets: MarketSummary[], sortBy: SortOption): MarketSummary[] {
  const sorted = [...markets];
  switch (sortBy) {
    case "volume":
      sorted.sort((a, b) => b.volume - a.volume);
      break;
    case "volume24hr":
      sorted.sort((a, b) => b.volume24hr - a.volume24hr);
      break;
    case "price":
      sorted.sort(
        (a, b) => (b.outcomePrices[0] ?? 0) - (a.outcomePrices[0] ?? 0)
      );
      break;
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      );
      break;
  }
  return sorted;
}

const EMPTY_CATEGORY_COUNTS: CategoryCounts = {
  all: 0,
  winner: 0,
  group: 0,
  qualification: 0,
  "cl-winner": 0,
  "cl-match": 0,
  "cl-knockout": 0,
  "cl-stats": 0,
  other: 0,
};

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price");
  const [showActive, setShowActive] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [selectedCompetition, setSelectedCompetition] =
    useState<CompetitionFilter>("all");

  const { data: markets = [], isLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarkets,
    refetchInterval: 30000,
  });

  // Apply search + active filters
  const baseFiltered = useMemo(() => {
    let filtered = [...markets];
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((m) =>
        m.question.toLowerCase().includes(lower)
      );
    }
    if (showActive) {
      filtered = filtered.filter((m) => m.active && !m.closed);
    }
    return filtered;
  }, [markets, search, showActive]);

  // Competition counts (before competition filter)
  const competitionCounts = useMemo(() => {
    const counts: Record<CompetitionFilter, number> = {
      all: baseFiltered.length,
      worldcup: 0,
      championsleague: 0,
    };
    for (const m of baseFiltered) {
      if (m.competition === "worldcup") counts.worldcup++;
      else if (m.competition === "championsleague") counts.championsleague++;
    }
    return counts;
  }, [baseFiltered]);

  // Filter by competition
  const competitionFiltered = useMemo(() => {
    if (selectedCompetition === "all") return baseFiltered;
    return baseFiltered.filter((m) => m.competition === selectedCompetition);
  }, [baseFiltered, selectedCompetition]);

  // Category counts (after competition filter)
  const categoryCounts: CategoryCounts = useMemo(() => {
    const counts = { ...EMPTY_CATEGORY_COUNTS };
    counts.all = competitionFiltered.length;
    for (const m of competitionFiltered) {
      if (m.marketCategory in counts) {
        counts[m.marketCategory as keyof CategoryCounts]++;
      }
    }
    return counts;
  }, [competitionFiltered]);

  // Markets grouped by category (for "all" view)
  const marketsByCategory = useMemo(() => {
    const groups = Object.fromEntries(
      CATEGORY_ORDER.map((cat) => [cat, [] as MarketSummary[]])
    ) as Record<MarketCategory, MarketSummary[]>;

    for (const m of competitionFiltered) {
      if (groups[m.marketCategory]) {
        groups[m.marketCategory].push(m);
      }
    }
    for (const cat of CATEGORY_ORDER) {
      groups[cat] = sortMarkets(groups[cat], sortBy);
    }
    return groups;
  }, [competitionFiltered, sortBy]);

  // Flat sorted list for single-category view
  const flatMarkets = useMemo(() => {
    if (selectedCategory === "all") return [];
    const filtered = competitionFiltered.filter(
      (m) => m.marketCategory === selectedCategory
    );
    return sortMarkets(filtered, sortBy);
  }, [competitionFiltered, selectedCategory, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-7 w-7 text-purple" />
          <h1 className="text-2xl font-bold">Football Markets</h1>
        </div>
        <p className="text-silver">
          Browse and trade prediction markets for the World Cup 2026 and
          Champions League.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <MarketFilters
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showActive={showActive}
          onActiveToggle={setShowActive}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categoryCounts={categoryCounts}
          selectedCompetition={selectedCompetition}
          onCompetitionChange={setSelectedCompetition}
          competitionCounts={competitionCounts}
        />
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="mb-4 text-sm text-silver">
          {selectedCategory === "all"
            ? `${competitionFiltered.length} market${competitionFiltered.length !== 1 ? "s" : ""}`
            : `${flatMarkets.length} market${flatMarkets.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Grid */}
      {selectedCategory === "all" ? (
        <MarketGroupedGrid
          marketsByCategory={marketsByCategory}
          isLoading={isLoading}
        />
      ) : (
        <MarketGrid markets={flatMarkets} isLoading={isLoading} />
      )}
    </div>
  );
}
