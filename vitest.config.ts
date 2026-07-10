import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": rootDir.replace(/\/$/, ""),
      // The RSC boundary guards do not exist in the test runner; stub them so importing a
      // server module under test does not throw. The real build still enforces the boundary.
      "server-only": `${rootDir}tests/stubs/empty.ts`,
      "client-only": `${rootDir}tests/stubs/empty.ts`,
    },
  },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./tests/setup.ts"],
          include: ["tests/unit/**/*.test.{ts,tsx}"],
          css: false,
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          setupFiles: ["./tests/integration.setup.ts"],
          include: ["tests/integration/**/*.test.ts"],
          // Integration tests hit a real disposable PostgreSQL and must not run in parallel
          // across files against the same database.
          fileParallelism: false,
          hookTimeout: 30_000,
          testTimeout: 30_000,
        },
      },
    ],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: ["lib/**", "components/**"],
      exclude: ["**/*.d.ts", "tests/**"],
    },
  },
});
