---
globs: ["**/*.test.ts", "**/*.spec.ts", "**/*.test.tsx", "**/*.spec.tsx"]
---

# Test File Rules (auto-loaded for test files)

- AAA pattern: Arrange → Act → Assert (labelled with comments)
- One assertion per test (or one logical concept)
- Descriptive names: "should [behaviour] when [condition]"
- ES6 imports only — never `require()` or `await import()`
- `jest.mock()` / `vi.mock()` at top level, before imports
- `beforeEach` for fresh state — never `beforeAll` for mutable state
- Never `.toThrow()` without specific error message
- Never write a test without at least one assertion
- Mock at the boundary (external deps, I/O) — not internal pure functions
