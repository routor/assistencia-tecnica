export {
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_SECONDS,
  COOKIE_CONSENT_VERSION,
} from "./constants";
export type { ConsentCategory } from "./constants";
export {
  acceptAllDecision,
  buildDecision,
  clearConsentCookie,
  DENIED_CONSENT_SIGNALS,
  formatConsentCookie,
  parseConsentCookieValue,
  readConsentCookieFromDocument,
  rejectOptionalDecision,
  serializeConsentCookieValue,
  shouldLoadGtm,
  toConsentModeSignals,
  writeConsentCookie,
} from "./storage";
export {
  applyConsentMode,
  ensureGtagQueue,
  loadGoogleTagManager,
  syncConsentAndMaybeLoadGtm,
  __resetConsentRuntimeForTests,
} from "./consent-mode";
export type { ConsentDecision, ConsentModeSignals, ConsentUiState } from "./types";
