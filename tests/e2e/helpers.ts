import AxeBuilder from "@axe-core/playwright";
import { type Page, expect } from "@playwright/test";

export const LANDING = "/assistencia-tecnica";

/** Collect console errors so specs can assert a clean console (SC-001). */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

/** Run axe and fail on any critical/serious violation (NFR-002, SC-008). */
export async function expectNoSeriousA11yViolations(page: Page, context?: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const seriousOrCritical = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  expect(
    seriousOrCritical,
    `${context ?? "page"} axe violations:\n${JSON.stringify(
      seriousOrCritical.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
      null,
      2,
    )}`,
  ).toEqual([]);
}

/** Capture the analytics dataLayer as pushed by the app (US3). */
export async function readDataLayer(page: Page): Promise<Array<Record<string, unknown> | unknown[]>> {
  return page.evaluate(() => {
    const w = window as unknown as { dataLayer?: unknown[] };
    return (w.dataLayer ?? []).map((e) => {
      // Consent Mode: gtag() pushes Arguments; funnel events push plain objects.
      if (Array.isArray(e)) return [...e];
      if (
        e &&
        typeof e === "object" &&
        typeof (e as { length?: unknown }).length === "number" &&
        "0" in e
      ) {
        return Array.from(e as unknown as ArrayLike<unknown>);
      }
      if (e && typeof e === "object") return { ...(e as Record<string, unknown>) };
      return e as unknown as Record<string, unknown>;
    });
  }) as Promise<Array<Record<string, unknown> | unknown[]>>;
}

/** Ensure a dataLayer array exists before GTM would (so app pushes are captured even with GTM off). */
export async function seedDataLayer(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer =
      (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
  });
}

/**
 * Persist a reject-optional choice before navigation so the banner stays closed and GTM stays
 * unloaded in specs that are not about the CMP itself. Uses context cookies so SSR also sees it.
 */
export async function seedRejectedConsent(page: Page) {
  const value = encodeURIComponent(
    JSON.stringify({
      version: "2026-07-12",
      analytics: false,
      advertising: false,
      updatedAt: 1,
    }),
  );
  await page.context().addCookies([
    {
      name: "consertify_consent",
      value,
      domain: "127.0.0.1",
      path: "/",
    },
  ]);
}

export async function seedGrantedConsent(
  page: Page,
  prefs: { analytics: boolean; advertising: boolean },
) {
  const value = encodeURIComponent(
    JSON.stringify({
      version: "2026-07-12",
      analytics: prefs.analytics,
      advertising: prefs.advertising,
      updatedAt: 1,
    }),
  );
  await page.context().addCookies([
    {
      name: "consertify_consent",
      value,
      domain: "127.0.0.1",
      path: "/",
    },
  ]);
}

export async function readConsentCookie(page: Page): Promise<Record<string, unknown> | null> {
  return page.evaluate(() => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("consertify_consent="));
    if (!match) return null;
    try {
      return JSON.parse(decodeURIComponent(match.slice("consertify_consent=".length))) as Record<
        string,
        unknown
      >;
    } catch {
      return null;
    }
  });
}

export async function gtmScriptCount(page: Page): Promise<number> {
  return page.locator('script[data-consertify-gtm], script[src*="googletagmanager.com/gtm.js"]').count();
}
