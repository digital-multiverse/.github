---
name: add-jsdoc
description: Add JSDoc to all exported functions, classes, and interfaces in a file or folder. Follows project JSDoc standards.
tools: Read, Write, Edit, MultiEdit, Glob, Grep
---

# Add JSDoc

## Standards

**Always include:**
- `@param {Type} name` — for EVERY parameter
- `@returns {Type}` — for ALL return values (including void if side effects)
- `@throws {ErrorType}` — for ALL errors that can be thrown
- One-line description (what it does, not how)

**Never include:**
- `@example` tags — not used in this codebase
- Redundant info TypeScript already conveys
- Implementation details (focus on WHAT and WHY)

## Template

```typescript
/**
 * Brief description of what the function does
 *
 * Additional context if non-obvious behaviour exists.
 *
 * @param {string} id - The entity's unique identifier
 * @param {Options} options - Configuration options
 * @returns {Promise<Entity>} The found entity
 * @throws {NotFoundError} If entity with given id does not exist
 * @throws {DatabaseError} If the database query fails
 */
```

## Steps

1. Ask user for file or folder path.
2. Find all exported functions, classes, interfaces, and type aliases.
3. For each, check if JSDoc exists and is complete.
4. Add or update JSDoc following the standard above.
5. Run `yarn type-check` to verify no type errors introduced.
6. Show summary: N items documented, N updated, N skipped (already complete).
