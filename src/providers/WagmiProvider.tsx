"use client";

import { WagmiProvider as WagmiProviderBase } from "wagmi";
import { wagmiConfig } from "@/config/wagmi";
import type { ReactNode } from "react";

export function WagmiProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProviderBase config={wagmiConfig}>{children}</WagmiProviderBase>
  );
}
