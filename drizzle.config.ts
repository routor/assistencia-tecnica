import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit reads DATABASE_URL from the environment. Migrations are generated
 * into db/migrations and are reviewed, committed, and replayable from empty
 * (data-model.md §Migration Requirements). No provider-specific extensions.
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for drizzle-kit. Set it in your local environment; never commit it.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  strict: true,
  verbose: true,
  dbCredentials: {
    url: databaseUrl,
  },
});
