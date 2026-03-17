"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUsd, formatPercent, timeAgo } from "@/lib/utils";
import type { TradeRecord } from "@/lib/polymarket/types";

interface TradeHistoryProps {
  trades: TradeRecord[];
  isLoading?: boolean;
}

export function TradeHistory({ trades, isLoading }: TradeHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-silver">
          No trade history yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-5 gap-2 px-4 text-[10px] font-medium text-silver uppercase">
        <span className="col-span-2">Market</span>
        <span>Side</span>
        <span>Price</span>
        <span className="text-right">Size</span>
      </div>

      {trades.map((trade) => {
        const isBuy = trade.side === "BUY";
        return (
          <Card key={trade.id}>
            <CardContent className="p-3">
              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="col-span-2 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {trade.marketQuestion || trade.market}
                  </p>
                  <p className="text-[10px] text-silver">
                    {timeAgo(trade.match_time)}
                  </p>
                </div>
                <div>
                  <Badge
                    variant={isBuy ? "default" : "destructive"}
                    className="text-[10px] px-1.5"
                  >
                    {trade.side}
                  </Badge>
                </div>
                <span className="text-xs font-medium tabular-nums">
                  {formatPercent(parseFloat(trade.price))}
                </span>
                <span className="text-xs font-medium tabular-nums text-right">
                  {formatUsd(parseFloat(trade.size))}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
