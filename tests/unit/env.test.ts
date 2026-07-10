// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getPublicEnv,
  getServerEnv,
  parsePublicEnv,
  parseServerEnv,
} from "@/lib/env";

const VALID_DB = "postgresql://u:p@localhost:5432/db?sslmode=disable";

describe("server environment partition (CTR-003, NFR-010, SEC-013)", () => {
  it("fails closed and names the missing variable (not its value) when DATABASE_URL is absent", () => {
    const result = parseServerEnv({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing).toContain("DATABASE_URL");
      // Error text must never leak a value.
      expect(result.message).toContain("DATABASE_URL");
      expect(result.message).not.toContain("postgresql://");
    }
  });

  it("rejects a non-PostgreSQL DATABASE_URL", () => {
    const result = parseServerEnv({ DATABASE_URL: "mysql://u:p@h/db" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.missing).toContain("DATABASE_URL");
  });

  it("accepts a valid pooled PostgreSQL URL", () => {
    const result = parseServerEnv({ DATABASE_URL: VALID_DB });
    expect(result.ok).toBe(true);
  });

  it("treats empty policy strings as unset (fail-closed for production content)", () => {
    const result = parseServerEnv({
      DATABASE_URL: VALID_DB,
      PRIVACY_CONTROLLER_NAME: "",
      PRIVACY_CONTACT: "",
      LEAD_RETENTION_DAYS: "",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.PRIVACY_CONTROLLER_NAME).toBeUndefined();
      expect(result.value.PRIVACY_CONTACT).toBeUndefined();
      expect(result.value.LEAD_RETENTION_DAYS).toBeUndefined();
    }
  });

  it("rejects a non-positive or non-integer retention period", () => {
    for (const bad of ["0", "-5", "3.5", "abc"]) {
      const result = parseServerEnv({ DATABASE_URL: VALID_DB, LEAD_RETENTION_DAYS: bad });
      expect(result.ok, `retention ${bad}`).toBe(false);
    }
  });

  it("accepts a positive integer retention period", () => {
    const result = parseServerEnv({ DATABASE_URL: VALID_DB, LEAD_RETENTION_DAYS: "180" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.LEAD_RETENTION_DAYS).toBe(180);
  });
});

describe("public environment partition (CTR-003)", () => {
  it("accepts an absent GTM id (analytics disabled) but records site URL when present", () => {
    const result = parsePublicEnv({ NEXT_PUBLIC_SITE_URL: "https://example.com" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
      expect(result.value.NEXT_PUBLIC_GTM_ID).toBeUndefined();
    }
  });

  it("rejects a non-HTTPS site URL", () => {
    const result = parsePublicEnv({ NEXT_PUBLIC_SITE_URL: "http://insecure.example" });
    expect(result.ok).toBe(false);
  });

  it("rejects a malformed GTM id", () => {
    const result = parsePublicEnv({ NEXT_PUBLIC_GTM_ID: "not-a-gtm" });
    expect(result.ok).toBe(false);
  });

  it("accepts a well-formed GTM id", () => {
    const result = parsePublicEnv({ NEXT_PUBLIC_GTM_ID: "GTM-ABC1234" });
    expect(result.ok).toBe(true);
  });
});

describe("runtime accessors are server-guarded", () => {
  const originalWindow = (globalThis as { window?: unknown }).window;
  beforeEach(() => {
    process.env.DATABASE_URL = VALID_DB;
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
  });
  afterEach(() => {
    (globalThis as { window?: unknown }).window = originalWindow;
  });

  it("getServerEnv throws if called in a browser-like context", () => {
    (globalThis as { window?: unknown }).window = {};
    expect(() => getServerEnv()).toThrow();
  });

  it("getServerEnv returns parsed values on the server", () => {
    delete (globalThis as { window?: unknown }).window;
    expect(getServerEnv().DATABASE_URL).toBe(VALID_DB);
  });

  it("getPublicEnv is safe to read", () => {
    expect(getPublicEnv().NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
  });
});
