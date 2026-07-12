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
  __consertifyLastDecision?: ConsentDecision;
};

/** ms Google tags should wait for a CMP update before assuming the default (Basic CM). */
const CONSENT_WAIT_FOR_UPDATE_MS = 500;

function getConsentWindow(): ConsentWindow | null {
  if (typeof window === "undefined") return null;
  return window as ConsentWindow;
}

/**
 * Ensure `dataLayer` + `gtag` exist locally. This does NOT load GTM or contact Google.
 * Safe to call before any authorization (queue stays first-party until gtm.js loads).
 *
 * Uses the official `arguments` object (not a rest-parameter Array). Google's gtag/GTM
 * consent processor historically keys off Arguments-like pushes from `gtag()`; a plain
 * Array can be left unapplied (`gcd=…l…` = signal not set) while cookies still write.
 */
export function ensureGtagQueue(): GtagCommand | null {
  const w = getConsentWindow();
  if (!w) return null;
  w.dataLayer = Array.isArray(w.dataLayer) ? w.dataLayer : [];
  if (typeof w.gtag !== "function") {
    w.gtag = function gtag(this: void) {
      // Mirror Google's stub: dataLayer.push(arguments) — not [...args].
      // eslint-disable-next-line prefer-rest-params -- Consent Mode requires Arguments
      w.dataLayer!.push(arguments);
    } as GtagCommand;
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
  w.__consertifyLastDecision = decision;

  if (!w.__consertifyConsentApplied) {
    gtag("consent", "default", {
      ...DENIED_CONSENT_SIGNALS,
      wait_for_update: CONSENT_WAIT_FOR_UPDATE_MS,
    });
    gtag("consent", "update", { ...signals });
  } else if (w.__consertifyConsentApplied !== key) {
    gtag("consent", "update", { ...signals });
  }
  w.__consertifyConsentApplied = key;
}

/** Re-assert the latest decision after gtm.js boots (queued consent can be missed). */
function reassertConsentAfterGtmLoad(): void {
  const w = getConsentWindow();
  const decision = w?.__consertifyLastDecision;
  if (!w || !decision) return;
  const gtag = ensureGtagQueue();
  if (!gtag) return;
  gtag("consent", "update", { ...toConsentModeSignals(decision) });
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
  script.addEventListener("load", reassertConsentAfterGtmLoad, { once: true });
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
  delete w.__consertifyLastDecision;
}
