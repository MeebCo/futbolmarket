"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/providers/WalletProvider";
import { shortenAddress } from "@/lib/utils";
import { Wallet, LogOut, ChevronDown, Trophy } from "lucide-react";

export function Header() {
  const { isConnected, eoaAddress, authMethod, disconnect, openAuthModal } =
    useWallet();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold">
            Futbol<span className="text-emerald-600">Market</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/markets"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            Markets
          </Link>
          {isConnected && (
            <Link
              href="/portfolio"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              Portfolio
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-sm dark:bg-zinc-800">
                <Wallet className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-medium tabular-nums">
                  {eoaAddress ? shortenAddress(eoaAddress) : "Connected"}
                </span>
                {authMethod && (
                  <span className="text-[10px] text-zinc-500">
                    ({authMethod})
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={disconnect}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={openAuthModal} size="sm">
              <Wallet className="h-4 w-4" />
              Connect
            </Button>
          )}

          {/* Mobile nav */}
          <Link href="/markets" className="md:hidden">
            <Button variant="ghost" size="sm">
              Markets
              <ChevronDown className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
