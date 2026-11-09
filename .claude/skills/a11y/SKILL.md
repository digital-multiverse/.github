---
name: a11y
description: >
  Accessibility check of a page, form, menu or screen in any digital-multiverse project,
  against WCAG 2.2 AA plus the studio floors (text ≥ 12 px, targets ≥ 44 px, reduced
  motion, readable without JS). Runs full axe-core, a keyboard walk, the accessibility tree,
  reflow at 320 px, the text-spacing override and reduced motion on the real page, then
  covers what automation can't: forms, focus traps, alt text, language, screen reader.
  Called by design (before handing over) and design-review (lens 4), or on its own. Use it
  whenever accessibility comes up, even in passing. Triggers: "accesibilidad", "a11y",
  "¿es accesible?", "WCAG", "lector de pantalla", "contraste", "navegación con teclado",
  "foco", "European Accessibility Act", "Ley de accesibilidad", "accessibility audit",
  "screen reader", "keyboard navigation", "focus order", "is this accessible?".
---

# Accessibility (WCAG 2.2 AA + our floors)

Automated tools find roughly a third of real problems. The script below does that third
fast so the time goes to the rest: forms, meaning, order, and how it sounds.

**Mode.** Called from `design-review` or asked to "check" or "audit": read only, findings
in design-review's format with the WCAG criterion in the title. Called from `design`:
fix in the source templates as part of the design work.

Read the project's `docs/design-intent.md` first (languages, templates, forms, where to fix).

## 1. Automated pass

```bash
node ~/.claude/skills/a11y/scripts/a11y.mjs <url> 1280
node ~/.claude/skills/a11y/scripts/a11y.mjs <url> 390
node ~/.claude/skills/design-review/scripts/measure.mjs <url> 390   # sizes, targets, cookies, JS off
```

Needs the Lighthouse npx cache (`npx -y lighthouse@13.0.1 --version` once): it uses its
puppeteer-core and axe-core, so nothing new is installed. Run it on every template and
on every page with a form. It prints JSON:

- `axeViolations`: axe-core 4.x, WCAG 2.2 A/AA plus best practice, run after scrolling
  through and forcing reveal animations to their final state (axe skips invisible
  elements, which is how a 1.9:1 link passed both axe and Lighthouse on Echoes).
  Lighthouse runs only a subset of these rules, so a Lighthouse a11y score of 100 doesn't
  mean this list is empty.
- `axeIncomplete`: what axe couldn't decide, with selectors, usually contrast over images
  or gradients. Check each one by eye in a screenshot; don't report them unchecked.
- `keyboard`, `keyboardNoRing`, `keyboardWeakRing`, `keyboardCovered`,
  `keyboardNotScrolledIntoView`: Tab order (up to 60 stops); stops whose focus looks the
  same as unfocused; rings that are only a shadow, a border change or an outline under
  2 px (grouped, so a site-wide style is one line; under 2 px misses 2.4.13 AAA, and a
  faint shadow can fail 2.4.7 AA, so look at one in a screenshot); focus hidden under a
  fixed or sticky element (2.4.11); focus that ends up off screen.
- `mobileMenu`: at 390 px, the menu button is focused, opened with Enter, then Tab and
  Escape are pressed. Expect: `aria-expanded` turns true, the label changes ("Close
  menu"), Tab lands inside the menu, and Escape closes it and returns focus to the button.
  `found: false` with a visible menu means it isn't exposed as expandable (checkbox hacks,
  clickable divs), which is a 4.1.2 finding.
- `unnamedControls`: buttons, links and fields with no accessible name in the real tree.
- `textSpacingClipped`: content clipped by the 1.4.12 spacing override.
- `reflow320Overflow`: the elements that stick out at 320 px (1.4.10); empty means no
  horizontal scroll.
- `reducedMotion`: infinite animations and playing videos left running with
  `prefers-reduced-motion: reduce`.

## 2. What the script can't judge

Go through these by hand. Each one has broken on our sites before or is likely to. A
one-off check that needs code (one menu, one form state) is fine as a throwaway script in
the scratchpad; if the same check is needed on a second site, propose adding it to
`a11y.mjs` instead.

- **Forms** (newsletter, contact, bookings, shop checkout): every field has a visible
  label, errors are announced next to the field and say how to fix them, required fields
  are marked in text, not only colour, honeypots are hidden from screen readers and
  keyboard (`tabindex="-1"`, `aria-hidden`), the success message is announced
  (`role="status"`).
- **Menus and dialogs:** the script tests the mobile menu; check desktop dropdowns and
  dialogs the same way (focus in, Escape out, no trap). The same for cookie banners and
  WhatsApp floating buttons, which must not cover content or focus.
- **Images:** alt text says what the image shows, in the page's language. Decorative
  images have `alt=""`. Screenshots of a game or a photo portfolio need real descriptions:
  that is the product.
- **Media:** autoplaying video is muted, has no sound, can be paused, and stops with reduced
  motion. Video with speech needs captions.
- **Language:** `lang` matches each locale. Passages in another language get their own
  `lang`, for example English species names on `/es/` pages, unless they are proper names.
  Each switcher link has `lang` and `hreflang`.
- **Contrast in both themes,** and over images (take a screenshot; axe often can't decide).
- **Meaning without colour:** links in text are underlined or otherwise distinct; states
  and errors carry text or icons.
- **Zoom 200%:** text resizes, nothing overlaps or gets cut off.
- **Screen reader, quick pass** (Orca on Linux; VoiceOver or TalkBack on a phone if
  available): headings make an outline, landmarks are named, the main CTA is reachable
  and announced with its verb. Say in the report if this was not done.

**WordPress** (imperiogourmet, lucentumvisuals): theme templates and our plugins are ours
to fix; WooCommerce and Polylang markup is upstream, so propose a theme override or a
filter. Check the cart and checkout too, not just the content pages.

**TV screens** (remembart): every action works with the D-pad alone, focus is always
visible from 3 m away, nothing needs a pointer or a long press without an alternative,
and text is at least 24 px at 1080p.

## 3. Our floors (stricter than WCAG AA)

| Floor | WCAG AA says | We require | Why |
|---|---|---|---|
| Text size | none | ≥ 12 px everywhere, body ≥ 16 px | Echoes had about 110 text nodes at 8–11 px that passed contrast but were hard to read |
| Targets | ≥ 24 px (2.5.8) | ≥ 44 px (2.5.5 AAA, Apple HIG) | Costs nothing on brochure sites |
| Reduced motion | AAA (2.3.3) | Required | Cheap, and decorative motion is the default failure |
| Without JS | not covered | Content visible | Reveal effects hid entire pages when JS failed |
| Focus ring | 2.4.7 visible | ≥ 2 px, 3:1 contrast (2.4.13 AAA) | Cheap to meet |

## 4. European Accessibility Act (H, not legal advice)

Since 28 June 2025 the EAA (Spanish Ley 11/2023) applies to e-commerce and some other
consumer services, using EN 301 549, which maps to WCAG 2.1 AA. Microenterprises (under
10 people and under €2 M turnover) providing services are exempt. Which projects are in
scope is the owner's call: for a shop such as imperiogourmet, say "may apply, check with
an advisor", and treat WCAG 2.2 AA as the target anyway, since it covers 2.1.

## 5. Reporting

In design-review format (`### N. [S|M|L] (O) 2.4.11 Focus hidden under the sticky
header`): what was seen (page, width, selector or file:line), the criterion, and a
concrete fix. Group repeated axe findings into one item per cause, not per node. State
what was not checked (no screen reader, no checkout, one theme only).

Sources and licences: `~/.claude/skills/design/references/sources.md` (WCAG 2.2 under
the W3C Document License, paraphrased; axe-core MPL-2.0, run as a tool, not copied).
