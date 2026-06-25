# Error Handling Guidelines — Digital Multiverse

## Rules

- Always `try/catch` async operations — never let promises fail silently
- Never empty catch blocks — either handle or re-throw with context
- Never expose internal errors or stack traces to clients
- Use custom error classes for domain errors
- Log errors with context; never log PII

## TypeScript / Node patterns

```typescript
// ✅ Proper async error handling
async function fetchUser(id: string): Promise<User> {
  try {
    const result = await db.query<User>(`SELECT * FROM user WHERE id = $id`, { id });
    if (!result) throw new NotFoundError(`User ${id} not found`);
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) throw error; // re-throw domain errors
    throw new DatabaseError(`Failed to fetch user: ${getErrorMessage(error)}`);
  }
}

// Helper to safely extract message from unknown errors
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// ❌ Never
async function fetchUser(id: string) {
  try {
    return await db.query(id);
  } catch {} // swallowed
}
```

## Custom error classes

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}
```

## Rust patterns

```rust
// ✅ Use ? for propagation, no .unwrap() in production
async fn fetch_user(id: &str) -> Result<User, AppError> {
    let user = db.query_one::<User>(id).await
        .map_err(|e| AppError::Database(e.to_string()))?;
    Ok(user)
}

// ❌ Panics in production code
let user = db.query_one::<User>(id).await.unwrap();
```

## API error responses

Return generic, consistent error shapes to clients:

```typescript
// ✅ Safe client response
res.status(404).json({ error: 'Resource not found', code: 'NOT_FOUND' });

// ❌ Leaks internal info
res.status(500).json({ error: error.stack });
```
