import { z } from "zod";

/**
 * Environment partition (CTR-003, NFR-010, SEC-013).
 *
 * - SERVER schema holds secrets + server-read policy content. It is never bundled to the client:
 *   `getServerEnv()` throws if reached in a browser context, and the only consumer of the secret
 *   (`lib/db.ts`) additionally imports `server-only` as a build-time guard.
 * - PUBLIC schema holds only `NEXT_PUBLIC_*` values that are safe to expose.
 *
 * Parsing never prints a variable's VALUE — only its NAME — so a misconfiguration cannot leak a
 * secret into logs, errors, or reports.
 */

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const postgresUrl = z
  .string()
  .min(1)
  .refine(
    (v) => /^postgres(ql)?:\/\//i.test(v),
    "must be a postgres:// or postgresql:// URL",
  );

const serverSchema = z.object({
  DATABASE_URL: postgresUrl,
  TEST_DATABASE_URL: z.preprocess(emptyToUndefined, postgresUrl.optional()),
  PRIVACY_CONTROLLER_NAME: z.preprocess(
    emptyToUndefined,
    z.string().min(1).max(200).optional(),
  ),
  PRIVACY_CONTACT: z.preprocess(
    emptyToUndefined,
    z.string().min(1).max(320).optional(),
  ),
  LEAD_RETENTION_DAYS: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().max(3650).optional(),
  ),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .url()
      .refine((v) => v.startsWith("https://"), "must be an absolute HTTPS origin")
      .optional(),
  ),
  NEXT_PUBLIC_GTM_ID: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .regex(/^GTM-[A-Z0-9]{4,10}$/, "must match GTM-XXXXXXX")
      .optional(),
  ),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type PublicEnv = z.infer<typeof publicSchema>;

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; missing: string[]; message: string };

function parse<T>(schema: z.ZodType<T>, raw: Record<string, unknown>): ParseResult<T> {
  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, value: result.data };
  // Collect only the offending variable NAMES — never their values.
  const missing = [...new Set(result.error.issues.map((i) => String(i.path[0])))];
  return {
    ok: false,
    missing,
    message: `Invalid or missing environment variable(s): ${missing.join(", ")}`,
  };
}

export const parseServerEnv = (raw: Record<string, unknown>): ParseResult<ServerEnv> =>
  parse(serverSchema, raw);

export const parsePublicEnv = (raw: Record<string, unknown>): ParseResult<PublicEnv> =>
  parse(publicSchema, raw);

let serverEnvCache: ServerEnv | null = null;
let publicEnvCache: PublicEnv | null = null;

/**
 * Server-only accessor. Throws (fail-closed) if the environment is invalid, or if it is somehow
 * reached in a browser context. Only variable NAMES appear in the thrown message.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must never be called in the browser.");
  }
  if (serverEnvCache) return serverEnvCache;
  const result = parseServerEnv(process.env as Record<string, unknown>);
  if (!result.ok) throw new Error(result.message);
  serverEnvCache = result.value;
  return serverEnvCache;
}

export function getPublicEnv(): PublicEnv {
  if (publicEnvCache) return publicEnvCache;
  // NEXT_PUBLIC_* values are statically inlined by Next; read them explicitly so the bundler can
  // replace them at build time.
  const raw = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  };
  const result = parsePublicEnv(raw);
  if (!result.ok) throw new Error(result.message);
  publicEnvCache = result.value;
  return publicEnvCache;
}

// Privacy policy content is parsed independently of the DB secret, so the privacy page renders
// even when DATABASE_URL is absent.
const policySchema = serverSchema.pick({
  PRIVACY_CONTROLLER_NAME: true,
  PRIVACY_CONTACT: true,
  LEAD_RETENTION_DAYS: true,
});

/**
 * Public policy content for the privacy page. `configured` is false until ALL of controller,
 * contact, and retention are supplied — the page then stays in fail-closed "not for production"
 * mode (FR-035, PD-003, CTR-004).
 */
export function getPrivacyPolicyConfig(): {
  configured: boolean;
  controllerName?: string;
  contact?: string;
  retentionDays?: number;
} {
  const parsed = policySchema.safeParse(process.env);
  const value = parsed.success ? parsed.data : {};
  const configured = Boolean(
    value.PRIVACY_CONTROLLER_NAME && value.PRIVACY_CONTACT && value.LEAD_RETENTION_DAYS,
  );
  return {
    configured,
    controllerName: value.PRIVACY_CONTROLLER_NAME,
    contact: value.PRIVACY_CONTACT,
    retentionDays: value.LEAD_RETENTION_DAYS,
  };
}

// Reset helper for tests only.
export function __resetEnvCacheForTests(): void {
  serverEnvCache = null;
  publicEnvCache = null;
}
