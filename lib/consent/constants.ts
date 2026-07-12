/**
 * First-party cookie consent (Basic Consent Mode v2). Separate from the lead-form
 * `PRIVACY_NOTICE_VERSION` — form consent stores the lead; this versions only the
 * cookie/analytics preference record.
 */

/** Bump when cookie categories, purposes, or Consent Mode mapping change materially. */
export const COOKIE_CONSENT_VERSION = "2026-07-12" as const;

/** Cookie name — non-HttpOnly so the client CMP can read/write the choice. */
export const CONSENT_COOKIE_NAME = "consertify_consent" as const;

/**
 * Technical retention of the preference record (not a legal claim). Aligned with the
 * project's lead retention horizon (180 days) as a reasonable revisit interval.
 */
export const CONSENT_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

export type ConsentCategory = "necessary" | "analytics" | "advertising";
