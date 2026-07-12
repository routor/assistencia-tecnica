/** Persisted preference — no PII, no advertising IDs, no form answers. */
export type ConsentDecision = {
  version: string;
  analytics: boolean;
  advertising: boolean;
  /** Unix seconds when the choice was recorded (technical audit aid only). */
  updatedAt: number;
};

export type ConsentModeSignals = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};

export type ConsentUiState = {
  decision: ConsentDecision | null;
  bannerOpen: boolean;
  preferencesOpen: boolean;
};
