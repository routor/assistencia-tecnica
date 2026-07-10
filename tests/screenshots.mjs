/* eslint-disable no-console -- standalone capture script, console output is intentional */
// Target screenshot capture (T078). Synthetic data only (SC-007). Run against a running server:
//   E2E_PORT=3500 node tests/screenshots.mjs
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const PORT = process.env.E2E_PORT ?? 3500;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = "reports/screenshots/003-landing-assistencia-tecnica";
await mkdir(OUT, { recursive: true });

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const phone = () => `1194${String(Date.now()).slice(-8)}`;

async function fillStep1(page) {
  await page.getByLabel(/seu nome/i).fill("Fulano de Teste");
  await page.getByLabel(/nome do negócio/i).fill("Bancada Sintética");
  await page.getByLabel(/whatsapp/i).fill(phone());
  await page.getByLabel(/o que você mais conserta/i).selectOption("celulares_tablets");
}

const browser = await chromium.launch();
for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();

  await page.goto(`${BASE}/assistencia-tecnica`);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${OUT}/landing-${vp.name}.png`, fullPage: true });

  // Form step 1
  await page.locator("#formulario").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/form-step1-${vp.name}.png` });

  // Error state: submit step 1 empty is blocked; instead show consent error on step 2.
  await fillStep1(page);
  await page.getByRole("button", { name: /continuar/i }).click();
  await page.getByRole("button", { name: /enviar e participar/i }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/form-error-${vp.name}.png` });

  // Success (thank-you)
  await page.goto(`${BASE}/obrigado?vertical=assistencia-tecnica`);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${OUT}/thank-you-${vp.name}.png`, fullPage: true });

  // Privacy
  await page.goto(`${BASE}/privacidade`);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${OUT}/privacy-${vp.name}.png`, fullPage: true });

  await context.close();
  console.log(`captured ${vp.name}`);
}
await browser.close();
console.log("done");
