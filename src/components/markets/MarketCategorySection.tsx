"use client";

import { useState } from "react";
import { MarketCard } from "./MarketCard";
import { ChevronDown, ChevronUp, Trophy, Users, Plane, HelpCircle } from "lucide-react";
import type { MarketSummary, MarketCategory } from "@/lib/polymarket/types";

const CATEGORY_CONFIG: Record<
  MarketCategory,
  { label: string; icon: typeof Trophy }
> = {
  winner: { label: "Tournament Winner", icon: Trophy },
  group: { label: "Group Winner", icon: Users },
  qualification: { label: "Qualification", icon: Plane },
  other: { label: "Other", icon: HelpCircle },
};

const PREVIEW_COUNT = 10;

interface MarketCategorySectionProps {
  category: MarketCategory;
  markets: MarketSummary[];
}

export function MarketCategorySection({
  category,
  markets,
}: MarketCategorySectionProps) {
  const [expanded, setExpanded] = useState(false);
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  const hasMore = markets.length > PREVIEW_COUNT;
  const displayed = expanded ? markets : markets.slice(0, PREVIEW_COUNT);

  return (
    <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-sm">
            {config.label}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ({markets.length})
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-zinc-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        )}
      </button>

      {/* Market grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((market) => (
            <MarketCard key={market.conditionId} market={market} />
          ))}
        </div>

        {/* Show all / collapse button */}
        {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
            >
              {expanded
                ? "Show less"
                : `Show all ${markets.length} markets \u2192`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
