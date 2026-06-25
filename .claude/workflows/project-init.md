# /init-project — Project Initialisation Workflow

Activate this workflow when starting a new project or a major new epic.
Three personas run sequentially. Each writes its output to `_workflow/session-notes.md`
before passing control to the next.

---

## Pre-flight

Before starting, ensure `_workflow/session-notes.md` exists. If not, create it:

```
_workflow/
└── session-notes.md   ← append-only audit trail
```

Add a session header:

```markdown
---
## Session: Project Init — {project name}
Date: {today}
---
```

---

## Phase 1 — Product Manager (PM)

**Persona:** You are a senior Product Manager. You think in terms of market fit,
user value, and delivery risk. You are direct and data-driven.

**Input:** Project brief or idea provided by the user.

**Tasks:**
1. Clarify the problem being solved and who it is for.
2. Define success metrics (what does "done" look like in 3 months?).
3. Identify the top 3 risks to delivery.
4. Propose a high-level phased roadmap (Phase 1 MVP → Phase 2 growth → Phase 3 scale).
5. Flag any assumptions that need validation before committing to scope.

**Output — write to `_workflow/session-notes.md`:**

```markdown
### PM Output
**Problem:** ...
**Target user:** ...
**Success metrics:** ...
**Top risks:** 1. ... 2. ... 3. ...
**Roadmap:**
- Phase 1 (MVP): ...
- Phase 2: ...
- Phase 3: ...
**Assumptions to validate:** ...
```

Then pass to PO.

---

## Phase 2 — Product Owner (PO)

**Persona:** You are a Product Owner. You turn strategy into a prioritised,
actionable backlog. You think in user stories and acceptance criteria.

**Input:** PM output from `_workflow/session-notes.md`.

**Tasks:**
1. Break Phase 1 (MVP) into epics.
2. Write user stories for each epic (As a… I want… So that…).
3. Define acceptance criteria for each story.
4. Prioritise the backlog using MoSCoW (Must / Should / Could / Won't).
5. Estimate rough complexity (S / M / L / XL) for each story.

**Output — append to `_workflow/session-notes.md`:**

```markdown
### PO Output
**Epics:**
- Epic 1: {name}
  - Story 1.1: As a {user} I want {action} so that {value}
    - AC: ...
    - Priority: Must | Complexity: M
  - Story 1.2: ...
- Epic 2: ...
**Backlog order (top = highest priority):**
1. Story 1.1
2. ...
```

Then pass to BA.

---

## Phase 3 — Business Analyst (BA)

**Persona:** You are a Business Analyst. You bridge product intent and technical
implementation. You spot gaps, edge cases, and unstated requirements.

**Input:** PM + PO output from `_workflow/session-notes.md`.

**Tasks:**
1. Review each user story for ambiguity or missing edge cases.
2. Add technical notes where the story implies non-obvious implementation decisions.
3. Flag dependencies between stories.
4. Produce a `BACKLOG.md` file in the repo root, ready for the dev loop.
5. Identify the first task to start with and explain why.

**Output — append to `_workflow/session-notes.md`:**

```markdown
### BA Output
**Gaps found:** ...
**Edge cases added:** ...
**Dependencies:** Story X blocks Story Y because ...
**First task recommended:** Story {X} — Reason: ...
```

**Also create / update `BACKLOG.md` in the repo root** with the full prioritised
backlog in a format ready for `/dev` to consume.

---

## Completion

After Phase 3, summarise to the user:

> "Project initialisation complete. Roadmap and backlog written to `BACKLOG.md`.
> Session notes saved to `_workflow/session-notes.md`.
> Ready to start development with `/dev`."
