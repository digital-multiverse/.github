---
name: refactor
description: Systematically refactor a file or folder to align with project standards. Preserves functionality. Validates with lint, type-check, and tests after each change.
tools: Read, Write, Edit, MultiEdit, Bash, Glob, Grep
---

# Refactor Codebase

## Critical rules

- Preserve existing functionality — refactor, do not rewrite behaviour
- Make incremental changes, validate after each major modification
- ALL validation steps are mandatory — cannot be skipped

## Steps

### 1. Get scope
Ask user:
- File or folder path to refactor
- Scope: full refactor / specific issues / from a review report

### 2. Pre-refactor analysis
Identify all violations against project standards:
- Functions over 20 lines
- `any` types
- Missing explicit return types
- Empty catch blocks
- Magic numbers/strings
- Nesting depth over 3
- SOLID violations

Prioritise by severity. Present plan before touching anything.

### 3. Apply systematically
Work through each category. Show before/after for each change.

Track with severity indicators:
- 🔴 Critical: type errors, any, broken contracts
- 🟡 High: function length, nesting, SOLID
- 🟠 Medium: naming, style
- 🟢 Low: formatting, minor improvements

### 4. Validate (MANDATORY after each batch)
```bash
yarn lint && yarn type-check && yarn test
# or: cargo clippy -- -D warnings && cargo check && cargo test
```

Fix any failures before moving to the next batch.

### 5. Summarise
List all changes with before/after examples.
Document any remaining technical debt.
Suggest commit: `git add <files> && git commit -m "refactor(<scope>): ..."`
