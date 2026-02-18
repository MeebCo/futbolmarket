"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/providers/WalletProvider";
import { Loader2, Mail } from "lucide-react";

export function EmailLoginForm() {
  const { connectWallet } = useWallet();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      // Dynamic import of magic-sdk to avoid SSR issues
      const { Magic } = await import("magic-sdk");
      const magic = new Magic(
        process.env.NEXT_PUBLIC_MAGIC_API_KEY || "placeholder_key",
        {
          network: {
            rpcUrl:
              process.env.NEXT_PUBLIC_POLYGON_RPC_URL ||
              "https://polygon-rpc.com",
            chainId: 137,
          },
        }
      );

      setSent(true);
      const didToken = await magic.auth.loginWithEmailOTP({ email });

      if (didToken) {
        const userInfo = await magic.user.getInfo();
        const address = userInfo.wallets?.ethereum?.publicAddress;
        if (address) {
          connectWallet(address, "magic");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
      setSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (sent && isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Check your email for a login code...
        </p>
        <p className="text-xs text-zinc-500">{email}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="email"
          className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
        >
          Email address
        </label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !email}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Sign in with Email"
        )}
      </Button>

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
        We&apos;ll send a one-time code to your email. No password needed.
      </p>
    </form>
  );
}
