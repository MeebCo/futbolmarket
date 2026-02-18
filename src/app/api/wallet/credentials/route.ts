import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import { ENDPOINTS, POLYGON } from "@/lib/polymarket/contracts";
import type { SessionData } from "@/lib/polymarket/types";
import { z } from "zod/v4";

const deriveSchema = z.object({
  signature: z.string().min(1),
  address: z.string().min(1),
  nonce: z.number().optional(),
  timestamp: z.number().optional(),
});

/**
 * POST: Derive CLOB API credentials from an L1 signature.
 * This calls Polymarket's /auth/derive-api-key endpoint.
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

  const parsed = deriveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    // Forward the L1 auth headers to Polymarket to derive API keys
    const res = await fetch(`${ENDPOINTS.CLOB}/auth/derive-api-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        POLY_ADDRESS: parsed.data.address,
        POLY_SIGNATURE: parsed.data.signature,
        POLY_TIMESTAMP: String(parsed.data.timestamp ?? Math.floor(Date.now() / 1000)),
        POLY_NONCE: String(parsed.data.nonce ?? 0),
      },
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Failed to derive API key:", error);
      return NextResponse.json(
        { error: "Failed to derive API credentials" },
        { status: res.status }
      );
    }

    const creds = await res.json();
    return NextResponse.json(creds);
  } catch (error) {
    console.error("Credential derivation error:", error);
    return NextResponse.json(
      { error: "Failed to derive credentials" },
      { status: 500 }
    );
  }
}

/**
 * GET: Check if user has existing API credentials.
 */
export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // In a production app, you'd store and check credentials
  // For MVP, we indicate they should derive new ones
  return NextResponse.json({ hasCredentials: false });
}
