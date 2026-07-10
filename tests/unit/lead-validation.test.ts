import { describe, expect, it } from "vitest";
import {
  buildAnswers,
  buildLeadRecord,
  leadSubmissionSchema,
  normalizeWhatsApp,
} from "@/lib/validation/lead";
import { LANDING_PATH, PRIVACY_NOTICE_VERSION, VERTICAL } from "@/lib/constants";

const validInput = () => ({
  name: "  Ana Souza  ",
  business_name: "Tech Bancada",
  whatsapp: "+55 (11) 98888-7777",
  email: "  ANA@Example.COM ",
  segment: "celulares_tablets",
  team_size: "2_3",
  monthly_intakes: "31_100",
  current_process: "planilha",
  main_bottleneck: "status_cliente",
  priority_features: ["ficha_aparelho", "status", "orcamento"],
  customer_status_frequency: "diariamente",
  price_range: "130_199",
  interview_permission: true,
  privacy_consent: true,
});

describe("normalizeWhatsApp (SEC-016, edge cases)", () => {
  it("strips punctuation/spaces and keeps 10–15 digits", () => {
    expect(normalizeWhatsApp("+55 (11) 98888-7777")).toEqual({ ok: true, value: "5511988887777" });
    expect(normalizeWhatsApp("11 3333-4444")).toEqual({ ok: true, value: "1133334444" });
  });
  it("rejects too few / too many / non-digit content", () => {
    expect(normalizeWhatsApp("123").ok).toBe(false);
    expect(normalizeWhatsApp("1".repeat(16)).ok).toBe(false);
    expect(normalizeWhatsApp("abcdef").ok).toBe(false);
    expect(normalizeWhatsApp("").ok).toBe(false);
  });
});

describe("leadSubmissionSchema (FR-014..FR-025, CTR-001)", () => {
  it("accepts a valid payload and normalizes name/email/whatsapp", () => {
    const r = leadSubmissionSchema.safeParse(validInput());
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.name).toBe("Ana Souza");
      expect(r.data.email).toBe("ana@example.com");
      expect(r.data.whatsapp_normalized).toBe("5511988887777");
    }
  });

  it("treats empty optional email as null", () => {
    const r = leadSubmissionSchema.safeParse({ ...validInput(), email: "" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBeNull();
  });

  it("rejects missing consent (never default true)", () => {
    const r = leadSubmissionSchema.safeParse({ ...validInput(), privacy_consent: false });
    expect(r.success).toBe(false);
  });

  it.each([
    ["segment", "aviao"],
    ["team_size", "99"],
    ["monthly_intakes", "muitos"],
    ["current_process", "telepatia"],
    ["main_bottleneck", "nada"],
    ["customer_status_frequency", "as_vezes"],
    ["price_range", "de_graca"],
  ])("rejects an out-of-enum %s", (field, bad) => {
    const r = leadSubmissionSchema.safeParse({ ...validInput(), [field]: bad });
    expect(r.success).toBe(false);
  });

  it("rejects too-short name and too-long business name", () => {
    expect(leadSubmissionSchema.safeParse({ ...validInput(), name: "A" }).success).toBe(false);
    expect(
      leadSubmissionSchema.safeParse({ ...validInput(), business_name: "x".repeat(121) }).success,
    ).toBe(false);
  });

  it("enforces 1–5 unique priority features", () => {
    expect(leadSubmissionSchema.safeParse({ ...validInput(), priority_features: [] }).success).toBe(
      false,
    );
    expect(
      leadSubmissionSchema.safeParse({
        ...validInput(),
        priority_features: ["fotos", "fotos"],
      }).success,
    ).toBe(false);
    expect(
      leadSubmissionSchema.safeParse({
        ...validInput(),
        priority_features: ["ficha_aparelho", "fotos", "imei_serie", "status", "orcamento", "garantia"],
      }).success,
    ).toBe(false);
    expect(
      leadSubmissionSchema.safeParse({ ...validInput(), priority_features: ["invalido"] }).success,
    ).toBe(false);
  });

  it("bounds attribution and discards unknown keys; hostile strings stay inert text", () => {
    const r = leadSubmissionSchema.safeParse({
      ...validInput(),
      utm_source: "google",
      utm_campaign: "x".repeat(500), // too long
      gclid: "abc",
      evil: "<script>alert(1)</script>",
    } as Record<string, unknown>);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.utm_source).toBe("google");
      expect(r.data.utm_campaign).toBeNull(); // over-long -> dropped to null, not an error
      expect((r.data as Record<string, unknown>).evil).toBeUndefined();
    }
  });

  it("keeps a hostile string in a free field as literal text (never executed)", () => {
    const r = leadSubmissionSchema.safeParse({
      ...validInput(),
      name: "<img src=x onerror=alert(1)>",
    });
    // 2..100 chars, so it is accepted as literal text; escaping happens at render time.
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.name).toBe("<img src=x onerror=alert(1)>");
  });
});

describe("buildAnswers / buildLeadRecord (FR-026, FR-027, server authority)", () => {
  it("builds the structured answers object with segment as a single-item category array", () => {
    const parsed = leadSubmissionSchema.parse(validInput());
    const answers = buildAnswers(parsed);
    expect(answers.repair_categories).toEqual(["celulares_tablets"]);
    expect(answers.team_size).toBe("2_3");
    expect(answers.priority_features).toEqual(["ficha_aparelho", "status", "orcamento"]);
  });

  it("sets vertical, landing_path, consent time and notice version from the SERVER, ignoring client claims", () => {
    const parsed = leadSubmissionSchema.parse({
      ...validInput(),
      // Attacker-supplied authority fields must be ignored:
      vertical: "outro-vertical",
      landing_path: "/hackeado",
      consented_at: "1999-01-01",
      privacy_notice_version: "fake",
    } as Record<string, unknown>);
    const now = new Date("2026-07-09T12:00:00Z");
    const record = buildLeadRecord(parsed, { now });
    expect(record.vertical).toBe(VERTICAL);
    expect(record.landingPath).toBe(LANDING_PATH);
    expect(record.privacyNoticeVersion).toBe(PRIVACY_NOTICE_VERSION);
    expect(record.consentedAt).toEqual(now);
    expect(record.privacyConsent).toBe(true);
    // Not-collected columns are explicitly null for cross-vertical comparability.
    expect(record.city).toBeNull();
    expect(record.state).toBeNull();
  });
});
