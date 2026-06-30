import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  if (entry.count > MAX_ATTEMPTS) return true;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const { email, password } = await req.json();

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json({ error: "Admin credentials not configured on this server." }, { status: 500 });
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  // consistent session token based on the password — changes only when the password does
  const token = Array.from(new TextEncoder().encode(expectedPassword))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const cookieStore = await cookies();
  cookieStore.set("gf_admin", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}
