import { type Page, expect, test } from "@playwright/test";
import { LANDING, readDataLayer, seedDataLayer } from "./helpers";

let counter = 0;
const uniquePhone = () => {
  counter += 1;
  return `1196${String((Date.now() % 100000000) + counter)
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

const names = (dl: Array<Record<string, unknown>>) =>
  dl.map((e) => e.event).filter(Boolean);

test.describe("US3 analytics events & cardinality (CTR-002, FR-031..FR-033, SC-006)", () => {
  test("emits landing_view once with attribution, and gclid_present (never raw gclid)", async ({
    page,
  }) => {
    await seedDataLayer(page);
    await page.goto(`${LANDING}?utm_source=google&utm_medium=cpc&gclid=RAWCLICK123`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect
      .poll(async () => (await readDataLayer(page)).some((e) => e.event === "landing_view"))
      .toBe(true);
    const dl = await readDataLayer(page);
    const views = dl.filter((e) => e.event === "landing_view");
    expect(views).toHaveLength(1);
    expect(views[0]!.utm_source).toBe("google");
    expect(views[0]!.gclid_present).toBe(true);
    expect(JSON.stringify(dl)).not.toContain("RAWCLICK123");
  });

  test("full funnel emits the approved sequence with exactly one lead_submit_success", async ({
    page,
  }) => {
    await seedDataLayer(page);
    await page.goto(LANDING);
    await page.getByRole("link", { name: /quero participar do piloto/i }).first().click();
    await completeForm(page, uniquePhone());
    await expect(page).toHaveURL(/\/obrigado/);

    const dl = await readDataLayer(page);
    const evNames = names(dl);
    expect(evNames).toContain("landing_view");
    expect(evNames).toContain("primary_cta_click");
    expect(evNames).toContain("lead_form_start");
    expect(evNames).toContain("lead_form_step_1_complete");
    expect(evNames).toContain("lead_submit_attempt");
    expect(evNames.filter((n) => n === "lead_submit_success")).toHaveLength(1);
    expect(evNames).toContain("thank_you_view");
    // No success before persistence: success comes after attempt.
    expect(evNames.indexOf("lead_submit_success")).toBeGreaterThan(
      evNames.indexOf("lead_submit_attempt"),
    );
  });

  test("a validation error emits lead_form_validation_error and no success", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(LANDING);
    await page.getByLabel(/seu nome/i).fill("Fulano de Teste");
    await page.getByLabel(/nome do negócio/i).fill("Bancada Sintética");
    await page.getByLabel(/whatsapp/i).fill("123"); // invalid
    await page.getByLabel(/o que você mais conserta/i).selectOption("celulares_tablets");
    await page.getByRole("button", { name: /continuar/i }).click();

    const evNames = names(await readDataLayer(page));
    expect(evNames).toContain("lead_form_validation_error");
    expect(evNames).not.toContain("lead_submit_success");
  });

  test("direct thank-you navigation emits only thank_you_view, never submit success", async ({
    page,
  }) => {
    await seedDataLayer(page);
    await page.goto("/obrigado?vertical=assistencia-tecnica");
    await expect
      .poll(async () => (await readDataLayer(page)).some((e) => e.event === "thank_you_view"))
      .toBe(true);
    const evNames = names(await readDataLayer(page));
    expect(evNames).toContain("thank_you_view");
    expect(evNames).not.toContain("lead_submit_success");
  });
});
