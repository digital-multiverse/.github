# Code Comments Guidelines

## Types of comments

**File headers** — for config files and scripts where JSDoc doesn't apply:
```typescript
// ==============================================================================
// filename.ts — Brief description
// ==============================================================================
```

**Section separators** — for large files (use sparingly, prefer splitting the file):
```typescript
// ==============================================================================
// Section Name
// ==============================================================================
```

**Inline comments** — only for non-obvious logic or decisions:
```typescript
// Epsilon tolerance for floating-point comparison — see ADR-005
const isEqual = Math.abs(a - b) < EPSILON;
```

## Rules

- Never leave commented-out code — delete it, git has history
- Never explain WHAT the code does (the code shows that)
- Only explain WHY when the reason is non-obvious
- TODO comments must reference a backlog item: `// TODO: T-042 — add rate limiting`
- No `console.log` in committed code — use the logger

## When JSDoc vs inline comment

| Scenario | Use |
|---|---|
| Public function or exported API | JSDoc |
| Complex algorithm or business rule | Inline comment (WHY) |
| Non-obvious constant value | Inline comment |
| Configuration file structure | File header + section separators |
| Anything else | Nothing |
