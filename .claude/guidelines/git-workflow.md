# Git Workflow Guidelines — Digital Multiverse

## Conventional Commits

Format: `<type>(<scope>): <subject>`

| Type | Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance, deps, config |
| `refactor` | Refactor without functional change |
| `test` | Add or update tests |
| `docs` | Documentation only |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |
| `revert` | Revert a previous commit |

**Subject rules:**
- Imperative mood: "add feature" not "added feature"
- Lowercase, no period at the end
- Max 72 characters
- Be specific about what changed

```bash
# ✅ Good
feat(auth): add JWT refresh token rotation
fix(api): handle null response from SurrealDB query
chore(deps): upgrade SolidJS to 1.9

# ❌ Bad
fix: fixed bug
feat: new stuff
FEAT(AUTH): ADD LOGIN
```

## Branch naming

```
feat/{ticket-or-short-description}
fix/{ticket-or-short-description}
chore/{description}
refactor/{description}
```

## Breaking changes

Add `!` after the type/scope and a `BREAKING CHANGE:` footer:

```
feat(api)!: remove deprecated v1 endpoints

BREAKING CHANGE: /api/v1/* routes removed. Use /api/v2/*.
```

This triggers a major version bump in semantic-release.

## Commit hygiene

- Never `git add .` blindly — stage only files relevant to the task
- One logical change per commit
- Never commit `.env` files — only `.env.example`
- Never commit `node_modules/`, build outputs, or editor files

## Release

Releases are automated via `semantic-release` triggered by CI on `main`.
Version bumps: `fix` → patch, `feat` → minor, `!` → major.
