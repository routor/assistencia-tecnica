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
export async function readDataLayer(page: Page): Promise<Array<Record<string, unknown>>> {
  return page.evaluate(() => {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    return (w.dataLayer ?? []).map((e) => ({ ...e }));
  });
}

/** Ensure a dataLayer array exists before GTM would (so app pushes are captured even with GTM off). */
export async function seedDataLayer(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer =
      (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
  });
}
