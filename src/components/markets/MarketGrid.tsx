"use client";

import { MarketCard } from "./MarketCard";
import { MarketCategorySection } from "./MarketCategorySection";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketSummary, MarketCategory } from "@/lib/polymarket/types";

interface MarketGridProps {
  markets: MarketSummary[];
  isLoading?: boolean;
}

interface MarketGroupedGridProps {
  marketsByCategory: Record<MarketCategory, MarketSummary[]>;
  isLoading?: boolean;
}

const CATEGORY_ORDER: MarketCategory[] = [
  "winner",
  "group",
  "qualification",
  "other",
];

function MarketCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-3 w-24" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <MarketCardSkeleton key={i} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
        No markets found
      </p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
        World Cup 2026 markets will appear here as they become available on
        Polymarket.
      </p>
    </div>
  );
}

export function MarketGrid({ markets, isLoading }: MarketGridProps) {
  if (isLoading) return <LoadingSkeleton />;
  if (markets.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((market) => (
        <MarketCard key={market.conditionId} market={market} />
      ))}
    </div>
  );
}

export function MarketGroupedGrid({
  marketsByCategory,
  isLoading,
}: MarketGroupedGridProps) {
  if (isLoading) return <LoadingSkeleton />;

  const totalMarkets = Object.values(marketsByCategory).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  if (totalMarkets === 0) return <EmptyState />;

  return (
    <div className="space-y-6">
      {CATEGORY_ORDER.map((cat) => {
        const markets = marketsByCategory[cat];
        if (!markets || markets.length === 0) return null;
        return (
          <MarketCategorySection
            key={cat}
            category={cat}
            markets={markets}
          />
        );
      })}
    </div>
  );
}
