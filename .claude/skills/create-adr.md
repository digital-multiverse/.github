---
name: create-adr
description: Create a well-structured Architecture Decision Record. Guides through context, options, decision, and consequences. Saves to docs/adr/.
tools: Read, Write, Glob
---

# Create Architecture Decision Record

## Steps

### 1. Gather context
Ask user:
- What problem is being solved?
- Key constraints and requirements
- Decision drivers (what matters most: performance, maintainability, simplicity?)

### 2. Research options
Identify at least 3 viable options. For each, assess pros/cons and SOLID alignment.

### 3. ADR template

```markdown
# ADR-{NNN}: {Title}

**Status**: Proposed / Accepted / Deprecated / Superseded
**Date**: {YYYY-MM-DD}

## Context

[Problem description. Be concise but complete.]

**Key Constraints:**
- ...

## Decision Drivers
- ...

## Options Considered

### Option 1: {Name}
**Pros:** ✅ ...
**Cons:** ❌ ...

### Option 2: {Name}
...

## Decision

**Chosen:** Option {X} — {Name}

**Rationale:** [WHY this option, focusing on trade-offs]

**SOLID Principles Applied:**
- SRP: ...
- DIP: ...

## Consequences

### Positive ✅
- ...

### Negative ❌ (with mitigation)
- ...

## Implementation Notes
1. ...

## Related Decisions
- [ADR-XXX]
```

### 4. Save and link

Save to `docs/adr/{NNN}-{kebab-title}.md`.
Get next number from existing ADRs in `docs/adr/`.
Suggest commit: `docs(adr): add ADR-{NNN} {title}`
