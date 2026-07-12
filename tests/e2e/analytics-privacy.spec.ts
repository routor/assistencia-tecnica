import { type Page, expect, test } from "@playwright/test";
import { LANDING, readDataLayer, seedDataLayer, seedRejectedConsent } from "./helpers";

let counter = 0;
const uniquePhone = () => {
  counter += 1;
  return `1195${String((Date.now() % 100000000) + counter)
    .padStart(8, "0")
    .slice(-8)}`;
};

async function completeForm(page: Page, phone: string) {
  await page.getByLabel(/seu nome/i).fill("Fulano de Teste");
  await page.getByLabel(/nome do negócio/i).fill("Bancada Sintética");
  await page.getByLabel(/whatsapp/i).fill(phone);
  await page.getByLabel(/o que você mais conserta/i).selectOption("celulares_tablets");
  await page.getByRole("button", { name: /continuar/i }).click();
  await page.getByLabel(/tamanho da equipe/i).selectOption("2_3");
  await page.getByLabel(/aparelhos que entram por mês/i).selectOption("31_100");
  await page.getByLabel(/como você organiza hoje/i).selectOption("planilha");
  await page.getByLabel(/onde mais trava hoje/i).selectOption("status_cliente");
  await page.getByRole("checkbox", { name: /fotos na entrada/i }).check();
  await page.getByLabel(/cadê meu conserto/i).selectOption("diariamente");
  await page.getByLabel(/quanto pagaria por mês/i).selectOption("130_199");
  await page.getByRole("checkbox", { name: /autorizo o uso dos meus dados/i }).check();
  await page.getByRole("button", { name: /enviar e participar/i }).click();
}

test.describe("US3 analytics privacy & GTM failure isolation (NFR-010, FR-034, SC-007)", () => {
  test.beforeEach(async ({ page }) => {
    await seedRejectedConsent(page);
  });

  test("no PII, open answers, or raw gclid appear anywhere in the dataLayer", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(`${LANDING}?utm_source=google&gclid=RAWCLICK999`);
    await completeForm(page, uniquePhone());
    await expect(page).toHaveURL(/\/obrigado/);

    const serialized = JSON.stringify(await readDataLayer(page));
    // PII
    expect(serialized).not.toContain("Fulano de Teste");
    expect(serialized).not.toContain("Bancada Sintética");
    // raw gclid
    expect(serialized).not.toContain("RAWCLICK999");
    // open/bounded answer VALUES must never be in analytics
    expect(serialized).not.toContain("status_cliente");
    expect(serialized).not.toContain("130_199");
    // whatsapp digits must not leak
    expect(serialized).not.toMatch(/\b\d{10,15}\b/);
  });

  test("form works and redirects even when GTM/dataLayer is absent (blocked)", async ({ page }) => {
    // Do NOT seed a dataLayer, and GTM is not configured -> analytics is effectively blocked.
    await page.goto(LANDING);
    await completeForm(page, uniquePhone());
    await expect(page).toHaveURL(/\/obrigado\?vertical=assistencia-tecnica/);
    // The app never created a dataLayer (analytics silently degraded).
    const hasDataLayer = await page.evaluate(
      () => Array.isArray((window as { dataLayer?: unknown[] }).dataLayer),
    );
    expect(hasDataLayer).toBe(false);
  });
});
