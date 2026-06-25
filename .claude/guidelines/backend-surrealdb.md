# Backend & SurrealDB Guidelines — Digital Multiverse

## Core Stack

- **Database:** SurrealDB — graph-first approach
- **Auth:** Auth0 (OAuth2) via unified Provider Factory
- **Backend:** Rust + Axum (new services) / Node.js + Express (multiagent-chat-app)
- **Validation:** Zod for payload validation on Node backends

## SurrealDB — Critical rules

**SurrealDB MUST live strictly behind the backend.** Never expose connection
credentials via `VITE_*` or any client-readable env var.

```
Browser → Backend API (Rust/Axum or Node/Express) → SurrealDB
                                                   ↑
                                        Only here. Never directly from browser.
```

**Connection pooling:** Reuse the SurrealDB connection instance.
Do not spawn a new instance per request.

**Type-safe queries:** Use `QueryParameters` with `exactOptionalPropertyTypes`.
Keep `scripts/db-init.ts` (or equivalent) in sync with TypeScript definitions.

**Graph-first schema** — use `RELATE` for relationships:

```sql
-- Nodes
DEFINE TABLE user SCHEMAFULL;
DEFINE TABLE portfolio SCHEMAFULL;

-- Edges (graph relations)
RELATE user:jota->OWNS->portfolio:dev_en;
RELATE skill:solidjs->APPLIED_IN->experience:company_x;

-- Deep fetch example
SELECT *, ->OWNS->portfolio.* AS portfolios FROM user WHERE id = $id;
```

**Tenant isolation:** Users can only query/mutate their own nodes.
Enforce at the query level, not just the API level.

## Auth lifecycle

- Never handle raw tokens directly — always use defined Providers (`Auth0Provider`)
- Auth state lives entirely within `AuthService` — single source of truth
- On first Auth0 login: create a `user` record in SurrealDB (sync hook)
- Token validation on every protected request — no client-side-only auth

## Rust + Axum patterns

```rust
// ✅ Use ? for error propagation
async fn get_user(id: &str) -> Result<User, AppError> {
    let user = db.query_one::<User>(id).await
        .map_err(|e| AppError::Database(e.to_string()))?;
    Ok(user)
}

// ❌ No .unwrap() in production
let user = db.query_one::<User>(id).await.unwrap();
```

## Node.js + Express patterns

- Validate all incoming payloads with Zod before processing
- Backend re-validates even if frontend already validated — never trust client payloads
- Use typed custom error classes (`AppError`, `NotFoundError`, `ValidationError`)

## Infrastructure

- Local dev: `./dev.sh` or `yarn dev:full` to spin up containers
- Docker Compose for all local service orchestration
- Standardise all deviations into `docker-compose.yml` — no unreplicable local configs
- `.env.example` always committed; `.env` never committed
