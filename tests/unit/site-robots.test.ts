// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { __resetEnvCacheForTests } from "@/lib/env";
import { siteRobots } from "@/lib/seo/site-robots";

describe("siteRobots (PD-004 Preview noindex)", () => {
  const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    __resetEnvCacheForTests();
  });

  afterEach(() => {
    if (previousSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl;
    }
    __resetEnvCacheForTests();
  });

  it("emits noindex/nofollow when NEXT_PUBLIC_SITE_URL is absent", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    __resetEnvCacheForTests();
    const robots = siteRobots();
    expect(robots).toEqual({ index: false, follow: false });
  });

  it("emits noindex/nofollow when NEXT_PUBLIC_SITE_URL is empty", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "";
    __resetEnvCacheForTests();
    const robots = siteRobots();
    expect(robots).toEqual({ index: false, follow: false });
  });

  it("emits index/follow when NEXT_PUBLIC_SITE_URL is a valid HTTPS origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    __resetEnvCacheForTests();
    const robots = siteRobots();
    expect(robots).toEqual({ index: true, follow: true });
  });
});
