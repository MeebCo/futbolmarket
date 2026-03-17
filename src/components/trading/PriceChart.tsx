"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { PriceHistoryPoint } from "@/lib/polymarket/types";

interface PriceChartProps {
  data: PriceHistoryPoint[];
  isLoading?: boolean;
}

function formatTimestamp(t: number): string {
  return new Date(t * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function PriceChart({ data, isLoading }: PriceChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Price History</h3>
        <div className="h-48 animate-pulse rounded bg-surface" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Price History</h3>
        <div className="flex h-48 items-center justify-center text-sm text-silver">
          No price history available
        </div>
      </div>
    );
  }

  const chartData = data.map((point) => ({
    time: point.t,
    price: point.p * 100,
  }));

  const currentPrice = chartData[chartData.length - 1]?.price ?? 0;
  const startPrice = chartData[0]?.price ?? 0;
  const isPositive = currentPrice >= startPrice;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Price History</h3>
        <span
          className={`text-sm font-medium ${isPositive ? "text-buy-green" : "text-sell-red"}`}
        >
          {currentPrice.toFixed(1)}¢
        </span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#34D399" : "#F87171"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#34D399" : "#F87171"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e1050"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tickFormatter={formatTimestamp}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              tickFormatter={(v: number) => `${v.toFixed(0)}¢`}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0D0535",
                border: "1px solid #1e1050",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#F8F7FF",
              }}
              formatter={(value) => [
                `${Number(value ?? 0).toFixed(1)}¢`,
                "Price",
              ]}
              labelFormatter={(label) =>
                new Date(Number(label) * 1000).toLocaleString()
              }
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#34D399" : "#F87171"}
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
