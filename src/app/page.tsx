import Link from "next/link";
import { Trophy, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Trophy className="h-4 w-4" />
              World Cup 2026
            </div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              Bet on the{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Beautiful Game
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Trade prediction markets for FIFA World Cup 2026. Buy and sell
              shares on match outcomes, tournament winners, and more — powered by
              Polymarket.
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
                  How It Works
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
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold">Real-Time Markets</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Live orderbook and price data from Polymarket&apos;s CLOB exchange.
              Trade at the best available prices.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold">Safe Wallet Trading</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              All trades use Gnosis Safe wallets for consistent, secure
              experience. Connect via MetaMask or email.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold">Instant Settlement</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Markets settle to $1 or $0 based on real outcomes. Trade USDC
              on Polygon for fast, low-cost transactions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">Ready to start trading?</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Explore World Cup 2026 prediction markets now.
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
