import {
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_SECONDS,
  COOKIE_CONSENT_VERSION,
} from "./constants";
import type { ConsentDecision } from "./types";

/** Default Consent Mode v2 signals before any authorization. */
export const DENIED_CONSENT_SIGNALS = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

/** Map first-party category choices to Google Consent Mode v2 storage signals. */
export function toConsentModeSignals(decision: ConsentDecision) {
  return {
    analytics_storage: decision.analytics ? ("granted" as const) : ("denied" as const),
    ad_storage: decision.advertising ? ("granted" as const) : ("denied" as const),
    ad_user_data: decision.advertising ? ("granted" as const) : ("denied" as const),
    ad_personalization: decision.advertising ? ("granted" as const) : ("denied" as const),
  };
}

/** GTM may load only when at least one optional category is granted. */
export function shouldLoadGtm(decision: ConsentDecision | null): boolean {
  return Boolean(decision && (decision.analytics || decision.advertising));
}

export function buildDecision(input: {
  analytics: boolean;
  advertising: boolean;
  updatedAt?: number;
}): ConsentDecision {
  return {
    version: COOKIE_CONSENT_VERSION,
    analytics: Boolean(input.analytics),
    advertising: Boolean(input.advertising),
    updatedAt: input.updatedAt ?? Math.floor(Date.now() / 1000),
  };
}

export function acceptAllDecision(): ConsentDecision {
  return buildDecision({ analytics: true, advertising: true });
}

export function rejectOptionalDecision(): ConsentDecision {
  return buildDecision({ analytics: false, advertising: false });
}

/**
 * Parse a cookie value. Returns null when missing, malformed, or version-mismatched
 * (version mismatch forces a fresh choice).
 */
export function parseConsentCookieValue(raw: string | undefined | null): ConsentDecision | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded) as Partial<ConsentDecision>;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== "boolean") return null;
    if (typeof parsed.advertising !== "boolean") return null;
    if (typeof parsed.updatedAt !== "number" || !Number.isFinite(parsed.updatedAt)) return null;
    return {
      version: COOKIE_CONSENT_VERSION,
      analytics: parsed.analytics,
      advertising: parsed.advertising,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function serializeConsentCookieValue(decision: ConsentDecision): string {
  return encodeURIComponent(
    JSON.stringify({
      version: decision.version,
      analytics: decision.analytics,
      advertising: decision.advertising,
      updatedAt: decision.updatedAt,
    }),
  );
}

/** Build `document.cookie` / Set-Cookie attribute string (client write). */
export function formatConsentCookie(decision: ConsentDecision, opts?: { secure?: boolean }): string {
  const secure =
    opts?.secure ??
    (typeof window !== "undefined" ? window.location.protocol === "https:" : true);
  const parts = [
    `${CONSENT_COOKIE_NAME}=${serializeConsentCookieValue(decision)}`,
    "Path=/",
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function readConsentCookieFromDocument(): ConsentDecision | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!match) return null;
  const value = match.slice(CONSENT_COOKIE_NAME.length + 1);
  return parseConsentCookieValue(value);
}

export function writeConsentCookie(decision: ConsentDecision): void {
  if (typeof document === "undefined") return;
  document.cookie = formatConsentCookie(decision);
}

/** Clear the preference cookie (forces banner on next visit / version ask). */
export function clearConsentCookie(): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export { CONSENT_COOKIE_NAME, CONSENT_MAX_AGE_SECONDS, COOKIE_CONSENT_VERSION };
