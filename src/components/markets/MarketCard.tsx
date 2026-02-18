"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber, formatPercent } from "@/lib/utils";
import type { MarketSummary } from "@/lib/polymarket/types";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface MarketCardProps {
  market: MarketSummary;
}

export function MarketCard({ market }: MarketCardProps) {
  const yesPrice = market.outcomePrices[0] ?? 0;
  const noPrice = market.outcomePrices[1] ?? 0;
  const priceChange = market.oneDayPriceChange;
  const isUp = priceChange >= 0;

  return (
    <Link href={`/markets/${market.slug}`}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            {market.image && (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={market.image}
                  alt={market.question}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {market.question}
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Price display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPercent(yesPrice)}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Yes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-red-500">
                  {formatPercent(noPrice)}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  No
                </span>
              </div>
            </div>

            {/* Change indicator */}
            {priceChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs ${isUp ? "text-emerald-600" : "text-red-500"}`}
              >
                {isUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {isUp ? "+" : ""}
                  {(priceChange * 100).toFixed(1)}% 24h
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <BarChart3 className="h-3 w-3" />
                <span>{formatCompactNumber(market.volume)} vol</span>
              </div>
              {market.active && !market.closed && (
                <Badge variant="live" className="text-[10px] px-1.5 py-0">
                  Live
                </Badge>
              )}
              {market.closed && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Closed
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
