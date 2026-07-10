import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy } from "@/lib/security/csp";
import { STATIC_SECURITY_HEADERS } from "@/lib/security/headers";

const parse = (csp: string): Record<string, string> =>
  Object.fromEntries(
    csp
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        const [name, ...rest] = d.split(/\s+/);
        return [name, rest.join(" ")];
      }),
  );

describe("Content-Security-Policy (NFR-011, SEC-016, R-008)", () => {
  it("propagates the per-request nonce into script-src with strict-dynamic", () => {
    const csp = buildContentSecurityPolicy({ nonce: "TESTNONCE", isDev: false, gtmEnabled: true });
    const d = parse(csp);
    expect(d["script-src"]).toContain("'nonce-TESTNONCE'");
    expect(d["script-src"]).toContain("'strict-dynamic'");
  });

  it("never allows unsafe-eval in production and never uses a bare wildcard", () => {
    const csp = buildContentSecurityPolicy({ nonce: "N", isDev: false, gtmEnabled: true });
    expect(csp).not.toContain("unsafe-eval");
    // No bare wildcard source and no blanket https: scheme source.
    expect(csp).not.toMatch(/(^|\s)\*(\s|;|$)/);
    expect(csp).not.toMatch(/(^|\s)https:(\s|;|$)/);
  });

  it("allows unsafe-eval ONLY in development", () => {
    const dev = buildContentSecurityPolicy({ nonce: "N", isDev: true, gtmEnabled: true });
    expect(dev).toContain("unsafe-eval");
  });

  it("stays self-only for scripts/connect when GTM is not configured", () => {
    const csp = buildContentSecurityPolicy({ nonce: "N", isDev: false, gtmEnabled: false });
    const d = parse(csp);
    expect(d["connect-src"]).toBe("'self'");
    expect(d["frame-src"]).toBe("'none'");
    expect(csp).not.toContain("googletagmanager");
  });

  it("adds only the required Google origins when GTM is enabled", () => {
    const csp = buildContentSecurityPolicy({ nonce: "N", isDev: false, gtmEnabled: true });
    expect(csp).toContain("https://www.googletagmanager.com");
    expect(csp).toContain("https://www.google-analytics.com");
  });

  it("sets object-src none, frame-ancestors none, base-uri self, form-action self", () => {
    const d = parse(buildContentSecurityPolicy({ nonce: "N", isDev: false, gtmEnabled: true }));
    expect(d["object-src"]).toBe("'none'");
    expect(d["frame-ancestors"]).toBe("'none'");
    expect(d["base-uri"]).toBe("'self'");
    expect(d["form-action"]).toBe("'self'");
  });

  it("upgrades insecure requests in production only", () => {
    expect(buildContentSecurityPolicy({ nonce: "N", isDev: false, gtmEnabled: false })).toContain(
      "upgrade-insecure-requests",
    );
    expect(buildContentSecurityPolicy({ nonce: "N", isDev: true, gtmEnabled: false })).not.toContain(
      "upgrade-insecure-requests",
    );
  });
});

describe("static security headers (NFR-011)", () => {
  const byKey = Object.fromEntries(STATIC_SECURITY_HEADERS.map((h) => [h.key, h.value]));

  it("includes HSTS, MIME, frame, referrer, and permissions policies", () => {
    expect(byKey["Strict-Transport-Security"]).toContain("max-age=");
    expect(byKey["X-Content-Type-Options"]).toBe("nosniff");
    expect(byKey["X-Frame-Options"]).toBe("DENY");
    expect(byKey["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(byKey["Permissions-Policy"]).toContain("geolocation=()");
  });
});
