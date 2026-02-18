"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUsd, formatPercent } from "@/lib/utils";
import type { Position } from "@/lib/polymarket/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PositionsListProps {
  positions: Position[];
  isLoading?: boolean;
}

export function PositionsList({ positions, isLoading }: PositionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No open positions. Browse markets to start trading.
        </p>
        <Link
          href="/markets"
          className="mt-2 text-sm text-emerald-600 hover:underline"
        >
          Browse Markets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {positions.map((pos, i) => {
        const isProfitable = pos.pnl >= 0;
        return (
          <Link key={`${pos.conditionId}-${i}`} href={`/markets/${pos.marketSlug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium truncate">
                      {pos.marketQuestion}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          pos.outcome === "Yes" ? "default" : "destructive"
                        }
                        className="text-[10px]"
                      >
                        {pos.outcome}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        {pos.size} shares @ {formatPercent(parseFloat(pos.avgPrice))}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium tabular-nums">
                      {formatUsd(pos.currentPrice * parseFloat(pos.size))}
                    </p>
                    <div
                      className={`flex items-center justify-end gap-0.5 text-xs ${isProfitable ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {isProfitable ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="tabular-nums">
                        {isProfitable ? "+" : ""}
                        {formatUsd(pos.pnl)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
