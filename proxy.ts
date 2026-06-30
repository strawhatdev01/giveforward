import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// keep out anyone who doesn't have the admin cookie
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("gf_admin")?.value;
    const password = process.env.ADMIN_PASSWORD || "";
    // simple hex-ish hash so we're not storing the raw password in a cookie
    const expected = Array.from(new TextEncoder().encode(password))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (!session || session !== expected) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
