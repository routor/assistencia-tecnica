import { type Page, expect, test } from "@playwright/test";
import { LANDING } from "./helpers";

let counter = 0;
function uniquePhone(): string {
  counter += 1;
  const base = (Date.now() % 100000000) + counter;
  return `1197${String(base).padStart(8, "0").slice(-8)}`;
}

async function fillStep1(page: Page, phone: string) {
  await page.getByLabel(/seu nome/i).fill("Fulano de Teste");
  await page.getByLabel(/nome do negócio/i).fill("Bancada Sintética");
  await page.getByLabel(/whatsapp/i).fill(phone);
  await page.getByLabel(/o que você mais conserta/i).selectOption("celulares_tablets");
}

async function fillStep2(page: Page) {
  await page.getByLabel(/tamanho da equipe/i).selectOption("2_3");
  await page.getByLabel(/aparelhos que entram por mês/i).selectOption("31_100");
  await page.getByLabel(/como você organiza hoje/i).selectOption("planilha");
  await page.getByLabel(/onde mais trava hoje/i).selectOption("status_cliente");
  await page.getByRole("checkbox", { name: /fotos na entrada/i }).check();
  await page.getByRole("checkbox", { name: /status do reparo/i }).check();
  await page.getByLabel(/cadê meu conserto/i).selectOption("diariamente");
  await page.getByLabel(/quanto pagaria por mês/i).selectOption("130_199");
}

test.describe("US2 conversion (FR-011..FR-029, SC-003/4/5)", () => {
  test("completes a valid two-step submission and redirects to the thank-you state", async ({
    page,
  }) => {
    await page.goto(LANDING);
    await page.getByRole("link", { name: /quero participar do piloto/i }).first().click();
    await fillStep1(page, uniquePhone());
    await page.getByRole("button", { name: /continuar/i }).click();
    await fillStep2(page);
    await page.getByRole("checkbox", { name: /autorizo o uso dos meus dados/i }).check();
    await page.getByRole("button", { name: /enviar e participar/i }).click();

    await expect(page).toHaveURL(/\/obrigado\?vertical=assistencia-tecnica/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/obrigado/i);
    await expect(page.getByText(/ainda não é um produto disponível/i)).toBeVisible();
  });

  test("does not submit without consent and keeps the user on the form", async ({ page }) => {
    await page.goto(LANDING);
    await fillStep1(page, uniquePhone());
    await page.getByRole("button", { name: /continuar/i }).click();
    await fillStep2(page);
    // No consent checked.
    await page.getByRole("button", { name: /enviar e participar/i }).click();
    await expect(page).toHaveURL(/assistencia-tecnica/);
    // The consent-specific validation message appears (summary + field).
    await expect(page.getByText(/é necessário aceitar o uso dos dados/i).first()).toBeVisible();
  });

  test("blocks advancing past step 1 when required fields are empty", async ({ page }) => {
    await page.goto(LANDING);
    await page.getByRole("link", { name: /quero participar do piloto/i }).first().click();
    await page.getByRole("button", { name: /continuar/i }).click();
    await expect(page.getByLabel(/seu nome/i)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("heading", { name: /etapa 2/i })).toBeHidden();
  });

  test("a duplicate submission (same whatsapp) still succeeds idempotently", async ({ page }) => {
    const phone = uniquePhone();
    // First submission.
    await page.goto(LANDING);
    await fillStep1(page, phone);
    await page.getByRole("button", { name: /continuar/i }).click();
    await fillStep2(page);
    await page.getByRole("checkbox", { name: /autorizo o uso dos meus dados/i }).check();
    await page.getByRole("button", { name: /enviar e participar/i }).click();
    await expect(page).toHaveURL(/\/obrigado/);

    // Second submission, same phone -> identical success (no membership disclosure).
    await page.goto(LANDING);
    await fillStep1(page, phone);
    await page.getByRole("button", { name: /continuar/i }).click();
    await fillStep2(page);
    await page.getByRole("checkbox", { name: /autorizo o uso dos meus dados/i }).check();
    await page.getByRole("button", { name: /enviar e participar/i }).click();
    await expect(page).toHaveURL(/\/obrigado\?vertical=assistencia-tecnica/);
  });

  test("direct navigation to the thank-you route does not imply a submission", async ({ page }) => {
    await page.goto("/obrigado?vertical=assistencia-tecnica");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/obrigado/i);
    await expect(page.getByText(/projeto em validação/i)).toBeVisible();
  });
});
