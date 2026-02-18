"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatUsd, formatPercent } from "@/lib/utils";
import type { OrderSide } from "@/lib/polymarket/types";
import { AlertTriangle, Loader2 } from "lucide-react";

interface TradeConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  side: OrderSide;
  outcome: string;
  price: number;
  amount: number;
  shares: number;
  potentialPayout: number;
  marketQuestion: string;
}

export function TradeConfirmation({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  side,
  outcome,
  price,
  amount,
  shares,
  potentialPayout,
  marketQuestion,
}: TradeConfirmationProps) {
  const potentialProfit = potentialPayout - amount;
  const isBuy = side === "BUY";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Order</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {marketQuestion}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order details */}
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Action</span>
              <span
                className={`font-semibold ${isBuy ? "text-emerald-600" : "text-red-500"}`}
              >
                {side} {outcome}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Price</span>
              <span className="font-medium">{formatPercent(price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Amount</span>
              <span className="font-medium">{formatUsd(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Shares</span>
              <span className="font-medium tabular-nums">
                {shares.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-zinc-200 dark:border-zinc-700 pt-2">
              <span className="text-zinc-500">Potential Payout</span>
              <span className="font-semibold text-emerald-600">
                {formatUsd(potentialPayout)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Potential Profit</span>
              <span
                className={`font-semibold ${potentialProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}
              >
                {potentialProfit >= 0 ? "+" : ""}
                {formatUsd(potentialProfit)}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-xs text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              This is a limit order. It will be placed on the orderbook and
              filled when the market price reaches your specified price. Orders
              can be cancelled anytime.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant={isBuy ? "buy" : "sell"}
              className="flex-1"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing...
                </>
              ) : (
                `Confirm ${side}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
