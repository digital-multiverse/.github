# /dev — Development Loop Workflow

Main development workflow for a single backlog task.
Personas run as subagents. Each appends to `_workflow/session-notes.md`.

**Loop:** Architect → Staff Engineer → Senior Engineer → Code Review → QA → Commit

---

## Pre-flight

1. Check `.claude/local/.prompt` — if it exists, read it and ask:
   "Resume task {task} on branch {branch}? [Y/n]"
2. If new session: ask "Which task from `BACKLOG.md`?"
3. Write task to `_workflow/current-task.md`.
4. Create sprint artefact folder:
   `.agents/architecture/apps/{app}/Sprint {N}/Task {M} - {title}/`
5. Append session header to `_workflow/session-notes.md`:

```markdown
---
## Session: /dev — {task title}
Date: {today}
Task: {task-id} — {title}
Sprint folder: .agents/architecture/.../Sprint {N}/Task {M}/
---
```

---

## Phase 1 — @architect

Invoke `@architect`.

Skip if: isolated bugfix or copy change within a single file (go directly to @staff).

Back-routing: if @staff finds the plan infeasible → back to @architect (max 2 cycles).

---

## Phase 2 — @staff

Invoke `@staff`.

Back-routing: if still infeasible after 2 cycles → escalate to user.

---

## Phase 3 — @senior

Invoke `@senior`.

Back-routing: if @review returns changes → back to @senior (max 3 cycles).
Back-routing: if @qa fails → back to @senior (max 2 cycles).

---

## Phase 4 — @review

Invoke `@review`.

---

## Phase 5 — @qa

Invoke `@qa`.

---

## Phase 6 — Commit

Only reached after @qa approves.

1. Final check:
```bash
yarn lint && yarn type-check && yarn test
```
2. Invoke `@commit` skill for conventional commit message + user approval.
3. Do NOT push — user decides when to push.
4. Update `BACKLOG.md`: mark task as done.

Append to `_workflow/session-notes.md`:
```markdown
### [Commit] — {timestamp}
**Commit:** git commit -m "..."
**Branch:** feat/S{N}-T{M}-{topic}
**Status:** ✅ Done — ready to push
---
```

---

## Session end — always do this

After completing a task OR when recommending a new session, write `.claude/local/.prompt`:

```markdown
# Session State — {repo-name}

Last updated: {timestamp}
Active branch: {branch}
Current task: {task-id} — {task-title}
Status: {Done / In Progress / Blocked}
Last decision: {one-line summary}
Immediate next step: {specific action for next session}
Blockers: {description or "None"}
```

Then notify the user:
> "✅ Session state saved to `.claude/local/.prompt`.
>  Next session: run `claude` in this repo and I'll resume from here."

---

## When to recommend a new session

Recommend (and write `.prompt`) when:
- A phase takes longer than expected and context is getting large
- A blocker requires user decision before continuing
- The task is complete and the next task is unrelated
- More than 2 back-routing cycles have occurred in any phase

---

## Back-routing rules

| From | To | Max cycles |
|---|---|---|
| @staff | @architect | 2 |
| @senior | @staff | 1 |
| @review | @senior | 3 |
| @qa | @senior | 2 |

If max cycles exceeded: stop, document blocker in `session-notes.md`, write `.prompt`, notify user.
