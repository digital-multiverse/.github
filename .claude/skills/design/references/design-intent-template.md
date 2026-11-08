# Design intent — <project name>

<!-- Lives at docs/design-intent.md in each repo. Read by the `design` and `design-review`
skills. Keep it short: facts about this project only, nothing that applies to every site.
If `.agents/product-marketing.md` exists (marketingskills), link it for audience and
positioning instead of copying them here. -->

Last reviewed: <yyyy-mm-dd>

## What it is
One or two plain sentences a first-time visitor should be able to repeat after 5 seconds.

## Audience
Who arrives, from where (Google, store page, social, word of mouth), on what device, in
which language. Name the one visitor the site is mainly for.

## Primary jobs and CTAs
Ordered. For each: the label, where it goes, and on which page types it must be reachable.

| CTA | Target | Must appear on |
|---|---|---|
| | | |

## Promises: what we can say
Claims the product actually supports today, with the source (doc, ADR, page).

## What we must not say
Claims, names, prices, dates or words that are false today or decided against, with the
reason and source. Reviews treat any of these on the live site as a finding.

## Brand
- Voice: 3–4 adjectives and one "sounds like / never sounds like" pair.
- Type: families and roles, where they are loaded from.
- Colour tokens: where they live (file:line), light/dark.
- Imagery: what is real (screenshots, photos) vs. placeholder; what must never be stock.
- The one memorable element of the site, if already chosen.

## Languages
Locales, URL scheme, how the switcher works, what stays untranslated on purpose (and why),
who checks translations.

## Links and surfaces
Canonical domain, redirects that must hold, external pages that should link back (stores,
itch, social), legal pages.

## Stack and where to fix things
Hosting, build, the files or templates where each page type is generated (so findings point
to the source, not the output).

## Budgets that differ from the defaults
Only if this project needs other numbers than the `design` skill defaults, and why.

## Known decisions and open items
Pointers to BACKLOG, ADRs and the last `docs/REVIEW-WEB-*.md`, so nothing planned gets
"found" again.
