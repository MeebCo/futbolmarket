import { NextRequest, NextResponse } from "next/server";
import {
  fetchMarketBySlug,
  fetchOrderBook,
  fetchPriceHistory,
  parseMarket,
} from "@/lib/polymarket/gamma";
import { z } from "zod/v4";

const paramsSchema = z.object({
  slug: z.string().min(1),
});

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;

  const parsed = paramsSchema.safeParse(resolvedParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid market slug" },
      { status: 400 }
    );
  }

  try {
    const market = await fetchMarketBySlug(parsed.data.slug);
    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    const summary = parseMarket(market);

    // Fetch orderbook for the first token
    let orderbook = null;
    let priceHistory: Array<{ t: number; p: number }> = [];
    if (summary.clobTokenIds.length > 0) {
      const [ob, ph] = await Promise.all([
        fetchOrderBook(summary.clobTokenIds[0]),
        fetchPriceHistory(summary.clobTokenIds[0]),
      ]);
      orderbook = ob;
      priceHistory = ph;
    }

    return NextResponse.json(
      {
        market: summary,
        orderbook,
        priceHistory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch market:", error);
    return NextResponse.json(
      { error: "Failed to fetch market" },
      { status: 500 }
    );
  }
}
