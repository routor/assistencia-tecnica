/**
 * Server-authoritative constants (SEC-016, FR-027). These are the ONLY source of truth for the
 * vertical and landing path — client-submitted values for these fields are always ignored and
 * overwritten with the constants below.
 */
export const VERTICAL = "assistencia-tecnica" as const;
export const LANDING_PATH = "/assistencia-tecnica" as const;
export const THANK_YOU_PATH = "/obrigado" as const;
export const THANK_YOU_URL = "/obrigado?vertical=assistencia-tecnica" as const;
export const PRIVACY_PATH = "/privacidade" as const;

/**
 * Version identifier of the privacy notice accepted at submission time (data-model.md
 * `privacy_notice_version`). Bump when the privacy notice materially changes.
 */
export const PRIVACY_NOTICE_VERSION = "2026-07-09" as const;

export type Vertical = typeof VERTICAL;
