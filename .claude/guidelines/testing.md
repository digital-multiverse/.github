# Testing Guidelines — Digital Multiverse

## Philosophy

- Tests are first-class code. They follow the same quality standards as production code.
- Tests document intent — a passing test suite is the spec.
- Coverage target: ≥ 80% for all new code. Do not regress existing coverage.

## Structure — AAA pattern

Every test follows Arrange → Act → Assert:

```typescript
describe('calculateDiscount', () => {
  it('should apply 10% discount for premium users', () => {
    // Arrange
    const user = { tier: 'premium' };
    const price = 100;

    // Act
    const result = calculateDiscount(price, user);

    // Assert
    expect(result).toBe(90);
  });
});
```

## Rules

- One assertion per test (or one logical concept)
- `beforeEach` for fresh state — never `beforeAll` for mutable state
- Never `.toThrow()` without specifying the exact error message
- Never write a test without at least one assertion
- No implementation details in assertions — test behaviour, not internals
- Use `describe` blocks to group related tests logically

## Mocking

```typescript
// ✅ Mock at the boundary (external deps, I/O)
vi.mock('../db/client', () => ({ query: vi.fn() }));

// ❌ Don't mock internal pure functions — test them directly
```

Clear mocks between tests: set `clearMocks: true` in Vitest/Jest config.

## What to test

| Type | What |
|---|---|
| Unit | All public functions; happy path + edge cases + errors |
| Integration | API endpoints; DB interactions; service boundaries |
| Skip | Private implementation details; third-party library internals |

## Edge cases to always cover

- Null / undefined inputs
- Empty arrays / strings
- Boundary values (0, -1, max)
- Error conditions with specific messages

## TypeScript / Vitest (frontend, Node)

```bash
yarn test           # run all
yarn test:coverage  # with coverage report
yarn test:watch     # watch mode
```

## Rust

```bash
cargo test              # all tests
cargo test {name}       # specific test
cargo tarpaulin         # coverage (if installed)
```
