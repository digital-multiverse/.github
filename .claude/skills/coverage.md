---
name: coverage
description: Increase unit test coverage for a file or folder to a target threshold. Analyses gaps, generates focused tests following AAA pattern, and validates improvement.
tools: Read, Write, Edit, Bash, Glob, Grep
---

# Increase Test Coverage

## Steps

### 1. Get target
Ask user:
- Target coverage % (default: 80% general / 95% for multiverse-platform)
- File or folder path to analyse

### 2. Measure current coverage
```bash
yarn test:coverage
# or: npm run test:coverage -w <workspace>
```
Parse results to identify:
- Current % vs target
- Files below threshold (sorted by gap size)
- Uncovered lines, branches, functions

### 3. Prioritise gaps
Focus on:
- Business logic and calculations
- Error conditions and edge cases
- Public API functions

Skip:
- Framework internals
- Trivial getters/setters
- Third-party library behaviour

### 4. Generate tests (AAA pattern)

```typescript
describe('functionName', () => {
  it('should [expected behaviour] when [condition]', () => {
    // Arrange
    const input = ...;
    // Act
    const result = functionName(input);
    // Assert
    expect(result).toBe(...);
  });
});
```

Always include:
- Happy path test
- Error/boundary test (with specific error message — never empty `.toThrow()`)
- Edge cases (null, empty, boundary values)

### 5. Validate
```bash
yarn test && yarn test:coverage
```
Show before → after coverage %.
Confirm target reached or explain remaining gaps.
