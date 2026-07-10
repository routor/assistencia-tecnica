import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Provide a router stub so client components using next/navigation render under jsdom.
export const routerPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: routerPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/assistencia-tecnica",
  useSearchParams: () => new URLSearchParams(),
}));

// Ensure a clean DOM between component tests and prevent state leakage.
afterEach(() => {
  cleanup();
});
