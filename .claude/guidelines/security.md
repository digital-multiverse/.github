# Security Guidelines — Digital Multiverse

## Non-negotiable rules

- **Never commit secrets.** No API keys, tokens, passwords, or credentials in code or git history.
- **Never expose SurrealDB credentials client-side.** Not via `VITE_*`, not via any env var readable in the browser. SurrealDB lives strictly behind the backend (Rust/Axum or Node).
- **Never trust user input.** Validate and sanitise everything before use.
- **No wildcard permissions** in any infrastructure config.
- **No PII in logs.** Strip personal data before logging.

## Environment variables

```bash
# .env.example — safe to commit, no real values
SURREAL_URL=http://localhost:8000
SURREAL_USER=root
SURREAL_PASS=

# .env — NEVER commit, in .gitignore
SURREAL_URL=https://db.internal
SURREAL_USER=app_user
SURREAL_PASS=real_secret_here
```

Validate at startup — fail fast if required vars are missing:

```typescript
const SURREAL_URL = process.env.SURREAL_URL;
if (!SURREAL_URL) throw new Error('SURREAL_URL env var is required');
```

## Input validation

- Validate type, format, length, and range of all inputs before processing
- Sanitise string inputs before use in queries or responses
- Use allow-lists not deny-lists for validation rules
- Return generic error messages to clients — never expose internal errors or stack traces

## Authentication

- Tokens stored in `httpOnly` cookies, never in `localStorage`
- Short-lived access tokens + refresh token rotation
- Validate token on every protected request — no client-side-only auth

## Dependency hygiene

- Run `yarn audit` / `cargo audit` regularly
- Pin major versions in dependencies
- Review changelogs before upgrading security-sensitive packages
