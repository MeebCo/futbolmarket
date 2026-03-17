"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/providers/WalletProvider";
import { shortenAddress } from "@/lib/utils";
import { Wallet, LogOut, ChevronDown, Trophy } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { isConnected, eoaAddress, authMethod, disconnect, openAuthModal } =
    useWallet();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-purple" />
          <span className="text-lg font-bold">
            Meebits <span className="text-purple">Fútbol</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/markets"
            className="text-sm font-medium text-silver hover:text-foreground transition-colors"
          >
            Markets
          </Link>
          {isConnected && (
            <Link
              href="/portfolio"
              className="text-sm font-medium text-silver hover:text-foreground transition-colors"
            >
              Portfolio
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-sm">
                <Wallet className="h-3.5 w-3.5 text-purple" />
                <span className="font-medium tabular-nums">
                  {eoaAddress ? shortenAddress(eoaAddress) : "Connected"}
                </span>
                {authMethod && (
                  <span className="text-[10px] text-silver">
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

          <ThemeToggle />

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
