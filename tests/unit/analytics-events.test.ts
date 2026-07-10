// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ANALYTICS_EVENTS,
  APPROVED_PROPERTIES,
  pushAnalyticsEvent,
  sanitizeEventProperties,
} from "@/lib/analytics/events";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

describe("analytics vocabulary + property allowlist (CTR-002, FR-031..FR-034, NFR-010)", () => {
  beforeEach(() => {
    window.dataLayer = [];
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete window.dataLayer;
  });

  it("exposes exactly the nine approved events", () => {
    expect([...ANALYTICS_EVENTS].sort()).toEqual(
      [
        "landing_view",
        "lead_form_start",
        "lead_form_step_1_complete",
        "lead_form_validation_error",
        "lead_submit_attempt",
        "lead_submit_error",
        "lead_submit_success",
        "primary_cta_click",
        "thank_you_view",
      ].sort(),
    );
  });

  it("pushes an approved event with approved properties to dataLayer", () => {
    pushAnalyticsEvent("primary_cta_click", { cta_location: "hero" });
    expect(window.dataLayer).toHaveLength(1);
    const pushed = window.dataLayer?.[0] as Record<string, unknown>;
    expect(pushed.event).toBe("primary_cta_click");
    expect(pushed.cta_location).toBe("hero");
    expect(pushed.vertical).toBe("assistencia-tecnica");
    expect(pushed.landing_path).toBe("/assistencia-tecnica");
  });

  it("drops non-approved properties (including any PII/open answers)", () => {
    const clean = sanitizeEventProperties({
      cta_location: "form",
      name: "Ana",
      email: "ana@example.com",
      whatsapp: "5511999999999",
      main_bottleneck: "diagnostico",
      gclid: "raw-value",
    } as Record<string, unknown>);
    expect(clean).toHaveProperty("cta_location", "form");
    expect(clean).not.toHaveProperty("name");
    expect(clean).not.toHaveProperty("email");
    expect(clean).not.toHaveProperty("whatsapp");
    expect(clean).not.toHaveProperty("main_bottleneck");
    // raw gclid is never allowed; only gclid_present boolean is
    expect(clean).not.toHaveProperty("gclid");
  });

  it("only allows gclid_present as a boolean, never a raw gclid", () => {
    expect(APPROVED_PROPERTIES.has("gclid_present")).toBe(true);
    expect(APPROVED_PROPERTIES.has("gclid")).toBe(false);
    const clean = sanitizeEventProperties({ gclid_present: true });
    expect(clean.gclid_present).toBe(true);
  });

  it("rejects an unknown event name in development/test", () => {
    expect(() =>
      pushAnalyticsEvent("evil_event" as unknown as (typeof ANALYTICS_EVENTS)[number]),
    ).toThrow();
  });

  it("does not throw when dataLayer/GTM is absent (failure isolation)", () => {
    delete window.dataLayer;
    expect(() => pushAnalyticsEvent("landing_view")).not.toThrow();
  });
});
