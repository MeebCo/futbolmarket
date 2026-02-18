"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUsd, formatPercent, timeAgo } from "@/lib/utils";
import type { OpenOrder } from "@/lib/polymarket/types";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";

interface OpenOrdersListProps {
  orders: OpenOrder[];
  isLoading?: boolean;
  onCancelOrder?: (orderId: string) => Promise<void>;
}

export function OpenOrdersList({
  orders,
  isLoading,
  onCancelOrder,
}: OpenOrdersListProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (orderId: string) => {
    if (!onCancelOrder) return;
    setCancellingId(orderId);
    try {
      await onCancelOrder(orderId);
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No open orders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-6 gap-2 px-4 text-[10px] font-medium text-zinc-500 uppercase">
        <span className="col-span-2">Market</span>
        <span>Side</span>
        <span>Price</span>
        <span>Size</span>
        <span className="text-right">Action</span>
      </div>

      {orders.map((order) => {
        const isBuy = order.side === "BUY";
        const fillPercent =
          parseFloat(order.original_size) > 0
            ? (parseFloat(order.size_matched) /
                parseFloat(order.original_size)) *
              100
            : 0;

        return (
          <Card key={order.id}>
            <CardContent className="p-3">
              <div className="grid grid-cols-6 gap-2 items-center">
                <div className="col-span-2 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {order.marketQuestion || order.market}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {timeAgo(order.created_at)}
                  </p>
                </div>
                <div>
                  <Badge
                    variant={isBuy ? "default" : "destructive"}
                    className="text-[10px] px-1.5"
                  >
                    {order.side}
                  </Badge>
                </div>
                <span className="text-xs font-medium tabular-nums">
                  {formatPercent(parseFloat(order.price))}
                </span>
                <div>
                  <span className="text-xs font-medium tabular-nums">
                    {formatUsd(parseFloat(order.original_size))}
                  </span>
                  {fillPercent > 0 && (
                    <p className="text-[10px] text-emerald-600">
                      {fillPercent.toFixed(0)}% filled
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCancel(order.id)}
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
