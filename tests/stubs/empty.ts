// Empty module used to stub `server-only` / `client-only` during tests, where the React Server
// Component boundary that those guards rely on does not exist. The real build still enforces the
// boundary; this only prevents the guard from throwing inside the test runner.
export {};
