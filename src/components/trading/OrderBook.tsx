"use client";

import type { OrderBookData } from "@/lib/polymarket/types";

interface OrderBookProps {
  data: OrderBookData | null;
  isLoading?: boolean;
}

function formatSize(size: string): string {
  const n = parseFloat(size);
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toFixed(0);
}

export function OrderBook({ data, isLoading }: OrderBookProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Order Book</h3>
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-5 rounded bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  const bids = data?.bids?.slice(0, 8) ?? [];
  const asks = data?.asks?.slice(0, 8) ?? [];

  const maxBidSize = Math.max(
    ...bids.map((b) => parseFloat(b.size)),
    1
  );
  const maxAskSize = Math.max(
    ...asks.map((a) => parseFloat(a.size)),
    1
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Order Book</h3>
        {data && (
          <span className="text-xs text-silver">
            Spread: {(parseFloat(String(data.spread || 0)) * 100).toFixed(1)}¢
          </span>
        )}
      </div>

      {/* Header */}
      <div className="grid grid-cols-2 gap-1 text-[10px] font-medium text-silver mb-1 px-1">
        <div className="flex justify-between">
          <span>Size</span>
          <span>Bid</span>
        </div>
        <div className="flex justify-between">
          <span>Ask</span>
          <span>Size</span>
        </div>
      </div>

      {/* Book rows */}
      <div className="space-y-0.5">
        {Array.from({ length: Math.max(bids.length, asks.length, 1) }).map(
          (_, i) => {
            const bid = bids[i];
            const ask = asks[i];
            return (
              <div key={i} className="grid grid-cols-2 gap-1 text-xs">
                {/* Bid side */}
                <div className="relative flex justify-between items-center px-1 py-0.5 rounded-l">
                  {bid && (
                    <div
                      className="absolute inset-y-0 right-0 bg-buy-green/15 rounded-l"
                      style={{
                        width: `${(parseFloat(bid.size) / maxBidSize) * 100}%`,
                      }}
                    />
                  )}
                  <span className="relative z-10 text-silver tabular-nums">
                    {bid ? formatSize(bid.size) : ""}
                  </span>
                  <span className="relative z-10 font-medium text-buy-green tabular-nums">
                    {bid ? `${(parseFloat(bid.price) * 100).toFixed(1)}¢` : ""}
                  </span>
                </div>
                {/* Ask side */}
                <div className="relative flex justify-between items-center px-1 py-0.5 rounded-r">
                  {ask && (
                    <div
                      className="absolute inset-y-0 left-0 bg-sell-red/15 rounded-r"
                      style={{
                        width: `${(parseFloat(ask.size) / maxAskSize) * 100}%`,
                      }}
                    />
                  )}
                  <span className="relative z-10 font-medium text-sell-red tabular-nums">
                    {ask ? `${(parseFloat(ask.price) * 100).toFixed(1)}¢` : ""}
                  </span>
                  <span className="relative z-10 text-silver tabular-nums">
                    {ask ? formatSize(ask.size) : ""}
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
