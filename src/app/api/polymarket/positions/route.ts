import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import { ENDPOINTS } from "@/lib/polymarket/contracts";
import type { SessionData } from "@/lib/polymarket/types";
import { z } from "zod/v4";

const querySchema = z.object({
  type: z.enum(["positions", "orders", "trades"]).default("positions"),
});

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ type: searchParams.get("type") ?? "positions" });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const address = session.safeAddress || session.address;

  try {
    switch (parsed.data.type) {
      case "positions": {
        // Fetch positions from Polymarket Data API
        const res = await fetch(
          `${ENDPOINTS.DATA}/positions?user=${address}`,
          { next: { revalidate: 30 } }
        );
        if (!res.ok) {
          return NextResponse.json({ positions: [] });
        }
        const positions = await res.json();
        return NextResponse.json({ positions });
      }

      case "orders": {
        // Fetch open orders from CLOB
        const res = await fetch(
          `${ENDPOINTS.CLOB}/data/orders?maker=${address}&state=LIVE`,
          { next: { revalidate: 10 } }
        );
        if (!res.ok) {
          return NextResponse.json({ orders: [] });
        }
        const orders = await res.json();
        return NextResponse.json({ orders });
      }

      case "trades": {
        // Fetch trade history from CLOB
        const res = await fetch(
          `${ENDPOINTS.CLOB}/data/trades?maker=${address}`,
          { next: { revalidate: 30 } }
        );
        if (!res.ok) {
          return NextResponse.json({ trades: [] });
        }
        const trades = await res.json();
        return NextResponse.json({ trades });
      }
    }
  } catch (error) {
    console.error("Portfolio data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}
