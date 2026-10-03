---
globs: ["**/*.tsx", "**/components/**/*.ts", "**/features/**/*.ts"]
---

# SolidJS Rules (auto-loaded for .tsx and component files)

- **Never destructure props** — breaks Proxy-based reactivity
- Use `<For>`, `<Show>`, `<Switch>` — never `.map()` in JSX
- No nested ternaries in JSX
- Components ≤ 150 lines — split if longer
- `import type { Component }` when `verbatimModuleSyntax` is on
- `createSignal` for local state; `createStore` only for nested reactive objects
- `createMemo` for derived state; `createEffect` for side effects (keep minimal)
