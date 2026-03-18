import Link from "next/link";
import { Trophy, TrendingUp, Shield, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VIEW_ONLY } from "@/config/site";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 purple-gradient" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-2 rounded-full bg-purple/15 px-4 py-1.5 text-sm font-medium text-purple-tint">
              <Trophy className="h-4 w-4" />
              World Cup 2026 &bull; Champions League
            </div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              {VIEW_ONLY ? (
                <>
                  View the{" "}
                  <span className="text-purple">Beautiful Game</span>{" "}
                  Odds
                </>
              ) : (
                <>
                  Bet on the{" "}
                  <span className="text-purple">Beautiful Game</span>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-silver">
              {VIEW_ONLY
                ? "Browse prediction market odds for the World Cup 2026 and Champions League. Match outcomes, tournament winners, and more — powered by Polymarket."
                : "Trade prediction markets for the World Cup 2026 and Champions League. Buy and sell shares on match outcomes, tournament winners, and more — powered by Polymarket."}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/markets">
                <Button size="lg">
                  <TrendingUp className="h-5 w-5" />
                  Browse Markets
                </Button>
              </Link>
              <Link href="/markets">
                <Button variant="outline" size="lg">
                  {VIEW_ONLY ? "View Odds" : "How It Works"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple/15">
              <TrendingUp className="h-6 w-6 text-purple" />
            </div>
            <h3 className="text-lg font-semibold">Real-Time Odds</h3>
            <p className="mt-2 text-sm text-silver">
              Live orderbook and price data from Polymarket&apos;s CLOB exchange.
              {VIEW_ONLY
                ? " View the best available prices."
                : " Trade at the best available prices."}
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple/15">
              {VIEW_ONLY ? (
                <Eye className="h-6 w-6 text-purple" />
              ) : (
                <Shield className="h-6 w-6 text-purple" />
              )}
            </div>
            <h3 className="text-lg font-semibold">
              {VIEW_ONLY ? "Odds Only" : "Safe Wallet Trading"}
            </h3>
            <p className="mt-2 text-sm text-silver">
              {VIEW_ONLY
                ? "This is a view-only experience. No sign-in or trading required."
                : "All trades use Gnosis Safe wallets for consistent, secure experience. Connect via MetaMask or email."}
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple/15">
              <Zap className="h-6 w-6 text-purple" />
            </div>
            <h3 className="text-lg font-semibold">Live Data</h3>
            <p className="mt-2 text-sm text-silver">
              {VIEW_ONLY
                ? "Markets settle to $1 or $0 based on real outcomes. Odds update in real time."
                : "Markets settle to $1 or $0 based on real outcomes. Trade USDC on Polygon for fast, low-cost transactions."}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">
            {VIEW_ONLY ? "Ready to view the odds?" : "Ready to start trading?"}
          </h2>
          <p className="mt-2 text-silver">
            {VIEW_ONLY
              ? "Explore football prediction market odds now."
              : "Explore football prediction markets now."}
          </p>
          <Link href="/markets" className="mt-6 inline-block">
            <Button size="lg">
              <Trophy className="h-5 w-5" />
              View Markets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
