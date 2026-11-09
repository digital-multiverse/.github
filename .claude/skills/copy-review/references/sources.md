# Sources behind `copy-review`

Looked at on 2026-11-09. Paraphrased, nothing copied.

| Source (licence) | What we took | What we left out, and why |
|---|---|---|
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) `copy-editing`, `copywriting` (MIT, the most-starred copy skills) | Already installed and loaded as-is: seven sweeps, plain-English swaps, AI-tell list | Nothing copied; their checks are English-centred, which is the gap this skill fills |
| `no-ai-slop` (installed) | Detect mode: name the pattern, quote the line, no rewrite, no "was this AI" guess | — |
| [ethereum.org `intl-review`](https://github.com/ethereum/ethereum-org-website/tree/dev/.claude/skills/intl-review) (MIT) | Glossary is the authority (ours: the app's own strings); structural / terminology / semantic passes; critical / warning / info severity; zero findings is valid; a known-patterns file that grows with each review (our `traps.md`) | Its 5-category numeric score (we don't score, as in design-review); auto-fix by default (we review by default); MDX, script and glossary-API specifics |
| [Microsoft localization style guides](https://learn.microsoft.com/en-us/globalization/reference/microsoft-style-guides) es-ES and it-IT (free download, © Microsoft: paraphrase only) | Consumer copy uses tú / tu; sentence case in headings; avoid anglicisms and literal calques; locale typography (¿¡, accented capitals, number formats) | Microsoft product terminology and voice |
| Back-translation (standard localisation QA practice) | Literal back-translation of every string as the main evidence for a meaning finding | Full independent back-translation by a second translator: we have none |
