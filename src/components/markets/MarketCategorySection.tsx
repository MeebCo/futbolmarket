"use client";

import { useState } from "react";
import { MarketCard } from "./MarketCard";
import { ChevronDown, ChevronUp, Trophy, Users, Plane, HelpCircle, Swords, BarChart3, Shield } from "lucide-react";
import type { MarketSummary, MarketCategory } from "@/lib/polymarket/types";

const CATEGORY_CONFIG: Record<
  MarketCategory,
  { label: string; icon: typeof Trophy }
> = {
  winner: { label: "Tournament Winner", icon: Trophy },
  group: { label: "Group Winner", icon: Users },
  qualification: { label: "Qualification", icon: Plane },
  "cl-winner": { label: "UCL Winner", icon: Trophy },
  "cl-match": { label: "UCL Matches", icon: Swords },
  "cl-knockout": { label: "UCL Knockout", icon: Shield },
  "cl-stats": { label: "UCL Player Stats", icon: BarChart3 },
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
    <section className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3 bg-surface hover:bg-card-bg transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-purple" />
          <span className="font-semibold text-sm">
            {config.label}
          </span>
          <span className="text-xs text-silver">
            ({markets.length})
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-silver" />
        ) : (
          <ChevronDown className="h-4 w-4 text-silver" />
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
              className="text-sm font-medium text-purple hover:text-purple-dark transition-colors cursor-pointer"
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
