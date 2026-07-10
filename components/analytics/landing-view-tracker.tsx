"use client";

import { useEffect, useRef } from "react";
import { pushAnalyticsEvent, type ApprovedProperties } from "@/lib/analytics/events";

/**
 * Emits `landing_view` exactly once on mount (CTR-002), carrying only approved attribution props
 * (UTM fields + `gclid_present`). Never sends a raw gclid or any PII.
 */
export function LandingViewTracker({ analyticsProps }: { analyticsProps: ApprovedProperties }) {
  const emitted = useRef(false);
  useEffect(() => {
    if (emitted.current) return;
    emitted.current = true;
    pushAnalyticsEvent("landing_view", analyticsProps);
  }, [analyticsProps]);
  return null;
}
