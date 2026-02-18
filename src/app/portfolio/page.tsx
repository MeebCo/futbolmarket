"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PositionsList } from "@/components/portfolio/PositionsList";
import { OpenOrdersList } from "@/components/portfolio/OpenOrdersList";
import { TradeHistory } from "@/components/portfolio/TradeHistory";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/providers/WalletProvider";
import Link from "next/link";
import {
  Briefcase,
  ClipboardList,
  History,
  Wallet,
  ArrowLeft,
} from "lucide-react";

async function fetchPortfolioData(type: string) {
  const res = await fetch(`/api/polymarket/positions?type=${type}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function PortfolioPage() {
  const { isConnected, openAuthModal } = useWallet();

  const { data: positionsData, isLoading: positionsLoading } = useQuery({
    queryKey: ["portfolio", "positions"],
    queryFn: () => fetchPortfolioData("positions"),
    enabled: isConnected,
    refetchInterval: 30000,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["portfolio", "orders"],
    queryFn: () => fetchPortfolioData("orders"),
    enabled: isConnected,
    refetchInterval: 15000,
  });

  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ["portfolio", "trades"],
    queryFn: () => fetchPortfolioData("trades"),
    enabled: isConnected,
  });

  const handleCancelOrder = async (orderId: string) => {
    try {
      // In production, this would call ClobClient.cancelOrder()
      alert(`Cancel order ${orderId} - requires CLOB client integration`);
    } catch {
      alert("Failed to cancel order");
    }
  };

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <Wallet className="h-12 w-12 text-zinc-400 mb-4" />
          <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-md">
            Connect your wallet to view your positions, open orders, and trade
            history.
          </p>
          <Button onClick={openAuthModal} size="lg" className="mt-6">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/markets"
          className="mb-4 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Markets
        </Link>
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your positions and orders.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="positions">
        <TabsList className="mb-6">
          <TabsTrigger value="positions" className="gap-1.5">
            <Briefcase className="h-4 w-4" />
            Positions
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-1.5">
            <ClipboardList className="h-4 w-4" />
            Open Orders
            {ordersData?.orders?.length > 0 && (
              <span className="ml-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] text-white">
                {ordersData.orders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <PositionsList
            positions={positionsData?.positions ?? []}
            isLoading={positionsLoading}
          />
        </TabsContent>

        <TabsContent value="orders">
          <OpenOrdersList
            orders={ordersData?.orders ?? []}
            isLoading={ordersLoading}
            onCancelOrder={handleCancelOrder}
          />
        </TabsContent>

        <TabsContent value="history">
          <TradeHistory
            trades={tradesData?.trades ?? []}
            isLoading={tradesLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
