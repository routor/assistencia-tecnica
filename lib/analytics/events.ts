import { LANDING_PATH, VERTICAL } from "@/lib/constants";

/**
 * Privacy-safe analytics (CTR-002, FR-031..FR-034, NFR-010).
 *
 * A typed, allowlisted `dataLayer` helper:
 * - only the nine approved events may be pushed;
 * - only approved, non-PII properties survive; everything else is dropped;
 * - a raw `gclid` is never allowed — only the boolean `gclid_present`;
 * - a missing/blocked GTM never throws (failure isolation).
 */

export const ANALYTICS_EVENTS = [
  "landing_view",
  "primary_cta_click",
  "lead_form_start",
  "lead_form_step_1_complete",
  "lead_form_validation_error",
  "lead_submit_attempt",
  "lead_submit_success",
  "lead_submit_error",
  "thank_you_view",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

const EVENT_SET: ReadonlySet<string> = new Set(ANALYTICS_EVENTS);
export { EVENT_SET as ANALYTICS_EVENT_SET };

export type CtaLocation = "hero" | "mid_page" | "form" | "footer";
export type FormStep = 1 | 2;

export type ApprovedProperties = {
  cta_location?: CtaLocation;
  form_step?: FormStep;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  gclid_present?: boolean;
};

// `vertical` and `landing_path` are always injected by the helper (fixed), so they are approved but
// callers never pass them.
export const APPROVED_PROPERTIES: ReadonlySet<string> = new Set([
  "vertical",
  "landing_path",
  "cta_location",
  "form_step",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid_present",
]);

const isDevOrTest =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

/** Keep only approved property keys; drop everything else (PII, open answers, raw gclid, …). */
export function sanitizeEventProperties(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!APPROVED_PROPERTIES.has(key)) continue;
    if (value === undefined) continue;
    clean[key] = value;
  }
  return clean;
}

function getDataLayer(): unknown[] | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { dataLayer?: unknown[] };
  return Array.isArray(w.dataLayer) ? w.dataLayer : null;
}

/**
 * Push an approved event. Unknown event names throw in dev/test (to catch mistakes) and are dropped
 * silently in production. `vertical` and `landing_path` are always attached.
 */
export function pushAnalyticsEvent(
  event: AnalyticsEvent,
  props: ApprovedProperties = {},
): void {
  if (!EVENT_SET.has(event)) {
    if (isDevOrTest) {
      throw new Error(`Blocked non-approved analytics event: ${String(event)}`);
    }
    return;
  }
  const payload = {
    event,
    vertical: VERTICAL,
    landing_path: LANDING_PATH,
    ...sanitizeEventProperties(props as Record<string, unknown>),
  };
  try {
    const dataLayer = getDataLayer();
    if (dataLayer) dataLayer.push(payload);
    // No dataLayer -> analytics disabled/blocked; do nothing (never block the app).
  } catch {
    // Never let analytics throw into the app.
  }
}
