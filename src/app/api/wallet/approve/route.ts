import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import { CONTRACTS } from "@/lib/polymarket/contracts";
import type { SessionData } from "@/lib/polymarket/types";

/**
 * GET: Check token approval status for trading.
 * Returns which approvals are needed for USDC and CTF tokens.
 */
export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Return the required approvals for trading
  return NextResponse.json({
    approvals: [
      {
        token: "USDC.e",
        address: CONTRACTS.USDCe,
        spender: CONTRACTS.CTF_EXCHANGE,
        description: "Approve USDC.e for CTF Exchange",
      },
      {
        token: "CTF",
        address: CONTRACTS.CTF,
        spender: CONTRACTS.CTF_EXCHANGE,
        description: "Approve CTF tokens for trading",
        isERC1155: true,
      },
      {
        token: "USDC.e (NegRisk)",
        address: CONTRACTS.USDCe,
        spender: CONTRACTS.NEG_RISK_CTF_EXCHANGE,
        description: "Approve USDC.e for Neg Risk Exchange",
      },
      {
        token: "CTF (NegRisk)",
        address: CONTRACTS.CTF,
        spender: CONTRACTS.NEG_RISK_CTF_EXCHANGE,
        description: "Approve CTF tokens for Neg Risk trading",
        isERC1155: true,
      },
    ],
  });
}
