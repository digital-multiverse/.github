# Sources behind `design` and `design-review`

Read online on 2026-11-08. Principles are paraphrased; no source text is copied. Re-check
the numbers when a source publishes a new version (WCAG 3 is still a Working Draft;
Lighthouse is on 13.x).

| Source (licence) | What we took | What we left out, and why |
|---|---|---|
| [Anthropic frontend-design](https://github.com/anthropics/claude-plugins-official) (Apache-2.0), vendored in `.github` | Used as-is, not repeated: grounding in the subject, token plan before code, one memorable element, the AI-default looks to avoid, writing as design | Nothing; `design` loads it instead of copying it |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT), vendored in `.github` | Used as-is: brief inference, dials, redesign protocol, AI tells, pre-flight | Its CWV numbers and stack defaults (React/Tailwind/GSAP): our budgets and stacks in `design` §3–4 win |
| [MengTo/Skills](https://github.com/MengTo/Skills) (MIT): `no-ai-design-slop`, `audit-ai-design-slop`, `landing-page` | In `design` → Principles. One thesis, one focal point and one primary action per viewport; spec first, then change one or two variables at a time; motion must explain state; the static first frame works without JS; no fake proof; reviews cite a location, have no score and cut before adding | GSAP/Lenis/Three.js "Awwwards" stack and WebGL effects (break our budgets); Aura.build and icon-set rules (tied to his products); SaaS trial/demo funnel; image-model prompts. designcode.io and aura.build pages render with JS and could not be read |
| [Impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0) | Refine keeps the identity, redesign replaces it, never half of each; verify the rendered page at shipped sizes; project context in files (our `design-intent.md`) | The CLI and its 24 commands; P0–P3 (we keep S/M/L effort plus ordering by impact) |
| [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT) | Fix order: accessibility, touch, performance, then style; 44 px targets with spacing; reserve media space | The style/palette database: it pushes toward catalogue looks (glassmorphism, neumorphism) |
| [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) (© Apple, all rights reserved: paraphrase only) | In `design` → Principles. 44×44 hit regions; spacing around controls; contrast checked in light and dark; few typefaces, hierarchy by weight/size/colour; motion optional and never the only signal; buttons named by their verb; errors next to the problem with the fix | Points, per-platform tables, Dynamic Type, safe areas, SF fonts, Liquid Glass: native-only |
| [Refactoring UI](https://www.refactoringui.com/) (paid book, © authors: paraphrase only) | From the public previews: line height ~1.5, larger for long lines, smaller for big headings; labels are a last resort; fewer borders, separate with space and background | Dashboard/data-density advice. The rest of the book is paywalled and was **not** read; chapter titles only |
| [Laws of UX](https://lawsofux.com/) (CC BY-NC-ND 4.0) | Fitts (big, reachable targets), Jakob (standard nav and footer placement), Hick (fewer choices, one highlighted), Von Restorff (one thing stands out), serial position (key nav items first and last), aesthetic-usability (test real flows) | Zeigarnik, goal-gradient, Tesler, Postel, flow, etc.: app-flow concepts with little use on brochure sites. Miller's 7±2 as a hard limit (the site itself warns against it) |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) (W3C Document License, 2024-12-12 edition) | Contrast 4.5:1 / 3:1 (1.4.3, 1.4.11); 200% resize and 320 px reflow (1.4.4, 1.4.10); text spacing (1.4.12); targets ≥ 24 px AA (2.5.8), 44 px AAA (2.5.5) — we require 44; focus not covered by sticky headers (2.4.11); reduced motion (2.3.3, AAA, which we require); `lang` on page and passages (3.1.1, 3.1.2) | Redundant entry, accessible authentication, dragging: no forms or logins on most sites. 7:1 (1.4.6) as a nice-to-have. WCAG 3 scoring: still a draft |
| [web.dev Core Web Vitals](https://web.dev/articles/vitals) (text CC BY 4.0, code Apache-2.0) | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75; TBT as lab proxy for INP; LCP image in HTML, never lazy, `fetchpriority="high"`; width/height on media | LCP sub-part split as a gate (TTFB is tiny on static Workers); INP tuning beyond "ship little JS" |
| [Lighthouse 13 scoring](https://github.com/GoogleChrome/lighthouse) (Apache-2.0) | Weights: TBT 30, LCP 25, CLS 25, FCP 10, Speed Index 10; green ≥ 90 | Older version tables |

Our own numbers (500 KB first load, 200 KB hero media, 50 KB JS, no text under 12 px) are
studio choices, marked (H) in reviews. The Echoes 2026-11 reviews are the evidence for the
hero-media budget: one 1.4 MB animated WebP was 1.4 of the home page's 1.7 MB. Its effect on
TBT was not reproducible across runs, so the budget rests on weight, not on TBT.

## Accessibility skills looked at for `a11y` (2026-11-08)

| Skill (licence) | Verdict |
|---|---|
| [anthropics/knowledge-work-plugins `design/accessibility-review`](https://github.com/anthropics/knowledge-work-plugins) (Apache-2.0) | Checklist only, WCAG 2.1, lists 2.5.5 (44 px) as AA when it is AAA. Not used |
| [AccessLint/skills](https://github.com/AccessLint/skills) (no licence declared, 120★) | Live-DOM audit idea is right; can't be copied without a licence. Not used |
| [axe-core](https://github.com/dequelabs/axe-core) (MPL-2.0) | Run as a tool, not copied: `a11y.mjs` injects the copy bundled with Lighthouse |
