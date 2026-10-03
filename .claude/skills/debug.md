---
name: debug
description: Systematic debugging of a reported issue. Gathers context, forms hypotheses, isolates the root cause, and proposes a fix.
tools: Read, Bash, Glob, Grep
---

# Debug

## Steps

### 1. Understand the issue
Ask user:
- What is the expected behaviour?
- What is the actual behaviour?
- Steps to reproduce (if known)
- Error message or stack trace (if any)

### 2. Gather context
```bash
git log --oneline -10          # recent changes
git diff HEAD~1                # last commit diff
yarn type-check                # type errors
yarn lint                      # lint errors
```

### 3. Form hypotheses
Based on the error and context, list 2-3 most likely causes.
Order by probability.

### 4. Isolate
Test each hypothesis systematically:
- Add temporary logging to narrow down location
- Check for recent changes in affected files
- Verify environment variables are set correctly
- Check for missing builds (e.g., `cd shared && npm run build`)

### 5. Common patterns (project-specific)

**"Cannot find module '@digital-multiverse/...-shared'"**
→ Shared package not built: `cd shared && npm run build`

**TypeScript mismatch after refactor**
→ Rebuild types: `yarn type-check`

**Test failures after dependency update**
→ Check for breaking changes in changelog; clear `node_modules` and reinstall

**SurrealDB connection errors**
→ Check `.env` for credentials; verify `yarn dev:full` is running

### 6. Propose fix
Present the root cause and minimal fix.
Ask for confirmation before applying.
