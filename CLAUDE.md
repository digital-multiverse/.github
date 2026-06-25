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
- **Runtime:** Node v24
- **CI/CD:** Reusable workflows from `github-workflows` repo; composite actions from `github-actions` repo
- **Versioning:** Conventional Commits + semantic-release (semantic-release-action v6)
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

Claude selects the workflow automatically based on context. No slash command needed.

### On session start — always do this first

1. Check if `_workflow/session-notes.md` exists. If not, create it from the template.
2. Check if `BACKLOG.md` exists and read it.
3. Detect the session type (see below) and activate the corresponding workflow.
4. Announce which workflow you are activating and why, then proceed.

### Session type detection

| Situation | Workflow activated |
|---|---|
| User describes a new project or epic with no existing `BACKLOG.md` | `/init-project` — PM → PO → BA |
| `BACKLOG.md` exists and user describes a task or says "let's work on X" | `/dev` — full delivery loop |
| `BACKLOG.md` exists and user says nothing specific | Ask: "Which task from the backlog?" then activate `/dev` |
| User asks for a review of existing code | `/review` persona only |
| User asks an architecture question | `/architect` persona only |
| User asks to write or fix tests | `/qa` persona only |
| User asks to plan/groom the backlog | `/po` persona only |
| Conversational question (no code task) | Answer directly, no workflow |

### Guideline selection

Load guidelines automatically based on the files being touched — do not load all at once:

| Files touched | Guidelines loaded |
|---|---|
| `*.tsx`, `*.jsx`, SolidJS components | `frontend-solidjs.md` + `typescript.md` + `clean-code.md` |
| `*.ts` services, hooks, utilities | `typescript.md` + `clean-code.md` + `error-handling.md` |
| `*.test.ts`, `*.spec.ts` | `testing.md` + `clean-code.md` |
| Database, SurrealDB, auth files | `backend-surrealdb.md` + `security.md` |
| `*.rs` Rust files | `clean-code.md` + `error-handling.md` + `security.md` |
| Git operations, commits | `git-workflow.md` |
| Any security-sensitive change | `security.md` always |

---

## Agentic Workflow

### Available slash commands (also auto-activated — see above)

| Command | Description |
|---|---|
| `/init-project` | Start a new project: PM → PO → BA produce roadmap + backlog |
| `/dev` | Development loop: Architect → Staff → Senior → Code Review → QA → commit |
| `/architect` | Run only the Architect persona |
| `/staff` | Run only the Staff Engineer persona |
| `/senior` | Run only the Senior Engineer persona |
| `/review` | Run only the Code Review persona |
| `/qa` | Run only the QA persona |
| `/pm` | Run only the PM persona |
| `/po` | Run only the PO persona |
| `/ba` | Run only the BA persona |

### Session notes & artefacts

Every persona writes its decisions to `_workflow/session-notes.md` with a timestamp
before passing to the next. This file is the audit trail — commit it alongside code.

Architect and Staff Engineer also create artefact files in:
`.agents/architecture/apps/{app}/Sprint {N}/Task {M} - {title}/`

### ADRs

Major architectural decisions get an ADR at `docs/adr/{NNN}-{topic}.md`.
The Architect persona creates these automatically when needed.

---

## Guidelines (available for selective loading)

@.claude/guidelines/clean-code.md
@.claude/guidelines/git-workflow.md
@.claude/guidelines/security.md
@.claude/guidelines/testing.md
@.claude/guidelines/typescript.md
@.claude/guidelines/error-handling.md
@.claude/guidelines/frontend-solidjs.md
@.claude/guidelines/backend-surrealdb.md
