# Clean Code Guidelines — Digital Multiverse

## Non-negotiable rules

- Functions ≤ 20 lines
- Max 4 nesting levels — use early returns to flatten
- No magic numbers or strings — use named constants
- Meaningful names, no abbreviations, no single-letter variables (except loop indices)
- One class / one responsibility per file
- Files ≤ 300 lines
- No commented-out code — delete it, git has history
- `const` over `let`; avoid `var`
- `async/await` over raw Promises
- Early returns over nested `if` blocks

## TypeScript specifics

- Explicit types for all function params and return values
- No `any` — use `unknown` and narrow, or define the type
- Prefer `interface` for object shapes that can be extended; `type` for unions/intersections
- Use utility types (`Partial`, `Required`, `Pick`, `Omit`, `ReturnType`) over manual repetition
- `??` not `||` for null/undefined checks
- `===` not `==`
- Optional chaining `?.` for nested property access
- No nested ternaries — use if/else or early returns

## Naming conventions

```typescript
// Variables and functions: camelCase
const userProfile = ...;
async function fetchUserById(id: string): Promise<User> { ... }

// Types and interfaces: PascalCase
interface UserProfile { ... }
type ApiResponse<T> = { data: T; error: string | null };

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;

// Files: kebab-case
// user-profile.ts, auth-middleware.ts
```

## Rust specifics

- Follow standard Rust naming: `snake_case` for functions/variables, `PascalCase` for types
- Prefer `Result<T, E>` and `Option<T>` over panicking
- Use `?` operator for error propagation — no `.unwrap()` in production code
- `clippy` must pass with no warnings (`cargo clippy -- -D warnings`)
