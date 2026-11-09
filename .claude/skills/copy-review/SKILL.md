---
name: copy-review
description: >
  Review the words of a website, landing page or app screen of any digital-multiverse project
  in every language it ships (English, Spanish, Italian…): meaning read as a native reader,
  literal translations and double meanings, register, UI terms that must match the app's own
  strings, claims against docs/design-intent.md, AI tells, typography per locale and fit in
  the layout. Reviewer by default: a findings table with back-translations and proposals;
  fixes in the source only when the user or the design skill asks. Use it whenever copy or
  translations come up, before a launch, after any copy change, and as the copy lens of
  design and design-review. Triggers: "revisa los textos", "revisa la traducción", "¿suena
  natural?", "¿está bien en italiano?", "textos de la web", "copy review", "proofread the
  translations", "check the Spanish", "localization review", "does this read well".
---

# Copy review (every language, read as a native)

Built on two installed skills; load them, don't repeat them:

- **copy-editing** (marketingskills): the seven sweeps (clarity, voice, so-what, proof,
  specificity, emotion, zero risk) and plain-language swaps. Run it per locale, not only on
  English.
- **no-ai-slop**, in *detect* mode: name each AI pattern with the line, in every locale.
  Spanish and Italian have their own tells (see `references/traps.md`).

This skill adds what they miss: a sentence that is grammatical, on-brand and persuasive in
English can be wrong in Spanish. "La pantalla se cuelga como un cuadro" passed every
English-centred check and shipped meaning "the screen freezes" (remembart, 2026-11).

## 0. Contract

- **Reviewer by default.** Change nothing; every finding ends in a proposal. Fix only when
  the user asks or when `design` calls this skill as part of its work, and then fix in the
  source the intent file names (`build.py`, `strings.xml`, templates), never generated HTML.
- **You are not a native speaker.** Say so once in the report. Anything that rests on taste
  or regional usage is a *warning* marked "needs native", not a fact. A locale with no named
  native reviewer in the intent file gets that line in the report header.
- **Zero findings is a valid result.** Don't invent problems to fill the table.
- Commits, pushes and deploys need the user's OK, as in `design` §5.

## 1. Inputs

1. `docs/design-intent.md`: promises, **what we must not say**, voice, languages, who checks
   each language, where the copy lives.
2. **The glossary is the app.** UI names quoted on the web (buttons, menu items, settings)
   must match the app's strings in that locale, letter for letter: Android
   `res/values-<lang>/strings.xml`, web i18n files, or the template dicts. If the web says
   «Pausar en esta foto», `strings.xml` in `values-es` must say exactly that. Product and
   frame names follow the same rule.
3. The last `docs/REVIEW-COPY-*.md` and `docs/REVIEW-WEB-*.md`: what was fixed, what came back.
4. `references/traps.md` in this skill: known traps per language. Read it before your pass.

**Get all the text, including the text nobody sees on screen:**

```bash
python3 ~/.claude/skills/copy-review/scripts/extract.py dist/index.html dist/es/index.html …
# or live:  curl -s https://site/es/ | python3 …/extract.py -
```

It prints every visible string, plus `alt`, `title`, `aria-label`, `<title>`, meta
description, `og:*` and JSON-LD text, each tagged with its element, in page order. Review
those too: alt text and meta descriptions get read aloud and shown in search results.

## 2. Passes (one locale at a time, same order every time)

Inspired by the structural / terminology / semantic split of ethereum.org's `intl-review`.

**A. Meaning: the cold read.** Read each string as a native reader who has never seen the
English. For each one:
- **Back-translate it literally** into English, word by word ("the screen hangs itself like
  a painting"), and compare with what the source meant. A gap is a finding.
- **Second meanings:** verbs with a common figurative sense (colgar, salir, bajar, subir,
  cargar, appendere, uscire, scaricare), idioms translated word for word, false friends
  (actualmente, eventualmente, librería, realizar; attualmente, eventualmente, libreria).
- **Ambiguous pronouns and subjects:** what does "colgarla" or "hang it" refer to? If the
  reader can pick the wrong noun, rewrite.
- Agreement (gender and number with brand and frame names), register (tú/usted, tu/Lei,
  vosotros vs. tú in the same page: see traps.md), and tense.

**B. Terms.** Every UI name, product and frame name against the glossary in §1.2. Same
concept, same word across the page and across pages (don't call it "tele" in the hero and
"televisor" in the FAQ unless on purpose). Brand names never translated.

**C. Claims.** Every claim against "Promises" and "What we must not say" in the intent file,
in **every** locale: a translator can turn "coming to Google Play" into "available on Google
Play". Freshness: dates, version, "coming soon", tested devices, against today.

**D. Style.** copy-editing's sweeps and no-ai-slop detect on each locale. Then the
locale's typography (traps.md): opening ¿¡, quote style consistent, Italian accented
capitals (È, not E'), apostrophes, spaces before units (15 s), number and date formats,
sentence case in headings (Spanish and Italian don't capitalise every word).

**E. Fit.** The longest locale in the real layout: buttons that wrap, headings that break
badly, nav that overflows at 900 px. Use `design-review/scripts/capture.sh` screenshots or
the ones the calling skill already took; don't guess from character counts.

## 3. Severity (from ethereum.org's rubric)

| Level | When | Example |
|---|---|---|
| **Critical** | Wrong or embarrassing meaning, a claim against the intent file, a UI term that doesn't match the app, a string left in the wrong language | «se cuelga» = freezes; «disponible en Google Play» before launch |
| **Warning** | Awkward or unnatural but understood, register slips, inconsistent term, anything "needs native" | «di base» for "by default" |
| **Info** | Valid alternatives, style preferences, glossary additions to consider | «tele» vs «televisor» |

## 4. Report

`docs/REVIEW-COPY-<yyyy-mm-dd>.md`, written in the scratchpad first; into the repo only after
the user's OK. In the user's language.

1. Header: date, commit or URL reviewed, locales, who the native reviewer is per locale (or
   "none"), "the reviewer is not a native speaker".
2. One table per locale, criticals first:

   | # | Level | Where (file:line or key) | Now | Back-translation | Problem | Proposal |

   The proposal is the full replacement string, ready to paste, not "rephrase this".
3. Cross-locale: claims or terms that differ between languages.
4. **What is already good**, so nobody "fixes" it.
5. **Questions for the native reviewer:** the warnings you could not settle.

In chat: the criticals as a short table and the report path. Offer to apply them with
`design` (or directly, if the user asked for fixes).

## 5. Learn

Every new trap you find (a word, an idiom, a typographic slip) goes into
`references/traps.md` under its language, with the example and the fix, so the next review
starts with it. That file is this skill's memory; keep each entry to one line.

## 6. Self-check

- [ ] Every locale read in full, including alt, meta description, `<title>` and JSON-LD.
- [ ] Every UI term checked against the app's strings in that locale.
- [ ] Every critical has a back-translation and a ready-to-paste replacement.
- [ ] Claims checked against the intent file in every locale, not just English.
- [ ] "Not a native speaker" and the native reviewer per locale stated.
- [ ] New traps added to `references/traps.md`.
- [ ] Nothing changed in the repo unless fixes were asked for; nothing committed without OK.

Sources and what was taken from each: `references/sources.md`.
