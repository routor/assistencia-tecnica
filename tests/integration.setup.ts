// Integration test setup (runs in the node project).
// Points the app's DATABASE_URL at the isolated disposable test database (CTR-003) and fails fast
// if it is not configured, so integration tests never accidentally touch a real database.
import { beforeAll } from "vitest";

beforeAll(() => {
  const testUrl = process.env.TEST_DATABASE_URL;
  if (!testUrl) {
    throw new Error(
      "TEST_DATABASE_URL is required for integration tests (isolated disposable PostgreSQL).",
    );
  }
  // The app reads DATABASE_URL; bind it to the test database for the duration of the run.
  process.env.DATABASE_URL = testUrl;
});
