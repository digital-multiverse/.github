# TypeScript Guidelines — Digital Multiverse

## Compiler config

Always run with `strict: true`. No exceptions.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Types

```typescript
// ✅ Explicit param and return types
async function getUserById(id: string): Promise<User | null> { ... }

// ❌ Implicit any
async function getUserById(id) { ... }

// ✅ Use unknown + narrow over any
function processInput(input: unknown): string {
  if (typeof input !== 'string') throw new Error('Expected string');
  return input.trim();
}

// ✅ interface for extensible shapes
interface UserProfile {
  id: string;
  name: string;
}

// ✅ type for unions and computed types
type ApiResult<T> = { data: T } | { error: string };
type UserId = string & { readonly brand: unique symbol };
```

## Null handling

```typescript
// ✅ ?? for null/undefined coalescing
const name = user.name ?? 'Anonymous';

// ❌ || swallows falsy values (0, '', false)
const name = user.name || 'Anonymous';

// ✅ Optional chaining for nested access
const city = user?.address?.city;

// ✅ Non-null assertion only when you are certain (rare)
const el = document.getElementById('root')!;
```

## Utility types

Prefer utility types over manual repetition:

```typescript
// Partial, Required, Pick, Omit
type CreateUserDto = Omit<User, 'id' | 'createdAt'>;
type UpdateUserDto = Partial<CreateUserDto>;

// ReturnType, Parameters
type HandlerReturn = ReturnType<typeof createHandler>;
```

## Enums vs union types

Prefer string union types over enums — they are simpler and tree-shake better:

```typescript
// ✅ Preferred
type UserRole = 'admin' | 'member' | 'guest';

// ❌ Avoid (unless you need reverse mapping)
enum UserRole { Admin = 'admin', Member = 'member' }
```

## JSDoc

Required for all public APIs. No `@example` tags.

```typescript
/**
 * Fetches a user by their unique identifier.
 *
 * @param id - The user's UUID
 * @returns The user if found, null otherwise
 * @throws {DatabaseError} If the database query fails
 */
async function getUserById(id: string): Promise<User | null> { ... }
```
