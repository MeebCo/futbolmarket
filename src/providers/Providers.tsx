"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { WagmiProvider } from "./WagmiProvider";
import { WalletProvider } from "./WalletProvider";
import { TradingProvider } from "./TradingProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider>
      <QueryProvider>
        <WalletProvider>
          <TradingProvider>
            <ToastProvider>
              {children}
              <AuthModal />
              <ToastViewport />
            </ToastProvider>
          </TradingProvider>
        </WalletProvider>
      </QueryProvider>
    </WagmiProvider>
  );
}
