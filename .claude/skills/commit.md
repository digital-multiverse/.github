---
name: commit
description: Analyse staged changes, suggest a conventional commit message, and execute with user approval. Always elicits confirmation before committing.
tools: Bash, Read
---

# Commit Changes

## Steps

### 1. Check workspace state
```bash
git status --porcelain
git diff --cached
```

If no staged changes: stop and ask user to stage files first.
If unstaged changes alongside staged: offer options:
1. Stage all (`git add .`)
2. Stage by pattern (`git add <pattern>`)
3. Stash unstaged (`git stash push -m "Auto-stash before commit"`)
4. Continue with current staging

### 2. Analyse and suggest

From `git diff --cached`, auto-detect:
- **Type**: feat / fix / chore / refactor / test / docs / perf / ci
- **Scope**: affected module (e.g., auth, api, components, db)
- **Description**: imperative mood, lowercase, max 72 chars, no period

Ask for Task ID (format: T-XXX or STORY-ID — can be empty).

Present suggestion:
```
Suggested: feat(auth): add JWT refresh token rotation
Accept / Modify / Custom message?
```

### 3. Validate and commit

Check final message meets Conventional Commits format.
Execute: `git commit -m "<final_message>"`
Show result. Remind about stash if one was created.

### 4. Never auto-push

End with: "Committed. Push when ready with `git push origin <branch>`."
