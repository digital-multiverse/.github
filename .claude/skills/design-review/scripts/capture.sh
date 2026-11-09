#!/usr/bin/env bash
# First-screen captures and Lighthouse runs against a live URL, for design-review.
# Usage: capture.sh <base-url> <out-dir> [name:path ...]
#   capture.sh https://echoesofthegarden.com "$SCRATCH/review" home: es:es/ 404:no-existe/
# Env: WIDTHS (default "1280,800 390,844 900,600")  SHOTS=0 skip screenshots  LH=0 skip Lighthouse
#      LH_PAGES="home es" only these pages  RUN=2 suffix for repeat runs
#      BLOCK='*garden_loop*' isolation run (pattern goes into the file name)
#      HOST_RULES='MAP example.com 172.67.213.226' route around a local network block (see SKILL.md)
# Lighthouse runs hold a lock, so several reviews in parallel don't skew each other's TBT.
set -uo pipefail
base=${1%/}; out=$(realpath -m "$2"); shift 2
[ $# -gt 0 ] || set -- home:
mkdir -p "$out/shots" "$out/lh"
cd "$out" || exit 1   # npx must not pick up the project's package.json
chrome=$(command -v chromium || command -v google-chrome-stable || command -v google-chrome)
echo "host load: $(cut -d' ' -f1-3 /proc/loadavg) on $(nproc) cores (TBT is unreliable when load > cores)"
ua='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'
resolve=(); [ -n "${HOST_RULES:-}" ] && { r=($HOST_RULES); resolve=(--resolve "${r[1]}:443:${r[2]}"); }
for p in "$@"; do   # a page that isn't 200 is a finding, or a wrong path in the command
  n=${p%%:*}; u=${p#*:}
  code=$(curl -s -m 15 -A "$ua" "${resolve[@]}" -o /dev/null -w '%{http_code}' "$base/$u")
  [ "$code" = 200 ] || echo "STATUS $code: $n ($base/$u)"
done
lock="${XDG_RUNTIME_DIR:-/tmp}/design-review-lighthouse.lock"

if [ "${SHOTS:-1}" != 0 ]; then
  for p in "$@"; do
    n=${p%%:*}; u=${p#*:}
    for s in ${WIDTHS:-1280,800 390,844 900,600}; do
      "$chrome" --headless=new --hide-scrollbars --disable-gpu --virtual-time-budget=4000 \
        ${HOST_RULES:+"--host-resolver-rules=$HOST_RULES"} \
        --window-size="$s" --screenshot="$out/shots/${n}_${s%%,*}.png" "$base/$u" 2>/dev/null \
        || echo "SHOT FAILED: $n ${s%%,*}"
    done
  done
  echo "shots in $out/shots"
fi

[ "${LH:-1}" = 0 ] && exit 0
ok=0; total=0
tag=${BLOCK:+_blocked-$(tr -c 'a-zA-Z0-9' '-' <<<"$BLOCK" | sed 's/-*$//;s/^-*//')}${RUN:+_run$RUN}
for p in "$@"; do
  n=${p%%:*}; u=${p#*:}
  case " ${LH_PAGES:-$n} " in *" $n "*) ;; *) continue;; esac
  for mode in mobile desktop; do
    total=$((total+1)); f="$out/lh/${n}_${mode}${tag}.json"
    flags=(--max-wait-for-load=60000); [ $mode = desktop ] && flags+=(--preset=desktop)
    [ -n "${BLOCK:-}" ] && flags+=("--blocked-url-patterns=$BLOCK")
    for try in 1 2; do
      cflags="--headless=new${HOST_RULES:+ --host-resolver-rules='$HOST_RULES'}"
      flock -n "$lock" true || echo "waiting for the Lighthouse lock (another review is running)..."
      CHROME_PATH=$chrome flock "$lock" \
        npx -y lighthouse@13.0.1 "$base/$u" --quiet "${flags[@]}" --chrome-flags="$cflags" --output=json --output-path="$f" 2>>"$out/lh/errors.log" \
        && jq -e '.categories.performance.score != null' "$f" >/dev/null 2>&1 && break
      rm -f "$f"; echo "retry $n $mode ($try)"
    done
    [ -f "$f" ] || { echo "LIGHTHOUSE FAILED: $n $mode (see lh/errors.log)"; continue; }
    ok=$((ok+1))
    jq -r --arg f "${n}_${mode}${tag}" '[$f,
      (.categories|to_entries|map("\(.key)=\((.value.score*100|round))")|join(" ")),
      "LCP=\(.audits["largest-contentful-paint"].displayValue)",
      "TBT=\(.audits["total-blocking-time"].displayValue)",
      "CLS=\(.audits["cumulative-layout-shift"].displayValue)",
      "bytes=\((.audits["total-byte-weight"].numericValue/1024|round))KB"] | join("  ")' "$f"
  done
done
echo "lighthouse: $ok/$total runs ok"
