import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import { getServerEnv } from "@/lib/env";

/**
 * Server-only pooled PostgreSQL connection (SEC-013, SEC-015, NFR-009/010, R-003).
 *
 * - `server-only` prevents this module (and the DATABASE_URL secret) from ever entering a client
 *   bundle.
 * - Provider-neutral Postgres.js driver + Drizzle; no proprietary provider API.
 * - The connection URL and query payloads are NEVER logged (`onnotice` silenced; no debug logging).
 * - A single pooled client is reused across invocations (guarded on the Node global in dev/HMR).
 */

const createClient = (url: string) =>
  postgres(url, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: true,
    // Do not surface server notices into application logs (avoids leaking any payload/detail).
    onnotice: () => {},
  });

type PgClient = ReturnType<typeof createClient>;

const globalForDb = globalThis as unknown as {
  __leadsPgClient?: PgClient;
};

function getClient(): PgClient {
  if (!globalForDb.__leadsPgClient) {
    const { DATABASE_URL } = getServerEnv();
    globalForDb.__leadsPgClient = createClient(DATABASE_URL);
  }
  return globalForDb.__leadsPgClient;
}

export function getDb() {
  return drizzle(getClient(), { schema, logger: false });
}

export { schema };
