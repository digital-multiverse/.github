# Digital Multiverse — Org-Level AI Instructions

This file is inherited by all repos in the `digital-multiverse` org.
Each repo's own `CLAUDE.md` imports this file and adds repo-specific context.

---

## Stack

- **Frontend:** SolidJS 1.8+ / SolidStart — signal-based, no Virtual DOM
- **Backend:** Rust + Axum (new services); Node.js + Express (multiagent-chat-app)
- **Database:** SurrealDB — graph-first, strictly behind the backend, never client-side
- **Auth:** Auth0 (OAuth2) via unified Provider Factory
- **Styling:** Tailwind CSS — utility-first, dark mode, glassmorphism tokens
- **Package manager:** Yarn Berry
- **Runtime:** Node 24
- **CI/CD:** Reusable workflows from `github-workflows`; composite actions from `github-actions`
- **Versioning:** Conventional Commits + semantic-release
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Validation:** Zod for payload validation on Node backends

## Core Principles

- No over-engineering. Lean, purposeful infrastructure only.
- SurrealDB credentials MUST NOT be exposed via `VITE_*` or any client-side variable.
- Build-time composition. Independent apps sharing `shared/` libraries.
- English for all repo documentation and code comments.
- Security first: never commit `.env`; always provide `.env.example`.
- Do NOT push automatically — user decides when to trigger `git push`.

---

## Automatic Workflow Selection

On session start, Claude always does this first:

1. Check `.claude/local/.prompt` — if it exists, read it and resume from that state.
2. Check `BACKLOG.md` — if it exists, identify highest priority pending task.
3. Detect session type and activate the appropriate workflow (see table below).
4. Announce which workflow is activating and why, then proceed.

### Session type detection

| Situation | Workflow |
|---|---|
| No `BACKLOG.md` exists | `/init-project` — PM → PO → BA |
| `BACKLOG.md` exists, user names a task | `/dev` — full delivery loop |
| `BACKLOG.md` exists, no task specified | Show top 3 items, ask which one, then `/dev` |
| Active spec in `docs/specs/` is incomplete | Propose continuing spec before backlog |
| User asks for code review only | `@review` agent only |
| User asks architecture question | `@architect` agent only |
| User asks to write/fix tests | `@qa` agent only |
| User asks to commit | `@commit` skill |
| User asks to refactor | `@refactor` skill |
| Conversational question | Answer directly, no workflow |

### Guideline loading (selective — not all at once)

| Files being touched | Guidelines loaded |
|---|---|
| `*.tsx`, `*.jsx`, SolidJS components | `frontend-solidjs` + `typescript` + `clean-code` |
| `*.ts` services, hooks, utilities | `typescript` + `clean-code` + `error-handling` |
| `*.test.ts`, `*.spec.ts` | `testing` + `clean-code` |
| Database, SurrealDB, auth files | `backend-surrealdb` + `security` |
| `*.rs` Rust files | `clean-code` + `error-handling` + `security` |
| Git operations, commits | `git-workflow` |
| JSDoc, documentation | `jsdoc` + `code-comments` |
| Any security-sensitive change | `security` always |

---

## Agentic Workflow — Subagents

Invoke with `@name`. Each subagent has its own focused context.

| Subagent | Invoke | When |
|---|---|---|
| Architect | `@architect` | Structural changes, ADR creation |
| Staff Engineer | `@staff` | Feasibility assessment, implementation planning |
| Senior Engineer | `@senior` | Code implementation (agentic loop) |
| Code Review | `@review` | Post-implementation review |
| QA | `@qa` | Test execution and validation |
| PM | `@pm` | Project scope and roadmap |
| PO | `@po` | Backlog grooming, user stories |
| BA | `@ba` | Requirements analysis, edge cases |

### Slash commands (full workflows)

| Command | Description |
|---|---|
| `/init-project` | PM → PO → BA → produces `BACKLOG.md` |
| `/dev` | Architect → Staff → Senior → Review → QA → commit |

### Session notes & artefacts

Every subagent appends to `_workflow/session-notes.md` with a timestamp.
Architect and Staff also create artefact files in:
`.agents/architecture/apps/{app}/Sprint {N}/Task {M} - {title}/`

### Local session state (`.claude/local/.prompt`)

At the END of each session, or when recommending a new session, Claude:

1. Writes `.claude/local/.prompt` with the current session state.
2. Notifies the user: "Session state saved to `.claude/local/.prompt`. Start your next session with `claude` and I'll resume from here."

This file is gitignored (`.claude/local/` is in `.gitignore`). It contains:
- Active branch
- Current task in progress
- Last decision made
- Immediate next step
- Any blockers

### ADRs

Major architectural decisions → `docs/adr/{NNN}-{topic}.md`.
The `@architect` subagent creates these automatically.

---

## Skills (invoke on demand)

| Skill | When to use |
|---|---|
| `@commit` | Analysing staged changes and writing conventional commit message |
| `@refactor` | Systematic codebase refactoring against standards |
| `@coverage` | Increasing unit test coverage to target threshold |
| `@review-mr` | Full merge request review with structured report |
| `@create-adr` | Creating a well-structured Architecture Decision Record |
| `@add-jsdoc` | Adding JSDoc to all exported APIs in a file or folder |
| `@debug` | Systematic debugging of a reported issue |

---

## Path-scoped rules (auto-loaded by file type)

See `.claude/rules/` for rules that activate automatically based on file patterns.
These complement the guidelines above — they are concise, file-type-specific constraints.

---

## Guidelines (reference library — loaded selectively)

@.claude/guidelines/clean-code.md
@.claude/guidelines/git-workflow.md
@.claude/guidelines/security.md
@.claude/guidelines/testing.md
@.claude/guidelines/typescript.md
@.claude/guidelines/error-handling.md
@.claude/guidelines/frontend-solidjs.md
@.claude/guidelines/backend-surrealdb.md
@.claude/guidelines/jsdoc.md
@.claude/guidelines/code-comments.md
@.claude/guidelines/biome.md
