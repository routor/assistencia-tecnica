import { expect, test } from "@playwright/test";
import { LANDING, expectNoSeriousA11yViolations, trackConsoleErrors } from "./helpers";

test.describe("US1 landing — first viewport, structure, accessibility (FR-002..FR-006, NFR-001)", () => {
  test("first viewport shows audience, validation status, promise and CTA", async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await page.goto(LANDING);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /da entrada do aparelho à garantia/i,
    );
    await expect(page.getByText(/projeto em validação/i).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /participar do piloto/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(/gratuito e sem compromisso/i).first()).toBeVisible();

    expect(errors, `console errors: ${errors.join("\n")}`).toEqual([]);
  });

  test("primary CTA moves focus to the interest form", async ({ page }) => {
    await page.goto(LANDING);
    await page.getByRole("link", { name: /quero participar do piloto/i }).first().click();
    const formHeading = page.locator("#formulario [data-form-focus]");
    await expect(formHeading).toBeFocused();
  });

  test("has a single H1 and ordered heading landmarks", async ({ page }) => {
    await page.goto(LANDING);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main#conteudo")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("conceptual product view is explicitly labelled a concept", async ({ page }) => {
    await page.goto(LANDING);
    const concept = page.getByRole("heading", { name: /visão do produto/i });
    await expect(concept).toBeVisible();
    await expect(page.getByText(/conceito/i).first()).toBeVisible();
  });

  test("lifecycle stages appear in order", async ({ page }) => {
    await page.goto(LANDING);
    const list = page.getByRole("list", { name: /etapas do fluxo proposto/i });
    await expect(list.getByRole("listitem")).toHaveCount(8);
    await expect(list.getByRole("listitem").first()).toContainText(/Entrada/);
    await expect(list.getByRole("listitem").last()).toContainText(/Garantia/);
  });

  test("no serious/critical accessibility violations", async ({ page }) => {
    await page.goto(LANDING);
    await expectNoSeriousA11yViolations(page, "landing");
  });
});
