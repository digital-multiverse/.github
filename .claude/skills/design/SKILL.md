---
name: design
description: >
  Design or redesign a website, landing page, page section or app screen for any
  digital-multiverse project (Echoes of the Garden, comparavoto, lucentumvisuals,
  imperiogourmet, remembart, josejpg, domainzone…). Adds the studio layer on top of
  frontend-design and taste-skill: each project's docs/design-intent.md (brand, audience,
  CTAs, what not to say), the real stack (static sites and Cloudflare Workers, WordPress),
  performance budgets (LCP, TBT, page weight), accessibility floor (text ≥ 12 px, targets
  ≥ 44 px, reduced motion), i18n and a final check before handing over. Use it whenever
  the user wants to build, restyle or rework UI, even if they don't say "design".
  Triggers: "diseña", "rediseña", "rediseño", "nueva portada", "nueva landing", "mejora el
  hero", "maqueta esta sección", "haz la web de", "pantalla nueva", "cambia el estilo",
  "design", "redesign", "new landing page", "rework the hero", "build the homepage",
  "make this page look better". For reviewing a live site without touching it, use
  design-review instead.
---

# Design (digital-multiverse layer)

This skill does not teach taste. Two installed skills already do:

- **frontend-design** (Anthropic): ground the design in the subject, a token plan before
  code, one memorable element, the list of AI-default looks to avoid, writing as design.
- **taste-skill** (`design-taste-frontend`): brief inference, the three dials, the
  redesign protocol (audit before touching), the AI-tells list and its pre-flight check.

Load both and follow them for the visual work. This skill adds what they cannot know:
what each of our projects is, where it runs, and the floors every page must meet. When
they disagree with this file on a number (performance, sizes), this file wins, because
these numbers come from our own sites and hosting.

## Principles we add

Paraphrased from Meng To's design skills (MIT) and Apple's Human Interface Guidelines
(paraphrase only, Apple's text is not licensed for reuse). Details in `references/sources.md`.

- **One thesis per screen.** Each viewport has one idea, one focal point and one primary
  action. If two things compete for the eye, one of them goes.
- **Spec first, then small steps.** Write the token plan before code; when iterating,
  change one or two variables at a time so you can tell what helped.
- **Motion explains change.** It shows what opened, moved or was confirmed. Never the only
  signal, always optional, and the first frame is complete without JS.
- **No fake proof.** No invented numbers, testimonials, logos or "trusted by". Use real
  ones from the intent file or leave the slot out.
- **Spacing between controls.** Around 12 px between controls that have a visible
  background or border, around 24 px between bare text or icon controls, on top of the
  44 px target.
- **Hierarchy from weight, size and colour,** not from more typefaces. Avoid thin weights
  for body text.
- **Colour is never the only signal** (links, errors, states). Check contrast in light and
  dark separately.
- **Name actions by their verb** ("Play free", "Subscribe", "Book a table"), never "Click
  here" or "Let's go!". Errors sit next to the field, say what happened and how to fix it,
  and don't apologise.
- **Accessibility:** follow the `a11y` skill for anything with forms, menus or custom
  controls; the floors in §4 are the minimum for every page.

## 1. Read the project's intent first

Open `docs/design-intent.md` in the repo. It says who the site is for, what it promises,
what it must never say, the CTAs, the languages and where each page type is generated.
Also read, if present: `.agents/product-marketing.md` (positioning used by the marketing
skills), `BACKLOG.md`, the last `docs/REVIEW-WEB-*.md`, ADRs the intent file points to.

**If `docs/design-intent.md` is missing**, create it before designing anything: copy
`references/design-intent-template.md`, fill what the repo already answers (README, copy on
the live site, ADRs), and ask the user only for the gaps, in one batch of short questions
(AskUserQuestion when available). Show the draft and wait for an OK before writing it into
the repo. A design built on a guessed audience or a guessed promise is the most expensive
kind of rework.

**If it is stale** (a decision in BACKLOG/ADRs contradicts it), say so and propose the edit.

## 2. Plan, then build

Follow frontend-design's two passes (token plan → check against the brief → code) and
taste-skill's redesign protocol when the page already exists. Add to the plan:

- **The 5-second line:** the sentence from "What it is" in the intent file, and where on
  the first screen (1280×800 and 390×844) it is readable together with a real image of
  the product. If the product has no real image yet, say so instead of faking one.
- **CTA map:** every CTA from the intent file and the page types where it appears. Pages
  that come from Google (detail pages, posts) need a way back and the main CTA, not just
  the home page.
- **Copy check:** every claim on the page is in "Promises"; nothing in "What we must not
  say" appears. Write copy with the `copywriting` skill when there's a lot of it, then pass
  it through `no-ai-slop`. In every locale, run `copy-review` before handing over: it catches
  literal translations and double meanings the English-centred skills miss.

## 3. Stack: build where the project already builds

Use what the repo already uses. No new framework, CSS library, font service or build step
without the user's OK, because every one is another thing to keep alive across nine
projects.

- **Static sites on Cloudflare Workers** (Echoes web, comparavoto with Astro, remembart
  app-site, josejpg with Vite): edit the source templates or build scripts named in the
  intent file, never the generated output (`dist/`, generated `index.html`). Headers and
  CSP live in `_headers`/`wrangler.jsonc`/the worker: a new third-party font, script or
  embed needs a CSP change, so prefer self-hosting from the same origin. Anything in the
  Cloudflare dashboard, DNS or the VPS goes through the `infra-servidores` skill.
- **WordPress** (imperiogourmet, lucentumvisuals on dm2/Hestia): changes go in our theme
  and plugins under `wp-content/` and in `bin/seed*.php`, tested on the local docker
  stack. Translations follow the repo's Polylang "mirror" pattern.
- **TV and app screens** (remembart on Android TV): the same intent file and floors apply,
  plus 10-foot rules: D-pad focus order and a visible focus state on everything, safe
  margins of ~5% of the screen, nothing that needs a pointer.

## 4. Floors every page meets

Defaults for all projects. A project can override one in its intent file with a reason.

**Performance** (mobile, Lighthouse lab run against the deployed URL, simulated throttling):

| Metric | Budget | Why |
|---|---|---|
| LCP | ≤ 2.5 s | Google's "good" threshold for Core Web Vitals |
| TBT | ≤ 200 ms | Lab proxy for INP; 30% of the Lighthouse score |
| CLS | ≤ 0.1 | Core Web Vitals "good" |
| Perf score | ≥ 90 | Green band |
| First load, transferred | ≤ 500 KB | Our sites are brochures; most of that should be the hero image |
| Hero media | ≤ 200 KB | One 1.4 MB animated WebP was 80% of the Echoes home page weight (2026-11) |
| JS shipped | ≤ 50 KB unless the page is an app | INP stays good when there is little JS |

How to stay inside: the LCP image is in the HTML, never `loading="lazy"`, gets
`fetchpriority="high"` and explicit `width`/`height`; animated loops are
`<video muted loop playsinline>` with a poster, not GIF/animated WebP; responsive images
with `srcset` and honest `sizes`; fonts self-hosted or preconnected with `font-display:
swap`, at most two families. Measure before handing over (see §6), don't estimate.

**Accessibility** (WCAG 2.2 AA plus our stricter floors):

- Body text ≥ 16 px, and **no text under 12 px** anywhere, including eyebrows, labels and
  footers. Contrast 4.5:1 for text, 3:1 for large text, controls and focus rings.
- Tap targets **≥ 44×44 px** (WCAG AA only requires 24; 44 is the AAA and platform
  guideline and costs nothing on a brochure site).
- `prefers-reduced-motion: reduce` turns off non-essential motion, autoplay included.
  Content is never hidden until JS runs: reveal effects hide only under a class that a
  script adds.
- Visible keyboard focus; sticky headers don't cover the focused element
  (`scroll-padding-top`). One `<main>` per template, landmarks, valid `aria-*` references.
- Works at 320 px wide with no horizontal scroll, and at 200% text zoom.

**i18n:**

- `lang` on `<html>` per locale and on passages in another language; `hreflang` alternates
  on every page and in the sitemap.
- The language switcher is visible without scrolling on desktop and inside the mobile menu,
  with each option written in its own language.
- Design for the longest locale (Spanish, German, Italian run 20–35% longer than
  English): check the nav and buttons with the longest strings, not the English ones.
- Untranslated on purpose? It's listed in the intent file. No English left by accident.

## 5. Things that don't belong in a design pass

Publishing, deploying, Cloudflare/DNS changes, commits and pushes all need the user's OK.
Don't touch analytics, cookies or third-party scripts without updating the privacy page in
the same change, because the privacy text has to match what the page actually loads.

## 6. Final check before handing over

Run it on the local build or a preview URL; use design-review's capture recipe
(`~/.claude/skills/design-review/scripts/capture.sh` for screenshots and Lighthouse,
`measure.mjs` next to it for text sizes, targets, offsets and the JS-off check).

- [ ] Screenshots at 1280, 900 and 390 px: the 5-second line and a real product image are
      on the first screen; nav doesn't wrap at 900 px; longest locale checked.
- [ ] Lighthouse mobile within every budget in §4 (numbers in the hand-over, labelled lab).
- [ ] No text < 12 px, no target < 44 px, reduced motion honoured, page readable with JS off.
- [ ] `a11y` script clean (or each remaining item explained) on every template and form.
- [ ] Every CTA from the intent file reachable on every page type it lists.
- [ ] Copy: nothing from "What we must not say"; taste-skill's pre-flight and AI-tells pass.
- [ ] `lang`, `hreflang`, switcher, no stray English.
- [ ] Changes are in the source templates; generated files rebuilt, not hand-edited.
- [ ] `git status` shows only intended files; nothing committed or deployed without OK.

Hand over with: what changed and why (tied to the intent file), the before/after
screenshots (absolute paths), the Lighthouse numbers, and anything left out.

Sources behind these numbers and what we took from each: `references/sources.md`.
