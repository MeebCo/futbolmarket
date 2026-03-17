"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function MarketDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-sell-red mb-4" />
      <h2 className="text-xl font-bold">Failed to load market</h2>
      <p className="mt-2 text-sm text-silver max-w-md mx-auto">
        {error.message || "We couldn't load this market. It may not exist or there may be a network issue."}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/markets">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Back to Markets
          </Button>
        </Link>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
