"use client";

import { useConnect, useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/providers/WalletProvider";
import { Loader2 } from "lucide-react";

export function ConnectWalletButton() {
  const { connectors, connect, isPending, error } = useConnect();
  const { isConnected } = useAccount();
  const { closeAuthModal } = useWallet();

  if (isConnected) {
    closeAuthModal();
    return null;
  }

  return (
    <div className="space-y-3">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          variant="outline"
          className="w-full justify-start gap-3 h-12"
          onClick={() => connect({ connector })}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          )}
          <span className="font-medium">
            {connector.name === "Injected" ? "MetaMask" : connector.name}
          </span>
        </Button>
      ))}

      {error && (
        <p className="text-xs text-red-500 text-center">
          {error.message.includes("rejected")
            ? "Connection rejected by user"
            : "Failed to connect. Please try again."}
        </p>
      )}

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
        Connect with MetaMask, WalletConnect, or any injected wallet on Polygon.
      </p>
    </div>
  );
}
