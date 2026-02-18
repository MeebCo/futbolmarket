"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useWallet } from "./WalletProvider";

type OnboardingStep =
  | "idle"
  | "deriving_safe"
  | "checking_credentials"
  | "deriving_credentials"
  | "checking_approvals"
  | "approving_tokens"
  | "ready"
  | "error";

interface TradingContextType {
  onboardingStep: OnboardingStep;
  onboardingError: string | null;
  usdcBalance: string | null;
  startOnboarding: () => Promise<void>;
  isOnboarding: boolean;
}

const TradingContext = createContext<TradingContextType | null>(null);

export function TradingProvider({ children }: { children: ReactNode }) {
  const { isConnected, eoaAddress, setSafeAddress, setTradingReady } =
    useWallet();
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("idle");
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);

  const isOnboarding =
    onboardingStep !== "idle" &&
    onboardingStep !== "ready" &&
    onboardingStep !== "error";

  const startOnboarding = useCallback(async () => {
    if (!eoaAddress) return;

    setOnboardingError(null);

    try {
      // Step 1: Derive Safe address
      setOnboardingStep("deriving_safe");
      const deployRes = await fetch("/api/wallet/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eoaAddress }),
      });

      if (!deployRes.ok) {
        throw new Error("Failed to compute Safe address");
      }

      const { safeAddress } = await deployRes.json();
      setSafeAddress(safeAddress);

      // Step 2: Check/derive CLOB credentials
      setOnboardingStep("checking_credentials");
      const credRes = await fetch("/api/wallet/credentials");
      const { hasCredentials } = await credRes.json();

      if (!hasCredentials) {
        setOnboardingStep("deriving_credentials");
        // In a full implementation, we'd sign an L1 message here
        // and send it to derive API keys. For now, skip.
      }

      // Step 3: Check approvals
      setOnboardingStep("checking_approvals");
      // In a full implementation, check on-chain approval status
      // For now, we assume approvals will be requested on first trade

      // Done
      setOnboardingStep("ready");
      setTradingReady(true);
    } catch (error) {
      console.error("Onboarding error:", error);
      setOnboardingError(
        error instanceof Error ? error.message : "Onboarding failed"
      );
      setOnboardingStep("error");
    }
  }, [eoaAddress, setSafeAddress, setTradingReady]);

  // Auto-start onboarding when connected
  useEffect(() => {
    if (isConnected && eoaAddress && onboardingStep === "idle") {
      startOnboarding();
    }
  }, [isConnected, eoaAddress, onboardingStep, startOnboarding]);

  // Reset on disconnect
  useEffect(() => {
    if (!isConnected) {
      setOnboardingStep("idle");
      setOnboardingError(null);
      setUsdcBalance(null);
    }
  }, [isConnected]);

  return (
    <TradingContext.Provider
      value={{
        onboardingStep,
        onboardingError,
        usdcBalance,
        startOnboarding,
        isOnboarding,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTrading must be used within a TradingProvider");
  }
  return context;
}
