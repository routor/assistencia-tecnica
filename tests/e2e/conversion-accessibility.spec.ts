import { expect, test } from "@playwright/test";
import { LANDING, expectNoSeriousA11yViolations } from "./helpers";

test.describe("US2 conversion accessibility (NFR-001..004, SC-008)", () => {
  test("the form region has no serious/critical axe violations (both steps)", async ({ page }) => {
    await page.goto(LANDING);
    await expectNoSeriousA11yViolations(page, "form step 1");

    // Advance to step 2 and re-scan.
    await page.getByLabel(/seu nome/i).fill("Fulano de Teste");
    await page.getByLabel(/nome do negócio/i).fill("Bancada Sintética");
    await page.getByLabel(/whatsapp/i).fill("11988887777");
    await page.getByLabel(/o que você mais conserta/i).selectOption("celulares_tablets");
    await page.getByRole("button", { name: /continuar/i }).click();
    await expect(page.getByRole("heading", { name: /etapa 2/i })).toBeVisible();
    await expectNoSeriousA11yViolations(page, "form step 2");
  });

  test("the form is keyboard operable — labels, focus, and step navigation", async ({ page }) => {
    await page.goto(LANDING);
    // Tab into the first field and type.
    await page.getByLabel(/seu nome/i).focus();
    await expect(page.getByLabel(/seu nome/i)).toBeFocused();
    await page.keyboard.type("Fulano de Teste");
    await page.getByLabel(/nome do negócio/i).fill("Bancada Sintética");
    await page.getByLabel(/whatsapp/i).fill("11988887777");
    await page.getByLabel(/o que você mais conserta/i).selectOption("celulares_tablets");
    await page.getByRole("button", { name: /continuar/i }).click();
    // Focus moves to the step 2 heading.
    await expect(page.getByRole("heading", { name: /etapa 2/i })).toBeFocused();
  });

  test("the thank-you page has no serious/critical axe violations", async ({ page }) => {
    await page.goto("/obrigado?vertical=assistencia-tecnica");
    await expectNoSeriousA11yViolations(page, "thank-you");
  });
});
