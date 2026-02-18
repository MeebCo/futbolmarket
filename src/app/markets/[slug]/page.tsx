"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { OrderBook } from "@/components/trading/OrderBook";
import { PriceChart } from "@/components/trading/PriceChart";
import { OutcomeSelector } from "@/components/trading/OutcomeSelector";
import { BetSlip } from "@/components/trading/BetSlip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactNumber, formatPercent } from "@/lib/utils";
import type { MarketSummary, OrderBookData, PriceHistoryPoint } from "@/lib/polymarket/types";
import { ArrowLeft, BarChart3, Clock, Droplets } from "lucide-react";

interface MarketDetailResponse {
  market: MarketSummary;
  orderbook: OrderBookData | null;
  priceHistory: PriceHistoryPoint[];
}

async function fetchMarketDetail(
  slug: string
): Promise<MarketDetailResponse> {
  const res = await fetch(`/api/polymarket/market/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch market");
  return res.json();
}

export default function MarketDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["market", slug],
    queryFn: () => fetchMarketDetail(slug),
    enabled: !!slug,
    refetchInterval: 15000,
  });

  const market = data?.market;
  const orderbook = data?.orderbook;
  const priceHistory = data?.priceHistory ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Market not found</h1>
        <p className="mt-2 text-zinc-500">
          This market may not exist or may have been removed.
        </p>
        <Link
          href="/markets"
          className="mt-4 inline-flex items-center text-emerald-600 hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to markets
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/markets"
        className="mb-6 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to markets
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market header */}
          <div>
            <div className="flex items-start gap-4">
              {market.image && (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={market.image}
                    alt={market.question}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold leading-tight sm:text-2xl">
                  {market.question}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3.5 w-3.5" />
                    {formatCompactNumber(market.volume)} volume
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3.5 w-3.5" />
                    {formatCompactNumber(market.liquidity)} liquidity
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Ends {new Date(market.endDate).toLocaleDateString()}
                  </span>
                  {market.active && !market.closed && (
                    <Badge variant="live">Live</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {market.description && (
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {market.description}
              </p>
            )}
          </div>

          {/* Price chart */}
          <PriceChart data={priceHistory} />

          {/* Order book */}
          <OrderBook data={orderbook ?? null} />
        </div>

        {/* Sidebar - trading */}
        <div className="space-y-6">
          {/* Outcome selector */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <OutcomeSelector
              outcomes={market.outcomes}
              prices={market.outcomePrices}
              selected={selectedOutcome}
              onSelect={setSelectedOutcome}
            />
          </div>

          {/* Bet slip */}
          {selectedOutcome !== null && (
            <BetSlip
              market={market}
              selectedOutcome={selectedOutcome}
              tokenId={market.clobTokenIds[selectedOutcome] ?? ""}
            />
          )}

          {/* Market stats */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-semibold mb-3">Market Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Total Volume
                </dt>
                <dd className="font-medium">
                  {formatCompactNumber(market.volume)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">24h Volume</dt>
                <dd className="font-medium">
                  {formatCompactNumber(market.volume24hr)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Liquidity</dt>
                <dd className="font-medium">
                  {formatCompactNumber(market.liquidity)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Spread</dt>
                <dd className="font-medium">
                  {(market.spread * 100).toFixed(1)}¢
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Best Bid</dt>
                <dd className="font-medium text-emerald-600">
                  {formatPercent(market.bestBid)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Best Ask</dt>
                <dd className="font-medium text-red-500">
                  {formatPercent(market.bestAsk)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Min Size</dt>
                <dd className="font-medium">${market.orderMinSize}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Tick Size</dt>
                <dd className="font-medium">
                  {(market.orderPriceMinTickSize * 100).toFixed(1)}¢
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
