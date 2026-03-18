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
  Eye,
} from "lucide-react";
import { VIEW_ONLY } from "@/config/site";

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
    enabled: !VIEW_ONLY && isConnected,
    refetchInterval: 30000,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["portfolio", "orders"],
    queryFn: () => fetchPortfolioData("orders"),
    enabled: !VIEW_ONLY && isConnected,
    refetchInterval: 15000,
  });

  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ["portfolio", "trades"],
    queryFn: () => fetchPortfolioData("trades"),
    enabled: !VIEW_ONLY && isConnected,
  });

  const handleCancelOrder = async (orderId: string) => {
    try {
      // In production, this would call ClobClient.cancelOrder()
      alert(`Cancel order ${orderId} - requires CLOB client integration`);
    } catch {
      alert("Failed to cancel order");
    }
  };

  if (VIEW_ONLY) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <Eye className="h-12 w-12 text-silver mb-4" />
          <h1 className="text-2xl font-bold">View Only Mode</h1>
          <p className="mt-2 text-silver max-w-md">
            This is an odds-only view. Portfolio, sign-in, and trading are
            disabled. Browse markets to see the odds.
          </p>
          <Link href="/markets" className="mt-6">
            <Button size="lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Browse Markets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <Wallet className="h-12 w-12 text-silver mb-4" />
          <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
          <p className="mt-2 text-silver max-w-md">
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
          className="mb-4 inline-flex items-center text-sm text-silver hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Markets
        </Link>
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-sm text-silver mt-1">
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
              <span className="ml-1 rounded-full bg-purple px-1.5 py-0.5 text-[10px] text-white">
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
