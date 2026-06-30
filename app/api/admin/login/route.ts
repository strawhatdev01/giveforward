import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
