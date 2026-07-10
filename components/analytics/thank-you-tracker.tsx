"use client";

import { useEffect, useRef } from "react";
import { pushAnalyticsEvent } from "@/lib/analytics/events";

/**
 * Emits `thank_you_view` exactly once when the supported thank-you view is presented (CTR-002).
 * Direct navigation here CANNOT emit `lead_submit_success` — only the persisted submission path
 * does. `thank_you_view` never substitutes for submit success.
 */
export function ThankYouTracker() {
  const emitted = useRef(false);
  useEffect(() => {
    if (emitted.current) return;
    emitted.current = true;
    pushAnalyticsEvent("thank_you_view");
  }, []);
  return null;
}
