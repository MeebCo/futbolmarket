"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  useAccount,
  useDisconnect,
} from "wagmi";
import type { AuthMethod } from "@/lib/polymarket/types";

interface WalletContextType {
  isConnected: boolean;
  authMethod: AuthMethod;
  eoaAddress: string | null;
  safeAddress: string | null;
  tradingReady: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  connectWallet: (address: string, method: AuthMethod) => void;
  disconnect: () => void;
  setSafeAddress: (address: string) => void;
  setTradingReady: (ready: boolean) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [magicAddress, setMagicAddress] = useState<string | null>(null);
  const [safeAddress, setSafeAddressState] = useState<string | null>(null);
  const [tradingReady, setTradingReadyState] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Derive connection state from wagmi or magic
  const isConnected = wagmiConnected || !!magicAddress;
  const eoaAddress = wagmiAddress ?? magicAddress ?? null;

  // Sync wagmi connection to session
  useEffect(() => {
    if (wagmiConnected && wagmiAddress) {
      setAuthMethod("wallet");
      fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wagmiAddress, authMethod: "wallet" }),
      }).catch(console.error);
    }
  }, [wagmiConnected, wagmiAddress]);

  // Restore session on mount
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((session) => {
        if (session.isLoggedIn && session.authMethod === "magic" && session.address) {
          setMagicAddress(session.address);
          setAuthMethod("magic");
        }
        if (session.safeAddress) {
          setSafeAddressState(session.safeAddress);
        }
      })
      .catch(() => {});
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const connectWallet = useCallback(
    (address: string, method: AuthMethod) => {
      if (method === "magic") {
        setMagicAddress(address);
      }
      setAuthMethod(method);
      setIsAuthModalOpen(false);

      fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, authMethod: method }),
      }).catch(console.error);
    },
    []
  );

  const disconnect = useCallback(() => {
    if (authMethod === "wallet") {
      wagmiDisconnect();
    }
    setAuthMethod(null);
    setMagicAddress(null);
    setSafeAddressState(null);
    setTradingReadyState(false);

    fetch("/api/auth/session", { method: "DELETE" }).catch(console.error);
  }, [authMethod, wagmiDisconnect]);

  const setSafeAddress = useCallback((address: string) => {
    setSafeAddressState(address);
  }, []);

  const setTradingReady = useCallback((ready: boolean) => {
    setTradingReadyState(ready);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        authMethod,
        eoaAddress,
        safeAddress,
        tradingReady,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        connectWallet,
        disconnect,
        setSafeAddress,
        setTradingReady,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
