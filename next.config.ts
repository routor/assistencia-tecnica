import type { NextConfig } from "next";
import { STATIC_SECURITY_HEADERS } from "./lib/security/headers";

/**
 * The per-request nonce-based Content-Security-Policy is generated in `proxy.ts` because it must
 * vary per request. The static, request-independent headers come from a shared module so they can
 * be asserted in tests (NFR-011, SEC-016).
 */
const securityHeaders = [...STATIC_SECURITY_HEADERS];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output ONLY for the Docker image build (set via BUILD_STANDALONE=1 in the
  // Dockerfile). Local `pnpm start` / Playwright / Lighthouse use the normal `next start` server,
  // which is incompatible with `output: standalone` (T095, D-5).
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
  // Fail the production build on type errors instead of shipping them.
  // (Next 16 removed the built-in `next lint`/`eslint` config integration; linting runs
  // standalone via `pnpm lint` in the ordered CI gate.)
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
