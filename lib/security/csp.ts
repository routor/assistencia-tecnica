/**
 * Content-Security-Policy builder (NFR-011, SEC-016, R-008).
 *
 * - script-src is strict: 'self' + per-request nonce + 'strict-dynamic'. `unsafe-eval` is allowed
 *   ONLY in development (never production). No wildcard, no blanket `https:`.
 * - Google origins (GTM/GA/Ads) are added ONLY when a GTM container is configured. With no GTM the
 *   policy is self-only (maximally strict) — missing GTM origins block conversion validation rather
 *   than inviting a broad wildcard.
 * - style-src permits 'unsafe-inline' (styles cannot execute/exfiltrate; this is a narrow, low-risk
 *   allowance for framework/analytics-injected styles) while scripts remain nonce-gated.
 */

// Minimal set of Google origins needed by GTM + GA4 + Google Ads.
const GTM = "https://www.googletagmanager.com";
const GA = ["https://www.google-analytics.com", "https://region1.google-analytics.com"];
/** GA4 g/collect endpoint (connect-src only; not needed for img/frame). */
const GA_CONNECT = ["https://analytics.google.com"];
/**
 * GA4 → Google Ads linker / Google signals beacon (connect-src). Observed in production when
 * GA4 and Ads share a container; missing this origin surfaces as blocked:csp on console.
 */
const GA_ADS_LINKER = "https://stats.g.doubleclick.net";
const ADS = ["https://www.google.com", "https://googleads.g.doubleclick.net"];
const ADS_FRAME = "https://td.doubleclick.net";
/**
 * Google Ads CCM / conversion endpoints (connect-src; googleadservices also needed in img-src).
 * www.google.com.br is required in connect-src for BR first-party conversion fetch
 * (/pagead/1p-conversion/…), not only as an img-src pixel host.
 */
const ADS_CONNECT = [
  "https://ad.doubleclick.net",
  "https://www.googleadservices.com",
  "https://www.google.com.br",
];
/**
 * Google Ads pixels (img-src extras):
 * - www.google.com.br — ga-audiences + 1p conversion on BR ccTLD
 * - www.googleadservices.com — CCM conversion beacon (/ccm/conversion/…)
 */
const ADS_IMG = ["https://www.google.com.br", "https://www.googleadservices.com"];

export type CspOptions = {
  nonce: string;
  isDev: boolean;
  gtmEnabled: boolean;
};

export function buildContentSecurityPolicy({ nonce, isDev, gtmEnabled }: CspOptions): string {
  const scriptExtra = isDev ? " 'unsafe-eval'" : "";

  const connect = [
    "'self'",
    ...(gtmEnabled
      ? [GTM, ...GA, ...GA_CONNECT, GA_ADS_LINKER, ...ADS, ...ADS_CONNECT]
      : []),
  ];
  const img = [
    "'self'",
    "data:",
    "blob:",
    ...(gtmEnabled ? [GTM, ...GA, ...ADS, ...ADS_IMG] : []),
  ];
  const frame = gtmEnabled ? [GTM, ADS_FRAME] : ["'none'"];

  const directives: Record<string, string> = {
    "default-src": "'self'",
    "base-uri": "'self'",
    "script-src": `'self' 'nonce-${nonce}' 'strict-dynamic'${scriptExtra}`,
    "style-src": "'self' 'unsafe-inline'",
    "img-src": img.join(" "),
    "font-src": "'self' data:",
    "connect-src": connect.join(" "),
    "frame-src": frame.join(" "),
    "object-src": "'none'",
    "form-action": "'self'",
    "frame-ancestors": "'none'",
    "manifest-src": "'self'",
  };

  const parts = Object.entries(directives).map(([k, v]) => `${k} ${v}`);
  // Force HTTPS in production only (localhost is plain HTTP).
  if (!isDev) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}
