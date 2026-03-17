"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TradeConfirmation } from "./TradeConfirmation";
import { useWallet } from "@/providers/WalletProvider";
import { formatUsd } from "@/lib/utils";
import type { MarketSummary, OrderSide } from "@/lib/polymarket/types";

interface BetSlipProps {
  market: MarketSummary;
  selectedOutcome: number;
  tokenId: string;
}

export function BetSlip({ market, selectedOutcome, tokenId }: BetSlipProps) {
  const { isConnected, tradingReady, openAuthModal } = useWallet();
  const [side, setSide] = useState<OrderSide>("BUY");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(
    () => (market.outcomePrices[selectedOutcome] ?? 0.5).toFixed(2)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const outcome = market.outcomes[selectedOutcome] ?? "Yes";
  const numPrice = parseFloat(price) || 0;
  const numAmount = parseFloat(amount) || 0;
  const shares = numPrice > 0 ? numAmount / numPrice : 0;
  const potentialPayout = shares * 1;
  const potentialProfit = potentialPayout - numAmount;

  const canSubmit =
    isConnected &&
    numAmount >= market.orderMinSize &&
    numPrice > 0 &&
    numPrice < 1;

  const handleSubmitClick = () => {
    if (!isConnected) {
      openAuthModal();
      return;
    }
    if (!canSubmit) return;
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!tradingReady) {
      alert("Trading setup is not complete. Please complete onboarding first.");
      setShowConfirmation(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/polymarket/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenId,
          side,
          price: numPrice,
          size: numAmount,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Order failed");
      }

      setAmount("");
      setShowConfirmation(false);
      alert("Order placed successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Order failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Place Order</h3>

        {/* Side toggle */}
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface p-1 mb-4">
          <button
            onClick={() => setSide("BUY")}
            className={`rounded-md py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              side === "BUY"
                ? "bg-buy-green text-white"
                : "text-silver hover:text-foreground"
            }`}
          >
            Buy {outcome}
          </button>
          <button
            onClick={() => setSide("SELL")}
            className={`rounded-md py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              side === "SELL"
                ? "bg-sell-red text-white"
                : "text-silver hover:text-foreground"
            }`}
          >
            Sell {outcome}
          </button>
        </div>

        <div className="space-y-3">
          {/* Price input */}
          <div>
            <label className="text-xs font-medium text-silver">
              Price (probability)
            </label>
            <div className="relative mt-1">
              <Input
                type="number"
                min={0.01}
                max={0.99}
                step={market.orderPriceMinTickSize || 0.01}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-silver">
                = {(numPrice * 100).toFixed(0)}¢
              </span>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-xs font-medium text-silver">
              Amount (USDC)
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-silver">
                $
              </span>
              <Input
                type="number"
                min={market.orderMinSize}
                step={0.01}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                placeholder={`Min ${market.orderMinSize}`}
              />
            </div>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-1.5">
            {[5, 10, 25, 50, 100].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(String(val))}
                className="flex-1 rounded-md border border-border py-1 text-xs font-medium text-silver hover:bg-surface cursor-pointer transition-colors"
              >
                ${val}
              </button>
            ))}
          </div>

          {/* Summary */}
          {numAmount > 0 && (
            <div className="rounded-lg bg-surface p-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-silver">Shares</span>
                <span className="font-medium tabular-nums">
                  {shares.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-silver">Avg price</span>
                <span className="font-medium tabular-nums">
                  {(numPrice * 100).toFixed(1)}¢
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-silver">Potential payout</span>
                <span className="font-medium tabular-nums text-buy-green">
                  {formatUsd(potentialPayout)}
                </span>
              </div>
              <div className="flex justify-between text-xs border-t border-border pt-1.5">
                <span className="text-silver">Potential profit</span>
                <span
                  className={`font-semibold tabular-nums ${potentialProfit >= 0 ? "text-buy-green" : "text-sell-red"}`}
                >
                  {potentialProfit >= 0 ? "+" : ""}
                  {formatUsd(potentialProfit)}
                </span>
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            className="w-full"
            variant={side === "BUY" ? "buy" : "sell"}
            size="lg"
            disabled={!isConnected ? false : !canSubmit}
            onClick={handleSubmitClick}
          >
            {!isConnected
              ? "Connect Wallet"
              : `${side === "BUY" ? "Buy" : "Sell"} ${outcome}`}
          </Button>

          {!isConnected && (
            <p className="text-[11px] text-center text-silver">
              Connect your wallet to start trading
            </p>
          )}
        </div>
      </div>

      {/* Confirmation dialog */}
      <TradeConfirmation
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
        side={side}
        outcome={outcome}
        price={numPrice}
        amount={numAmount}
        shares={shares}
        potentialPayout={potentialPayout}
        marketQuestion={market.question}
      />
    </>
  );
}
