"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { MarketGrid, MarketGroupedGrid } from "@/components/markets/MarketGrid";
import {
  MarketFilters,
  type SortOption,
  type CategoryFilter,
  type CategoryCounts,
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

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price");
  const [showActive, setShowActive] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");

  const { data: markets = [], isLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarkets,
    refetchInterval: 30000,
  });

  // Apply search + active filters (shared across all views)
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

  // Category counts (computed from filtered, before category selection)
  const categoryCounts: CategoryCounts = useMemo(() => {
    const counts: CategoryCounts = {
      all: baseFiltered.length,
      winner: 0,
      group: 0,
      qualification: 0,
      other: 0,
    };
    for (const m of baseFiltered) {
      counts[m.marketCategory]++;
    }
    return counts;
  }, [baseFiltered]);

  // Markets grouped by category (for "all" view)
  const marketsByCategory = useMemo(() => {
    const groups: Record<MarketCategory, MarketSummary[]> = {
      winner: [],
      group: [],
      qualification: [],
      other: [],
    };
    for (const m of baseFiltered) {
      groups[m.marketCategory].push(m);
    }
    // Sort each group
    for (const cat of CATEGORY_ORDER) {
      groups[cat] = sortMarkets(groups[cat], sortBy);
    }
    return groups;
  }, [baseFiltered, sortBy]);

  // Flat sorted list for single-category view
  const flatMarkets = useMemo(() => {
    if (selectedCategory === "all") return [];
    const filtered = baseFiltered.filter(
      (m) => m.marketCategory === selectedCategory
    );
    return sortMarkets(filtered, sortBy);
  }, [baseFiltered, selectedCategory, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-7 w-7 text-emerald-600" />
          <h1 className="text-2xl font-bold">World Cup 2026 Markets</h1>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          Browse and trade prediction markets for the FIFA World Cup 2026.
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
        />
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          {selectedCategory === "all"
            ? `${baseFiltered.length} market${baseFiltered.length !== 1 ? "s" : ""}`
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
