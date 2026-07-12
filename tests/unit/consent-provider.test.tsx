// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { CookiePreferencesTrigger } from "@/components/consent/cookie-preferences-trigger";
import {
  CONSENT_COOKIE_NAME,
  __resetConsentRuntimeForTests,
  parseConsentCookieValue,
} from "@/lib/consent";

function readStoredDecision() {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));
  return parseConsentCookieValue(match?.slice(CONSENT_COOKIE_NAME.length + 1));
}

describe("ConsentProvider UI", () => {
  afterEach(() => {
    cleanup();
    document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0`;
    __resetConsentRuntimeForTests();
    delete (window as { dataLayer?: unknown[]; gtag?: unknown }).dataLayer;
    delete (window as { gtag?: unknown }).gtag;
    document.querySelectorAll("script[data-consertify-gtm]").forEach((n) => n.remove());
  });

  it("shows the banner on first visit with equally available actions", () => {
    render(
      <ConsentProvider initialDecision={null} gtmId="GTM-TEST1234">
        <p>conteúdo</p>
      </ConsentProvider>,
    );
    const region = screen.getByRole("region", { name: /preferências de cookies/i });
    expect(within(region).getByRole("button", { name: /aceitar todos/i })).toBeInTheDocument();
    expect(
      within(region).getByRole("button", { name: /rejeitar não essenciais/i }),
    ).toBeInTheDocument();
    expect(within(region).getByRole("button", { name: /configurar/i })).toBeInTheDocument();
    expect(document.querySelector("script[data-consertify-gtm]")).toBeNull();
  });

  it("rejects optional cookies without loading GTM and persists the choice", async () => {
    const user = userEvent.setup();
    render(
      <ConsentProvider initialDecision={null} gtmId="GTM-TEST1234">
        <p>conteúdo</p>
      </ConsentProvider>,
    );
    await user.click(screen.getByRole("button", { name: /rejeitar não essenciais/i }));
    expect(screen.queryByRole("region", { name: /preferências de cookies/i })).not.toBeInTheDocument();
    expect(document.querySelector("script[data-consertify-gtm]")).toBeNull();
    expect(readStoredDecision()).toMatchObject({ analytics: false, advertising: false });
    expect(Array.isArray((window as { dataLayer?: unknown[] }).dataLayer)).toBe(false);
  });

  it("accepts all, applies grants, and loads GTM once", async () => {
    const user = userEvent.setup();
    render(
      <ConsentProvider initialDecision={null} gtmId="GTM-TEST1234">
        <CookiePreferencesTrigger />
      </ConsentProvider>,
    );
    await user.click(screen.getByRole("button", { name: /aceitar todos/i }));
    expect(document.querySelectorAll('script[data-consertify-gtm="GTM-TEST1234"]')).toHaveLength(1);
    expect(readStoredDecision()).toMatchObject({ analytics: true, advertising: true });
  });

  it("opens preferences, saves analytics-only, and keeps ads denied", async () => {
    const user = userEvent.setup();
    render(
      <ConsentProvider initialDecision={null} gtmId="GTM-TEST1234">
        <CookiePreferencesTrigger />
      </ConsentProvider>,
    );
    await user.click(screen.getByRole("button", { name: /configurar/i }));
    const dialog = screen.getByRole("dialog", { name: /preferências de cookies/i });
    const analytics = within(dialog).getByLabelText(/analytics/i);
    const advertising = within(dialog).getByLabelText(/publicidade/i);
    expect(analytics).not.toBeChecked();
    expect(advertising).not.toBeChecked();
    await user.click(analytics);
    await user.click(within(dialog).getByRole("button", { name: /salvar preferências/i }));
    expect(readStoredDecision()).toMatchObject({ analytics: true, advertising: false });
    const dl = (window as { dataLayer: unknown[] }).dataLayer;
    const asList = (entry: unknown): unknown[] | null => {
      if (Array.isArray(entry)) return entry;
      if (
        entry &&
        typeof entry === "object" &&
        typeof (entry as { length?: unknown }).length === "number" &&
        "0" in (entry as object)
      ) {
        return Array.from(entry as ArrayLike<unknown>);
      }
      return null;
    };
    const update = [...dl]
      .reverse()
      .map(asList)
      .find((e) => e && e[0] === "consent" && e[1] === "update");
    expect(update?.[2]).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("reopens preferences from the persistent control and supports keyboard Escape", async () => {
    const user = userEvent.setup();
    render(
      <ConsentProvider
        initialDecision={{
          version: "2026-07-12",
          analytics: false,
          advertising: false,
          updatedAt: 1,
        }}
      >
        <CookiePreferencesTrigger />
      </ConsentProvider>,
    );
    expect(screen.queryByRole("region", { name: /preferências de cookies/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /preferências de cookies/i }));
    expect(screen.getByRole("dialog", { name: /preferências de cookies/i })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /preferências de cookies/i })).not.toBeInTheDocument();
  });
});
