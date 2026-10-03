# Vendored third-party skills

Copies of external Claude skills, pinned to a reviewed commit so upstream changes never reach
our agents without review. Each folder keeps its upstream layout plus a `SOURCE.md` (repo,
commit, license, local changes) and the upstream `LICENSE`.

| Folder | Upstream | What it is for |
|---|---|---|
| `marketingskills/` | coreyhaines31/marketingskills | ~45 marketing skills: SEO audit, AI search, schema, copywriting, CRO, ads, analytics, content strategy |
| `no-ai-slop/` | petergyang/no-ai-slop | Strip AI-writing patterns from prose |
| `taste-skill/` | Leonxlnx/taste-skill | Anti-generic frontend design rules (several style variants) |

Skills live at `<folder>/skills/<skill>/SKILL.md`. Claude Code only auto-discovers skills in
`~/.claude/skills/<name>/` or a project's `.claude/skills/<name>/`, so to enable one, symlink it:

```bash
ln -s /mnt/hdd/repositories/.github/.claude/skills/vendor/no-ai-slop/skills/no-ai-slop ~/.claude/skills/no-ai-slop
```

Healthcare sites (e.g. elenapastorpsicologia): marketing advice on urgency, popups, testimonials
and ad claims must be filtered against the psychologists' code of ethics and Google's
healthcare ad policies.

Update policy: never pull blindly. Clone upstream, diff, review, copy, bump the commit in `SOURCE.md`.
