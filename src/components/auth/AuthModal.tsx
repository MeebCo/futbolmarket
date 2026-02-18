"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { EmailLoginForm } from "./EmailLoginForm";
import { useWallet } from "@/providers/WalletProvider";
import { Wallet, Mail } from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useWallet();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to FutbolMarket</DialogTitle>
          <DialogDescription>
            Connect your wallet or sign in with email to start trading.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallet" className="gap-1.5">
              <Wallet className="h-4 w-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-1.5">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="mt-4">
            <ConnectWalletButton />
          </TabsContent>

          <TabsContent value="email" className="mt-4">
            <EmailLoginForm />
          </TabsContent>
        </Tabs>

        <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-400 mt-2">
          By connecting, you agree to our Terms of Service. All trades are
          settled on Polygon via Polymarket.
        </p>
      </DialogContent>
    </Dialog>
  );
}
