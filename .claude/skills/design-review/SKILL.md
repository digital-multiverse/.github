---
name: design-review
description: >
  Repeatable product and design review of a LIVE website of any digital-multiverse project
  (echoesofthegarden.com, comparavoto.es, lucentumvisuals.com, imperiogourmet.com,
  remembart.com, josejpg.com, elenapastorpsicologia.com, digital-multiverse.com,
  elrincondellibro.com…). Reviewer only, never edits: opens the real pages at
  1280/390/900 px, measures real performance (PageSpeed or local Lighthouse, isolating the
  cause), checks with curl, and judges clarity, CTAs, copy and languages, accessibility and
  trust against the project's docs/design-intent.md. Output is a prioritised S/M/L report
  with every claim tagged observed/heuristic/document. Use it whenever the user asks how a
  published site is doing, even casually. Triggers: "revisa la web", "revisión de diseño",
  "auditoría web", "pase de diseño", "¿se entiende la web?", "qué falla en la portada",
  "mira cómo se ve en móvil", "PageSpeed", "Lighthouse", "design review", "review the
  website", "UX review", "site audit", "is the homepage clear?". To build or change the
  design, use design instead.
---

# Design review (reviewer, not fixer)

The value of a review is that the user can trust every line of it. The rules below exist
to keep that trust; the lenses and the method exist to make the review repeatable, so the
next one can say what got better.

## 0. Honesty contract

- **Change nothing** while reviewing: no code, no Cloudflare/WordPress settings, not even
  an "obvious" one-liner. Each finding ends in a proposal and the user decides. Anything
  on Cloudflare, DNS or the servers goes through `infra-servidores`, and only after an OK.
- **Every claim carries exactly one tag:** **(O)** observed on the live site (screenshot,
  measurement, curl) · **(H)** heuristic or convention, with its source · **(D)** document
  (intent file, BACKLOG, ADR, code). Never write a visitor reaction you did not observe;
  "a visitor might…" is (H) at best.
- Say which numbers are **lab** (Lighthouse, PageSpeed lab) and which are **field** (CrUX).
  New sites have no field data; say so rather than implying it.
- Legal points are (H) and say "not legal advice".
- Review the **deployed domain**, not files on disk: Cloudflare and WordPress inject
  scripts, headers and markup that the repo doesn't show. Note which commit is live.
- No overall design score. Scores invite arguing about the number instead of the finding.
- Remove before add: when a problem can be fixed by cutting something, propose the cut first.

## 1. Intent to judge against (D)

**First find what is live.** The checkout may be on an unmerged branch whose BACKLOG
already marks things ✅, or the live site may be an older or hand-uploaded build.

1. **Which source serves the domain:** the intent file says; if it doesn't, grep the
   `routes`/custom domains in every `wrangler.jsonc`/`wrangler.toml` of the repo (a repo can
   hold several sites: remembart's landing is `web/`, not `app-site/`).
2. **Which commit:** for a git-built host (Workers Builds), the branch it builds. Check the
   live HTML matches: for hand-written HTML, `diff <(git show main:index.html) <(curl …)`;
   for built sites, build that commit locally and diff the output. If nothing matches,
   take a distinctive string from the live HTML and run `git log --all -S '<string>'`, and
   use `last-modified` to date it. If it still doesn't match any commit, write "live
   commit: unknown" in the header: an undeployable or untraceable live site is itself a
   finding.
3. From then on read code, BACKLOG and docs at the live commit with `git show <live>:<path>`,
   and say when a branch claims fixes that aren't deployed.

Read `docs/design-intent.md` in the project repo: what the site is, audience, CTAs,
promises, **what it must not say**, languages, links, where each page type is generated.
Then `BACKLOG.md` (planned work is reported as "already planned", not as a discovery),
the ADRs the intent file points to, and the last `docs/REVIEW-WEB-*.md` (check what was
fixed and what came back). Read the previous review's item headings before your own pass:
they are checks a fresh pass tends to miss (a broken scrollspy, a missing legal link).

If the intent file is missing, create it first as the `design` skill describes (template in
`~/.claude/skills/design/references/design-intent-template.md`, questions to the user in
one batch, OK before writing it into the repo). Reviewing without it means judging
against your own guess of the goal, which is the failure this whole setup avoids.
When the user can't answer now (a batch of reviews, a background run), draft it into the
scratchpad from the repo and the live site, mark every inferred fact "(assumed)", list the
questions at its end, and tag findings that rest on an assumption ("H, assumed"). The
draft goes into the repo only after the user answers.

## 2. The six lenses

1. **5-second test.** From the first screen alone at 1280×800 and 390×844: can you say
   what it is, what the visitor does there, and what it costs? Is there a real image of
   the product above the fold? Compare with "What it is" in the intent file.
2. **Calls to action.** Every CTA in the intent file, on every page type it lists (home,
   detail pages, posts, 404). How far down, in mobile px, is the main conversion? Do the
   external surfaces (stores, itch, social) link back?
3. **Copy and languages.** Anything from "What we must not say"; promises the docs don't
   support (features, dates, prices, money); repeated messages; jargon a newcomer can't
   read. Per locale: leftover English, literal translations, a switcher visible without
   scrolling, text that breaks the layout in the longest locale. **Freshness:** dates,
   statuses ("closed beta", "coming soon", deadlines) and figures checked against today
   and against the other project sites, which often disagree; sources checked against the
   project's own sourcing rules (CLAUDE.md, intent file). On news or data sites this is
   where the most important findings are.
   For a line-by-line language pass (back-translations, UI terms against the app's
   strings), run the `copy-review` skill and link its report.
4. **Accessibility beyond Lighthouse.** Text < 12 px, targets < 44 px (under 24 px fails
   WCAG 2.2 AA unless the 2.5.8 spacing or inline-link exception applies: check before
   tagging it a WCAG failure), broken `aria-*` references, content hidden until JS runs,
   `prefers-reduced-motion`, focus styles and sticky headers covering focus, a `<main>`
   on every template, `lang`/`hreflang`.
   Run the `a11y` skill's script and checklist for this lens (§1–2 there); it runs full
   axe-core, the keyboard walk and the accessibility tree, which Lighthouse doesn't.
5. **Real performance.** Against the budgets in the `design` skill (§4), measured as in §3.
6. **Trust.** Privacy text vs. what actually loads: third-party scripts and every cookie,
   and every `/cdn-cgi/*` request. Those are Cloudflare features someone switched on (Web
   Analytics beacon, JavaScript Detections with `cf_clearance`, Email Obfuscation, managed
   `robots.txt`, Rocket Loader) and the privacy text has to name them, so list them as
   owner decisions, not noise. Promises like "unsubscribe anytime" vs. how it works in
   code; legal notice (LSSI-CE) reachable from every page; dead `href="#"`; privacy/404
   consistent with the rest; security headers; redirects (`www`, old domains, preview
   hosts). **Regulated sectors:** healthcare sites (psychologists, clinics) also get the
   sector's rules: professional association and registration number visible, no
   guarantees of results, no testimonials or urgency, health data kept out of
   third-party channels without warning (see `vendor/README.md` in `.github`). Tag as (H),
   "not legal advice".

## 3. Method (all (O) evidence comes from here)

Work in the scratchpad (`$SCRATCH/review-<project>-<yyyy-mm>/`), never in the repo.

**First-screen captures and Lighthouse** with the bundled script:

```bash
S=~/.claude/skills/design-review/scripts/capture.sh
OUT=$SCRATCH/review-echoes-2026-11
LH_PAGES="home es detail privacy" \
$S https://echoesofthegarden.com "$OUT" home: es:es/ devlog:devlog/ post:devlog/<slug>/ \
   detail:bestiary/<slug>/ privacy:privacy/ 404:no-existe/
```

Every page is screenshotted; Lighthouse runs only on `LH_PAGES` (never the 404: it fails on
non-200 pages and holds the shared lock while it retries). The script first prints a
`STATUS` line for any page that doesn't answer 200: either a wrong path in your command or
a finding (a legal page that 404s). Lighthouse runs from all reviews share one lock, so
when several reviews run in parallel keep `LH_PAGES` to about four pages each; the script
says when it is waiting for the lock.

It writes `shots/<page>_<width>.png` at 1280, 390 and 900 px (900 catches the nav breaking
between desktop and mobile layouts) and `lh/<page>_<mobile|desktop>.json`, printing one
summary line per run, the host load, and "N/M runs ok". A failed run is retried once and
reported, never silently skipped: if the summary says fewer than all, rerun those pages
(`SHOTS=0 LH_PAGES="…"`) before writing numbers. Lighthouse refuses non-200 pages, so leave
the 404 out of `LH_PAGES`. Pick page types from the intent file: one of each template, plus
the pages Google sends traffic to.

- **PageSpeed first** when you need field data:
  `curl -m 60 "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<url>&strategy=mobile"`.
  Without an API key expect 429 / "Quota exceeded"; say so in the report and use the local
  Lighthouse runs, which use the same engine.
- **TBT is noisy.** Run the home page at least twice (`SHOTS=0 RUN=2 LH_PAGES=home $S …`)
  and report the range. On a loaded machine (load average above the core count) the same
  page has ranged 0.5–8.6 s; say the load in the report and don't name a cause from one run.
- **Isolate the cause before blaming it:** rerun with `BLOCK='*<suspect>*'` (passed to
  `--blocked-url-patterns`, kept in the file name), at least twice, and compare TBT, score
  and bytes with the normal runs. Then check `forced-reflow-insight` and
  `mainthread-work-breakdown`: a cause that doesn't move TBT when blocked isn't the cause,
  whatever the previous review said.
- Useful audits in the JSON: `mainthread-work-breakdown`, `bootup-time`,
  `image-delivery-insight`, `forced-reflow-insight`, `total-byte-weight`, `deprecations`
  (read `.source.url`: warnings from `/cdn-cgi/challenge-platform/` are Cloudflare's, not
  the site's). Don't trust `landmark-one-main`: it has passed on a page with no `<main>`;
  `measure.mjs` counts the real ones.
- **Don't use Lighthouse's `fullPageScreenshot`:** it stretches 100vh heroes and leaves
  reveal-on-scroll sections invisible.

**In-page measurements at an exact width** with the second script (uses Lighthouse's cached
puppeteer-core and the system Chromium, so run `capture.sh` first):

```bash
node ~/.claude/skills/design-review/scripts/measure.mjs https://echoesofthegarden.com/ 390
```

It prints JSON: page height and section offsets, offset of the first large media and the
first form, text under 12 px (with samples), targets under 24 and 44 px, `<main>` count,
broken `aria-*` id references, `href="#"` links, `scroll-padding-top`, whether any CSS
handles reduced motion, all cookies including `httpOnly` ones (`document.cookie` can't see
those, and privacy claims depend on them), and with JS off: hidden sections (after
CSS-only entry animations finish), Cloudflare-obfuscated emails (they don't work without
JS) and `<noscript>` text.
Check what "first large media" actually is in the screenshot: it may be decoration, not a
product image. Run it at 390 and 1280, and on each template.

**Below the fold, visually:** headless first: `chromium --headless=new --window-size=390,9000
--screenshot=…` gives the whole page in one tall image, then crop it into parts to look at
(reveal effects may not have fired; check in Chrome if a section is blank). When
claude-in-chrome is available and no other review shares the browser, use it to look at
sections: scroll
with `document.getElementById(id).scrollIntoView()` plus a ~900 ms wait so reveal effects
fire, then screenshot. **Don't trust `resize_window`** for widths (asked for 390, it gave
322, 500 and 899): use it to look, and `measure.mjs` for numbers at exact widths. Keyboard
focus: Tab through the first screen in Chrome and check the ring is visible and not under
a sticky header. Close every tab you opened.

**curl checks** (always `curl -m 15`, some hosts hang; send a browser User-Agent with
`-A`: Cloudflare only injects its analytics beacon and challenge scripts into requests that
look like a browser, so a bare curl misses exactly the scripts the privacy text must name): `curl -sI` on the root (headers,
CSP), a 404, a URL without its trailing slash (expect 301/308, not 302/307), `www.`, old
domains and preview hosts (expect 301s); `sitemap.xml` (count `<loc>`, hreflang
alternates), `robots.txt`; external pages from the intent file, grepped for a link back.
If a host doesn't answer at all, first ask its authoritative nameserver
(`dig +short <host> @<ns>`): no record is a real DNS bug, and the next step would hide it.
Only then retry through the main domain's edge
(`curl --resolve <host>:443:<ip-of-main-domain> https://<host>/`): if that 301s, the
redirect is fine and it's local network or DNS, so report it as unconfirmed.
When a whole site is unreachable that way (seen in 2026-11: Cloudflare's 188.114.96.x/97.x
range timed out from José's network while other Cloudflare IPs worked), run the scripts
through a working edge with `HOST_RULES='MAP <host> <ip-that-works>'`: `capture.sh`,
`measure.mjs` and `a11y.mjs` all pass it to Chromium. Say so in the report header.

**Code cross-checks (read only):** the source templates the intent file names (findings
point to them, not to generated HTML), JS observers, and the server code behind any
promise (subscribe/unsubscribe, forms).

## 4. Report: `docs/REVIEW-WEB-<yyyy-mm>.md`

Write it in the scratchpad first; it goes into the repo's `docs/` only after the user's OK.
Write it in the user's language (Spanish by default).

1. **Header:** date, live commit, pages and widths reviewed, PageSpeed or local Lighthouse
   (and why), where the screenshots are, the tag legend and the effort legend:
   **S** < 1 h · **M** half a day · **L** more.
2. **Lighthouse table:** page × perf mobile/desktop, a11y, best practices, SEO, LCP and TBT
   mobile, page weight; then the isolation runs.
3. **Prioritised list**, by impact on understanding and conversion first, then trust,
   accessibility, performance. Each item:

   ```
   ### N. [S|M|L] (O|H|D) Title that states the problem
   What was seen, with numbers and where (page, width, file:line).
   **Proposal:** concrete — copy written out, CSS values, file:line, or what to cut.
   Capturas: shots/home_390.png
   ```
   Combined tags like (O+D) are fine when both apply; each claim inside still has one.
4. **Previous review:** each of its items as fixed / still open / changed, at the live commit.
5. **What is already good**, concrete and tagged, so nobody "fixes" it.
6. **Top 5 to do first.**

If a report for that month already exists, name the new one `REVIEW-WEB-<yyyy-mm-dd>.md`.

Then in chat: the item list as a short table, the absolute paths of the report and the
screenshots, and the offer to move the report into `docs/` and to start on the Top 5 with
the `design` skill. Nothing is applied without an OK.

## 5. Self-check

- [ ] `git status` clean in the project repo.
- [ ] Every item has a tag and a concrete proposal; no numeric design score.
- [ ] Every screenshot named in the report exists.
- [ ] Nothing in `BACKLOG.md` is reported as new without saying so; the previous review's
      items are marked fixed / still open.
- [ ] Lab vs. field stated; PageSpeed quota status stated.
- [ ] Browser tabs you opened are closed.

Where the lenses and numbers come from: `~/.claude/skills/design/references/sources.md`.
