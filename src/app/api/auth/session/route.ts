import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, defaultSession } from "@/lib/session";
import type { SessionData } from "@/lib/polymarket/types";
import { z } from "zod/v4";

const loginSchema = z.object({
  address: z.string().min(1),
  authMethod: z.enum(["wallet", "magic"]),
  safeAddress: z.string().optional(),
});

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (!session.isLoggedIn) {
    return NextResponse.json(defaultSession);
  }

  return NextResponse.json({
    isLoggedIn: session.isLoggedIn,
    address: session.address,
    authMethod: session.authMethod,
    safeAddress: session.safeAddress,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  session.isLoggedIn = true;
  session.address = parsed.data.address;
  session.authMethod = parsed.data.authMethod;
  if (parsed.data.safeAddress) {
    session.safeAddress = parsed.data.safeAddress;
  }
  await session.save();

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  session.destroy();
  return NextResponse.json(defaultSession);
}
