# JSDoc Guidelines

## Always include

- `@param {Type} name` — for EVERY parameter, no exceptions
- `@returns {Type}` — for ALL return values including void (document side effects)
- `@throws {ErrorType}` — for ALL errors that can be thrown
- One-line description: what it does, not how

## Optional (use when helpful)

- `@link` — reference related classes or external docs
- `@see` — reference related resources

## Never use

- `@example` — not used in this codebase
- Redundant info TypeScript already conveys
- Implementation details

## Format

```typescript
/**
 * Brief description of what the function does
 *
 * Additional context for non-obvious behaviour.
 *
 * @param {string} id - The entity's unique identifier
 * @param {Options} options - Configuration options
 * @returns {Promise<Entity>} The found entity
 * @throws {NotFoundError} If entity with given id does not exist
 * @throws {DatabaseError} If the database query fails
 */
async function getEntityById(id: string, options: Options): Promise<Entity> { ... }
```

## When to document

**Always:** exported functions, public class methods, exported interfaces/types with non-obvious fields.

**Skip:** private implementation details, trivial getters/setters, self-explanatory one-liners.
