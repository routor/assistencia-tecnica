import {
  DENIED_CONSENT_SIGNALS,
  shouldLoadGtm,
  toConsentModeSignals,
} from "./storage";
import type { ConsentDecision } from "./types";

type GtagCommand = (...args: unknown[]) => void;

type ConsentWindow = Window & {
  dataLayer?: unknown[];
  gtag?: GtagCommand;
  __consertifyConsentApplied?: string;
  __consertifyGtmLoaded?: string;
};

function getConsentWindow(): ConsentWindow | null {
  if (typeof window === "undefined") return null;
  return window as ConsentWindow;
}

/**
 * Ensure `dataLayer` + `gtag` exist locally. This does NOT load GTM or contact Google.
 * Safe to call before any authorization (queue stays first-party until gtm.js loads).
 */
export function ensureGtagQueue(): GtagCommand | null {
  const w = getConsentWindow();
  if (!w) return null;
  w.dataLayer = Array.isArray(w.dataLayer) ? w.dataLayer : [];
  if (typeof w.gtag !== "function") {
    w.gtag = function gtag(...args: unknown[]) {
      w.dataLayer!.push(args);
    };
  }
  return w.gtag;
}

/**
 * Apply Consent Mode v2 for a decision. Uses `default` on first apply in this page lifetime,
 * then `update` for subsequent changes (accept → revoke, preference edits).
 */
export function applyConsentMode(decision: ConsentDecision): void {
  const gtag = ensureGtagQueue();
  const w = getConsentWindow();
  if (!gtag || !w) return;

  const signals = toConsentModeSignals(decision);
  const key = `${decision.version}:${decision.analytics}:${decision.advertising}:${decision.updatedAt}`;

  if (!w.__consertifyConsentApplied) {
    gtag("consent", "default", { ...DENIED_CONSENT_SIGNALS });
    gtag("consent", "update", { ...signals });
  } else if (w.__consertifyConsentApplied !== key) {
    gtag("consent", "update", { ...signals });
  }
  w.__consertifyConsentApplied = key;
}

/**
 * Load GTM exactly once per container id, only after an applicable category is granted.
 * Injects the same async bootstrap as the legacy head loader; relies on CSP `strict-dynamic`
 * trust from the already-nonce'd Next.js runtime.
 */
export function loadGoogleTagManager(gtmId: string): boolean {
  const w = getConsentWindow();
  if (!w || !gtmId) return false;
  if (w.__consertifyGtmLoaded === gtmId) return false;
  if (document.querySelector(`script[data-consertify-gtm="${gtmId}"]`)) {
    w.__consertifyGtmLoaded = gtmId;
    return false;
  }

  ensureGtagQueue();
  w.dataLayer!.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  script.dataset.consertifyGtm = gtmId;
  document.head.appendChild(script);
  w.__consertifyGtmLoaded = gtmId;
  return true;
}

/**
 * Sync path for returning visitors with a granting cookie: establish consent before child
 * effects push funnel events, then load GTM when an optional category is granted.
 */
export function syncConsentAndMaybeLoadGtm(
  decision: ConsentDecision | null,
  gtmId: string | undefined,
): void {
  if (!decision) return;
  applyConsentMode(decision);
  if (gtmId && shouldLoadGtm(decision)) {
    loadGoogleTagManager(gtmId);
  }
}

/** Test helper — reset page-lifetime guards. */
export function __resetConsentRuntimeForTests(): void {
  const w = getConsentWindow();
  if (!w) return;
  delete w.__consertifyConsentApplied;
  delete w.__consertifyGtmLoaded;
}
