# Biome Guidelines

## Formatting rules (from `biome.json`)

| Rule | Value |
|---|---|
| Quote style | Single quotes for JS/TS |
| JSX quote style | Double quotes |
| Semicolons | Always |
| Trailing commas | ES5 (arrays and objects only) |
| Arrow parentheses | Always: `(x) => x` not `x => x` |
| Bracket spacing | `{ foo }` not `{foo}` |
| Indent | 2 spaces |
| Line width | 100 characters max |
| Line endings | LF (Unix) |

## Commands

```bash
yarn lint          # check
yarn lint:fix      # fix auto-fixable
yarn format        # format all files
yarn ci:quick      # lint + type-check (fast feedback)
```

## Never bypass Biome

- Do not add `// biome-ignore` without a documented reason
- Do not disable rules globally in `biome.json` without team discussion
- Biome replaces both ESLint and Prettier — do not install both
