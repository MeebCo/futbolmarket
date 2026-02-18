import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/polymarket/types";
import { z } from "zod/v4";

const orderSchema = z.object({
  tokenId: z.string().min(1),
  side: z.enum(["BUY", "SELL"]),
  price: z.number().min(0.01).max(0.99),
  size: z.number().min(0),
});

// Rate limiting for order placement
const orderRateLimitMap = new Map<string, number[]>();
const ORDER_RATE_WINDOW = 60 * 1000;
const ORDER_RATE_MAX = 10;

function isOrderRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = orderRateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < ORDER_RATE_WINDOW);
  recent.push(now);
  orderRateLimitMap.set(ip, recent);
  return recent.length > ORDER_RATE_MAX;
}

/**
 * POST: Place an order.
 * In the full implementation, this would:
 * 1. Validate the order against curated market token IDs
 * 2. The client-side ClobClient creates and signs the order
 * 3. The builder headers are added via the /api/polymarket/sign endpoint
 * 4. The order is posted directly to Polymarket CLOB
 *
 * For the MVP architecture, orders are placed client-side via ClobClient.
 * This endpoint serves as a validation/logging layer.
 */
export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isOrderRateLimited(ip)) {
    return NextResponse.json(
      { error: "Order rate limit exceeded. Max 10 orders per minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order parameters", details: parsed.error.issues },
      { status: 400 }
    );
  }

  // In production, validate tokenId against curated World Cup markets
  // For now, accept all valid token IDs

  return NextResponse.json({
    ok: true,
    message: "Order validated. Submit via ClobClient on the client side.",
    order: parsed.data,
  });
}
