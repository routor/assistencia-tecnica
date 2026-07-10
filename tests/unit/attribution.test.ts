import { describe, expect, it } from "vitest";
import { attributionAnalyticsProps, parseAttribution } from "@/lib/analytics/attribution";

describe("attribution parsing (FR-030, FR-032, SEC-016)", () => {
  it("keeps only supported UTM keys and gclid, discarding unknowns", () => {
    const a = parseAttribution({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "piloto",
      gclid: "abc123",
      evil: "<script>",
      ref: "spam",
    });
    expect(a).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "piloto",
      gclid: "abc123",
    });
    expect((a as Record<string, unknown>).evil).toBeUndefined();
  });

  it("bounds overlong values (drops them) and trims", () => {
    const a = parseAttribution({
      utm_source: "  google  ",
      utm_campaign: "x".repeat(201),
      gclid: "y".repeat(257),
    });
    expect(a.utm_source).toBe("google");
    expect(a.utm_campaign).toBeUndefined();
    expect(a.gclid).toBeUndefined();
  });

  it("works with URLSearchParams and takes the first repeated value", () => {
    const sp = new URLSearchParams("utm_source=a&utm_source=b&gclid=g");
    const a = parseAttribution(sp);
    expect(a.utm_source).toBe("a");
    expect(a.gclid).toBe("g");
  });

  it("exposes gclid_present (boolean) but NEVER the raw gclid in analytics props", () => {
    const props = attributionAnalyticsProps({ utm_source: "google", gclid: "raw-secret-click" });
    expect(props.gclid_present).toBe(true);
    expect(props.utm_source).toBe("google");
    expect((props as Record<string, unknown>).gclid).toBeUndefined();
    expect(JSON.stringify(props)).not.toContain("raw-secret-click");
  });

  it("gclid_present is false when absent", () => {
    expect(attributionAnalyticsProps({ utm_source: "x" }).gclid_present).toBe(false);
  });
});
