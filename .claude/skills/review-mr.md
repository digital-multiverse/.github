---
name: review-mr
description: Perform a comprehensive merge request / PR review. Produces a structured report with Critical/Major/Minor issues and a clear recommendation.
tools: Read, Bash, Glob, Grep
---

# Review Merge Request

## Steps

### 1. Understand context
- Read the diff: `git diff main...HEAD` or specified branch
- Understand the purpose of the changes
- Identify affected modules

### 2. Check Clean Code
- [ ] Functions ≤ 20 lines
- [ ] Meaningful names (no abbreviations)
- [ ] Max 3-4 nesting levels, early returns
- [ ] No magic numbers or strings
- [ ] Single responsibility per function

### 3. Check SOLID
- [ ] SRP: one reason to change per class/function
- [ ] OCP: extensible without modification
- [ ] LSP: subtypes substitutable
- [ ] ISP: no fat interfaces
- [ ] DIP: depends on abstractions

### 4. Check TypeScript / SonarQube rules
- [ ] `??` not `||` for null checks
- [ ] `===` not `==`
- [ ] `?.` for optional chaining
- [ ] Template literals over concatenation
- [ ] No empty catch blocks
- [ ] No commented-out code
- [ ] Array methods over loops
- [ ] No nested ternaries
- [ ] No `any` types

### 5. Check tests
- [ ] ES6 imports (no `require()`)
- [ ] AAA pattern
- [ ] Descriptive test names
- [ ] Edge cases and error conditions
- [ ] Specific `.toThrow()` messages

### 6. Check security
- [ ] No credentials in code
- [ ] Input validated (Zod)
- [ ] No client-side DB credentials
- [ ] No PII in logs

### 7. Generate report

```markdown
# Code Review Report

## Summary
[Brief summary and overall quality assessment]

## Critical Issues ❌
1. `file.ts:42` — [issue] — [fix]

## Major Issues ⚠️
1. ...

## Minor Issues 💡
1. ...

## Positive Feedback ✅
1. ...

## Recommendation
- [ ] Approve
- [ ] Request Changes
- [ ] Needs Discussion
```
