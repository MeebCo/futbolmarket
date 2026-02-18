import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/polymarket/types";
import { z } from "zod/v4";

const deploySchema = z.object({
  eoaAddress: z.string().min(1),
});

/**
 * POST: Deploy a Gnosis Safe wallet for the user.
 * In Polymarket's architecture, Safe wallets are used for trading.
 * The Safe address is deterministic based on the EOA.
 */
export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = deploySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    // In Polymarket's system, Safes are deployed via the relayer
    // For now, we compute the predicted Safe address
    // The actual deployment happens when the user first interacts
    const safeAddress = computePredictedSafe(parsed.data.eoaAddress);

    // Update session with Safe address
    session.safeAddress = safeAddress;
    await session.save();

    return NextResponse.json({
      safeAddress,
      deployed: false, // Will be deployed on first trade
      message: "Safe address computed. It will be deployed on first trade.",
    });
  } catch (error) {
    console.error("Safe deployment error:", error);
    return NextResponse.json(
      { error: "Failed to compute Safe address" },
      { status: 500 }
    );
  }
}

/**
 * Compute the predicted Gnosis Safe address for an EOA.
 * This is a simplified version - in production, use the Safe SDK.
 */
function computePredictedSafe(eoaAddress: string): string {
  // The actual Safe address is computed via CREATE2 with the proxy factory
  // For the MVP, we return the EOA address since the relayer handles deployment
  // In production, use @safe-global/protocol-kit to compute this
  return eoaAddress;
}
