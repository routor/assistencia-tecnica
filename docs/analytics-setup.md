# Analytics Setup — GTM / GA4 / Google Ads (manual configuration)

Privacy-safe measurement for `/assistencia-tecnica` (CTR-002, FR-031..FR-037). The app pushes a
fixed, allowlisted event vocabulary to `dataLayer`; GTM/GA4/Ads are configured **manually** in the
respective consoles. **No real container/measurement/conversion IDs are committed** — they are
supplied via `NEXT_PUBLIC_GTM_ID` and the external consoles before campaign release (PD-004).

## 1. Container

- Set `NEXT_PUBLIC_GTM_ID` (format `GTM-XXXXXXX`) in the environment. When empty, the GTM loader is
  not rendered and analytics is silently disabled (the form still works).
- The loader is a nonce'd, async inline bootstrap (`components/analytics/google-tag-manager.tsx`).
  The CSP already allows the required Google origins **only when GTM is enabled** (see `lib/security/csp.ts`).

## 2. dataLayer events (the only source of truth)

The app pushes exactly these nine events; unknown events/properties are dropped:

| Event | When | Notes |
|---|---|---|
| `landing_view` | landing view mount | carries UTM fields + `gclid_present` |
| `primary_cta_click` | any primary CTA | `cta_location` = hero \| mid_page \| form \| footer |
| `lead_form_start` | first form interaction | once per session |
| `lead_form_step_1_complete` | valid step 1 → step 2 | `form_step: 1` |
| `lead_form_validation_error` | a failed step/submit | `form_step`; no values |
| `lead_submit_attempt` | one enabled submit begins | once per accepted attempt |
| `lead_submit_success` | server returned success | **exactly once**; the only Ads conversion event |
| `lead_submit_error` | retryable error | |
| `thank_you_view` | thank-you view shown | never substitutes for submit success |

### Approved properties (allowlist)

`vertical` (fixed), `landing_path` (fixed), `cta_location`, `form_step`, `utm_source`, `utm_medium`,
`utm_campaign`, `utm_term`, `utm_content`, `gclid_present` (boolean). Everything else is dropped.

## 3. GTM configuration

**Variables** (Data Layer Variables): `event`, `vertical`, `landing_path`, `cta_location`,
`form_step`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid_present`.

**Triggers** (Custom Event, event name equals):
- `ce_landing_view`, `ce_primary_cta_click`, `ce_lead_form_start`, `ce_lead_form_step_1_complete`,
  `ce_lead_form_validation_error`, `ce_lead_submit_attempt`, `ce_lead_submit_success`,
  `ce_lead_submit_error`, `ce_thank_you_view`.

**Tags**:
- **GA4 Configuration** tag (Measurement ID `G-XXXXXXX`) on `landing_view` (or All Pages).
- **GA4 Event** tags mapping each dataLayer event to a GA4 event of the same name, passing only the
  approved properties as event parameters.
- **Google Ads Conversion** tag fired **only** on `ce_lead_submit_success` (conversion ID/label from
  the Ads console). It must NOT fire on a thank-you pageview/URL.

## 4. GA4 → reporting

- Mark `lead_submit_success` as a key event (conversion) in GA4.
- **Canonical qualified-lead metric = unique rows in PostgreSQL**, not browser `lead_submit_success`
  count. Because inserted/existing outcomes are deliberately identical (privacy), a genuine repeat
  submission can increment the browser/Ads success count. Campaign reporting MUST state this and use
  the database unique-row count as the primary number (spec §Recorded Risks).

## 5. Prohibited data (never send)

Name, business name, phone/WhatsApp, email, city, state, lead/database ID, **raw `gclid`**, any open
or selected answer (segment, bottleneck, features, price…), consent detail, IP, fingerprint, error
stack, SQL, and full form/action objects (CTR-002 §Forbidden). Only `gclid_present` (boolean) is
allowed, never the value.

## 6. Preview & readback (before campaign release)

- Use GTM Preview to confirm each event fires once with only approved parameters and no PII.
- Confirm the Ads conversion fires only on `lead_submit_success`.
- Record (without secrets) the container/measurement/conversion IDs' presence and the preview
  result. Missing IDs keep the campaign gate **BLOCKED** — do not hardcode placeholders as real.
