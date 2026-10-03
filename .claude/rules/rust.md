---
globs: ["**/*.rs"]
---

# Rust Rules (auto-loaded for .rs files)

- `snake_case` for functions/variables; `PascalCase` for types/structs/enums
- `Result<T, E>` and `Option<T>` over panicking
- `?` operator for error propagation — no `.unwrap()` in production code
- `cargo clippy -- -D warnings` must pass with zero warnings
- No `.expect()` in production paths — use proper error handling
- Prefer `impl Trait` in function signatures over generic bounds where possible
