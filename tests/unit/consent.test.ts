// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  CONSENT_COOKIE_NAME,
  COOKIE_CONSENT_VERSION,
  DENIED_CONSENT_SIGNALS,
  __resetConsentRuntimeForTests,
  acceptAllDecision,
  applyConsentMode,
  buildDecision,
  formatConsentCookie,
  loadGoogleTagManager,
  parseConsentCookieValue,
  rejectOptionalDecision,
  shouldLoadGtm,
  toConsentModeSignals,
} from "@/lib/consent";

describe("consent storage + Consent Mode mapping", () => {
  beforeEach(() => {
    document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0`;
    __resetConsentRuntimeForTests();
    delete (window as { dataLayer?: unknown[] }).dataLayer;
    document.querySelectorAll("script[data-consertify-gtm]").forEach((n) => n.remove());
  });
  afterEach(() => {
    __resetConsentRuntimeForTests();
  });

  it("maps analytics-only to analytics_storage granted and ads denied", () => {
    const signals = toConsentModeSignals(buildDecision({ analytics: true, advertising: false }));
    expect(signals).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("maps advertising to the three ad signals without implying analytics", () => {
    const signals = toConsentModeSignals(buildDecision({ analytics: false, advertising: true }));
    expect(signals).toEqual({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("maps accept-all to every signal granted", () => {
    expect(toConsentModeSignals(acceptAllDecision())).toEqual({
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("maps reject-optional to the denied default", () => {
    expect(toConsentModeSignals(rejectOptionalDecision())).toEqual(DENIED_CONSENT_SIGNALS);
  });

  it("loads GTM only when an optional category is granted", () => {
    expect(shouldLoadGtm(null)).toBe(false);
    expect(shouldLoadGtm(rejectOptionalDecision())).toBe(false);
    expect(shouldLoadGtm(buildDecision({ analytics: true, advertising: false }))).toBe(true);
    expect(shouldLoadGtm(buildDecision({ analytics: false, advertising: true }))).toBe(true);
  });

  it("round-trips the cookie without PII fields", () => {
    const decision = buildDecision({ analytics: true, advertising: false, updatedAt: 1_720_000_000 });
    const raw = formatConsentCookie(decision, { secure: false }).split(";")[0]!.split("=")[1]!;
    const parsed = parseConsentCookieValue(raw);
    expect(parsed).toEqual(decision);
    const serialized = decodeURIComponent(raw);
    expect(serialized).not.toMatch(/nome|email|whatsapp|telefone|gclid/i);
    expect(JSON.parse(serialized)).toEqual({
      version: COOKIE_CONSENT_VERSION,
      analytics: true,
      advertising: false,
      updatedAt: 1_720_000_000,
    });
  });

  it("invalidates preferences when the cookie policy version changes", () => {
    const stale = encodeURIComponent(
      JSON.stringify({
        version: "1999-01-01",
        analytics: true,
        advertising: true,
        updatedAt: 1,
      }),
    );
    expect(parseConsentCookieValue(stale)).toBeNull();
  });

  it("applies default denied then update, and loads GTM once", () => {
    (window as { dataLayer?: unknown[] }).dataLayer = [];
    const decision = acceptAllDecision();
    applyConsentMode(decision);
    const firstLoad = loadGoogleTagManager("GTM-TEST1234");
    const secondLoad = loadGoogleTagManager("GTM-TEST1234");
    expect(firstLoad).toBe(true);
    expect(secondLoad).toBe(false);

    const dl = (window as { dataLayer: unknown[] }).dataLayer;
    const consentCmds = dl.filter(
      (entry) => Array.isArray(entry) && entry[0] === "consent",
    ) as unknown[][];
    expect(consentCmds.some((c) => c[1] === "default")).toBe(true);
    expect(consentCmds.some((c) => c[1] === "update")).toBe(true);
    const update = consentCmds.find((c) => c[1] === "update");
    expect(update?.[2]).toEqual(toConsentModeSignals(decision));
    expect(document.querySelectorAll('script[data-consertify-gtm="GTM-TEST1234"]')).toHaveLength(1);
  });

  it("revocation updates consent signals to denied without duplicating GTM", () => {
    (window as { dataLayer?: unknown[] }).dataLayer = [];
    applyConsentMode(acceptAllDecision());
    loadGoogleTagManager("GTM-TEST1234");
    applyConsentMode(rejectOptionalDecision());
    expect(document.querySelectorAll("script[data-consertify-gtm]")).toHaveLength(1);
    const updates = ((window as { dataLayer: unknown[] }).dataLayer.filter(
      (entry) => Array.isArray(entry) && entry[0] === "consent" && entry[1] === "update",
    ) as unknown[][]);
    expect(updates.at(-1)?.[2]).toEqual(DENIED_CONSENT_SIGNALS);
  });
});
