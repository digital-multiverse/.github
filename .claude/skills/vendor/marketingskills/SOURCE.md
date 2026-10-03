# Vendored: coreyhaines31/marketingskills

| | |
|---|---|
| Upstream | https://github.com/coreyhaines31/marketingskills |
| Commit | `dda3841f0b294e01e93b1541486beefbfab0915e` (2026-10-02) |
| Copied on | 2026-10-03 |
| License | MIT — see `LICENSE` (keep it with any copy) |
| Local changes | None yet. Record any adaptation here. |

Reviewed before copying: skill instructions contain no remote-install, data-exfiltration or
prompt-injection directives and no sponsored product placement. `tools/clis/` are optional API
wrappers (GA4, Google Ads, Search Console, Ahrefs, Semrush, ...). They only run when a skill is
asked to use one and the matching API key is set in the environment, and they call only that
vendor's API. Root `scripts/` are upstream maintenance helpers.

To update: clone upstream, diff against this folder, review the changes, copy, bump the commit above.
