import { NextResponse } from "next/server";
import { fetchWorldCupMarkets } from "@/lib/polymarket/gamma";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const markets = await fetchWorldCupMarkets();
    return NextResponse.json({ markets }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch markets:", error);
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 }
    );
  }
}
