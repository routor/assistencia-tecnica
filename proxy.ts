import { type NextRequest, NextResponse } from "next/server";
import { buildContentSecurityPolicy } from "@/lib/security/csp";

/**
 * Next.js 16 "proxy" (formerly middleware). Generates a per-request nonce and applies a strict,
 * nonce-based Content-Security-Policy (NFR-011, SEC-016, R-008). The nonce is forwarded on the
 * `x-nonce` request header so the layout can attach it to first-party <script> tags (GTM loader).
 */
export function proxy(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const gtmEnabled = Boolean(process.env.NEXT_PUBLIC_GTM_ID);

  const csp = buildContentSecurityPolicy({ nonce, isDev, gtmEnabled });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Apply to all routes except static assets and image optimizer, where a dynamic nonce is
  // unnecessary and would defeat static caching.
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
