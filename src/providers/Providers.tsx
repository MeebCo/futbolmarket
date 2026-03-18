"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./QueryProvider";
import { WagmiProvider } from "./WagmiProvider";
import { WalletProvider } from "./WalletProvider";
import { TradingProvider } from "./TradingProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { VIEW_ONLY } from "@/config/site";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <WagmiProvider>
        <QueryProvider>
          <WalletProvider>
            <TradingProvider>
              <ToastProvider>
                {children}
                {!VIEW_ONLY && <AuthModal />}
                <ToastViewport />
              </ToastProvider>
            </TradingProvider>
          </WalletProvider>
        </QueryProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
