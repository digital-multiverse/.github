# Contributing to Digital Multiverse

Thanks for your interest! These guidelines apply across all repositories in the organization.

## Reporting issues
Use the issue templates. Search existing issues first to avoid duplicates.

## Branching
- `main` is always deployable.
- Create branches as `type/short-description`, e.g. `feat/newsletter-optin`, `fix/mobile-nav`.

## Commits
We follow [Conventional Commits](https://www.conventionalcommits.org):
`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.
Example: `feat(web): add devlog section`

## Pull requests
1. Branch from `main`.
2. Keep PRs focused and small.
3. Fill in the PR template and link related issues.
4. Make sure CI passes.

## Local development (web)
The site is static — no build step. Open `index.html` in a browser.
The newsletter form runs in preview mode locally.

## Code style
- Keep it simple and readable.
- Never commit secrets — use environment variables.
