import { type Page, expect, test } from "@playwright/test";
import {
  LANDING,
  gtmScriptCount,
  readConsentCookie,
  readDataLayer,
  seedDataLayer,
  seedRejectedConsent,
} from "./helpers";

let counter = 0;
const uniquePhone = () => {
  counter += 1;
  return `1194${String((Date.now() % 100000000) + counter)
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

function consentUpdates(dl: Array<Record<string, unknown> | unknown[]>) {
  return dl.filter(
    (entry) => Array.isArray(entry) && entry[0] === "consent" && entry[1] === "update",
  ) as unknown[][];
}

test.describe("Cookie CMP + Consent Mode v2 (Basic)", () => {
  test("first visit shows banner and does not load GTM before a choice", async ({ page }) => {
    await page.goto(LANDING);
    await expect(page.getByRole("region", { name: /preferências de cookies/i })).toBeVisible();
    expect(await gtmScriptCount(page)).toBe(0);
  });

  test("reject keeps GTM blocked and persists after reload", async ({ page }) => {
    await page.goto(LANDING);
    await page.getByRole("button", { name: /rejeitar não essenciais/i }).click();
    await expect(page.getByRole("region", { name: /preferências de cookies/i })).toHaveCount(0);
    expect(await gtmScriptCount(page)).toBe(0);
    expect(await readConsentCookie(page)).toMatchObject({
      analytics: false,
      advertising: false,
    });

    await page.reload();
    await expect(page.getByRole("region", { name: /preferências de cookies/i })).toHaveCount(0);
    expect(await gtmScriptCount(page)).toBe(0);
    expect(await readConsentCookie(page)).toMatchObject({
      analytics: false,
      advertising: false,
    });
  });

  test("accept all persists and reopen/edit preferences works with keyboard", async ({ page }) => {
    // Without NEXT_PUBLIC_GTM_ID, accept still applies Consent Mode locally when dataLayer exists.
    await seedDataLayer(page);
    await page.goto(LANDING);
    await page.getByRole("button", { name: /aceitar todos/i }).click();
    expect(await readConsentCookie(page)).toMatchObject({
      analytics: true,
      advertising: true,
    });

    await page.getByRole("button", { name: /^preferências de cookies$/i }).click();
    const dialog = page.getByRole("dialog", { name: /preferências de cookies/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(/analytics/i)).toBeChecked();
    await expect(dialog.getByLabel(/publicidade/i)).toBeChecked();

    await dialog.getByLabel(/publicidade/i).uncheck();
    await dialog.getByRole("button", { name: /salvar preferências/i }).click();
    await expect(dialog).toHaveCount(0);
    expect(await readConsentCookie(page)).toMatchObject({
      analytics: true,
      advertising: false,
    });

    await page.getByRole("button", { name: /^preferências de cookies$/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("configure → analytics only grants analytics_storage", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(LANDING);
    await page.getByRole("button", { name: /configurar/i }).click();
    const dialog = page.getByRole("dialog", { name: /preferências de cookies/i });
    await dialog.getByLabel(/analytics/i).check();
    await dialog.getByRole("button", { name: /salvar preferências/i }).click();

    const updates = consentUpdates(await readDataLayer(page));
    expect(updates.at(-1)?.[2]).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    expect(await readConsentCookie(page)).toMatchObject({
      analytics: true,
      advertising: false,
    });
    // Cookie payload must not contain PII.
    const raw = await page.evaluate(() => document.cookie);
    expect(raw).not.toMatch(/Fulano|Bancada|@|whatsapp/i);
  });

  test("configure → advertising only grants the three ad signals", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(LANDING);
    await page.getByRole("button", { name: /configurar/i }).click();
    const dialog = page.getByRole("dialog", { name: /preferências de cookies/i });
    await dialog.getByLabel(/publicidade/i).check();
    await dialog.getByRole("button", { name: /salvar preferências/i }).click();

    const updates = consentUpdates(await readDataLayer(page));
    expect(updates.at(-1)?.[2]).toEqual({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  test("form still converts with optional cookies rejected", async ({ page }) => {
    await seedRejectedConsent(page);
    await seedDataLayer(page);
    await page.goto(LANDING);
    await expect(page.getByRole("region", { name: /preferências de cookies/i })).toHaveCount(0);
    await completeForm(page, uniquePhone());
    await expect(page).toHaveURL(/\/obrigado/);
    const dl = await readDataLayer(page);
    const names = dl
      .map((e) => (e && typeof e === "object" && !Array.isArray(e) ? e.event : undefined))
      .filter(Boolean);
    expect(names.filter((n) => n === "lead_submit_success")).toHaveLength(1);
    expect(await gtmScriptCount(page)).toBe(0);
  });

  test("revocation after accept updates consent to denied", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(LANDING);
    await page.getByRole("button", { name: /aceitar todos/i }).click();
    await page.getByRole("button", { name: /^preferências de cookies$/i }).click();
    await page.getByRole("button", { name: /rejeitar não essenciais/i }).click();
    expect(await readConsentCookie(page)).toMatchObject({
      analytics: false,
      advertising: false,
    });
    const updates = consentUpdates(await readDataLayer(page));
    expect(updates.at(-1)?.[2]).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });
});
