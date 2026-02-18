import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { createLocalBuilderConfig } from "@/lib/polymarket/builder-config";

const signRequestSchema = z.object({
  method: z.string().min(1),
  path: z.string().min(1),
  body: z.string().optional(),
  timestamp: z.number().optional(),
});

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  // Parse and validate input
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = signRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }

  // Create builder config with server-side credentials
  const builderConfig = createLocalBuilderConfig();
  if (!builderConfig || !builderConfig.isValid()) {
    return NextResponse.json(
      { error: "Builder credentials not configured" },
      { status: 503 }
    );
  }

  try {
    const headers = await builderConfig.generateBuilderHeaders(
      parsed.data.method,
      parsed.data.path,
      parsed.data.body,
      parsed.data.timestamp
    );

    if (!headers) {
      return NextResponse.json(
        { error: "Failed to generate headers" },
        { status: 500 }
      );
    }

    return NextResponse.json({ headers });
  } catch (error) {
    console.error("HMAC signing error:", error);
    return NextResponse.json(
      { error: "Signing failed" },
      { status: 500 }
    );
  }
}
