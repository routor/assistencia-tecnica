/**
 * Bounded, inert campaign attribution (FR-030, FR-032, SEC-016).
 *
 * Only the supported UTM keys and `gclid` are read from the URL; everything else is discarded.
 * Values are trimmed and length-bounded. They are NEVER trusted as authority (vertical/path) and
 * NEVER interpolated into HTML. For analytics, only `gclid_present` (boolean) is exposed — never the
 * raw gclid value.
 */

const UTM_MAX = 200;
const GCLID_MAX = 256;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
};

type RawSearchParams =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function firstValue(
  params: RawSearchParams,
  key: string,
): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const v = params[key];
  if (Array.isArray(v)) return v[0];
  return v ?? undefined;
}

function bound(value: string | undefined, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed.length > max) return undefined;
  return trimmed;
}

export function parseAttribution(params: RawSearchParams): Attribution {
  const out: Attribution = {};
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
  for (const key of utmKeys) {
    const value = bound(firstValue(params, key), UTM_MAX);
    if (value !== undefined) out[key] = value;
  }
  const gclid = bound(firstValue(params, "gclid"), GCLID_MAX);
  if (gclid !== undefined) out.gclid = gclid;
  return out;
}

/** Analytics props: approved UTM fields + `gclid_present` boolean. NEVER the raw gclid. */
export function attributionAnalyticsProps(a: Attribution): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid_present: boolean;
} {
  return {
    ...(a.utm_source ? { utm_source: a.utm_source } : {}),
    ...(a.utm_medium ? { utm_medium: a.utm_medium } : {}),
    ...(a.utm_campaign ? { utm_campaign: a.utm_campaign } : {}),
    ...(a.utm_term ? { utm_term: a.utm_term } : {}),
    ...(a.utm_content ? { utm_content: a.utm_content } : {}),
    gclid_present: Boolean(a.gclid),
  };
}
