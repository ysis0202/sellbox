// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // 루트에 ?code=... 들어오면 /auth/callback으로만 넘김
  if (url.pathname === "/" && url.searchParams.has("code")) {
    const to = new URL("/auth/callback", url.origin);
    to.searchParams.set("code", url.searchParams.get("code")!);
    return NextResponse.redirect(to);
  }

  // 루트에 ?error=... 도 콜백으로
  if (
    url.pathname === "/" &&
    (url.searchParams.has("error") || url.searchParams.has("error_description"))
  ) {
    const to = new URL("/auth/callback", url.origin);
    url.searchParams.forEach((v, k) => to.searchParams.set(k, v));
    return NextResponse.redirect(to);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/"] };
