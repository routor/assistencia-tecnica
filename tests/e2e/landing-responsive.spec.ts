import { expect, test } from "@playwright/test";
import { LANDING, expectNoSeriousA11yViolations } from "./helpers";

test.describe("US1 responsive / zoom / reduced-motion / asset fallback (NFR-003/4/12, SC-008)", () => {
  test("core content is usable at the current target viewport without horizontal scroll", async ({
    page,
  }) => {
    await page.goto(LANDING);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // The page body must never scroll horizontally.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(overflow, "no horizontal overflow").toBe(true);
  });

  test("remains readable at 200% text scaling with no content lost", async ({ page }) => {
    await page.goto(LANDING);
    await page.evaluate(() => {
      document.documentElement.style.setProperty("font-size", "200%");
    });
    // At 200% the essential content stays present and reachable (WCAG 1.4.4/1.4.10 — horizontal
    // scroll below the 320px-equivalent is permitted; content must not be clipped or lost).
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /participar do piloto/i }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /perguntas frequentes/i })).toBeVisible();
  });

  test("content is visible with reduced motion preference (motion never gates content)", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(LANDING);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /perguntas frequentes/i })).toBeVisible();
  });

  test("critical meaning survives without decorative assets (semantic text)", async ({ page }) => {
    // The lifecycle and concept views are code-native text, not images; blocking images must not
    // remove meaning.
    await page.route("**/*.{png,jpg,jpeg,webp,svg,gif}", (route) => route.abort());
    await page.goto(LANDING);
    await expect(page.getByRole("heading", { name: /visão do produto/i })).toBeVisible();
    await expect(page.getByRole("list", { name: /etapas do fluxo proposto/i })).toBeVisible();
  });

  test("no serious/critical a11y violations at this viewport", async ({ page }) => {
    await page.goto(LANDING);
    await expectNoSeriousA11yViolations(page, "landing-responsive");
  });
});
