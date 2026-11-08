// Accessibility checks on a live or local URL, for the a11y skill.
// Usage: node a11y.mjs <url> [width=1280]
// Runs: full axe-core (WCAG 2.2 A/AA + best practice), a keyboard walk, unnamed controls in the
// accessibility tree, reflow at 320 px, the WCAG 1.4.12 text-spacing override, and reduced motion.
// Uses puppeteer-core and axe-core from the Lighthouse npx cache (run `npx -y lighthouse@13.0.1 --version` once).
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { execSync } from 'node:child_process';

const [url, width = '1280'] = process.argv.slice(2);
if (!url) { console.error('usage: node a11y.mjs <url> [width]'); process.exit(2); }
const TAB_STOPS = 60;

const npx = `${homedir()}/.npm/_npx`;
const find = rel => existsSync(npx) && readdirSync(npx).map(d => `${npx}/${d}/node_modules/${rel}`).find(existsSync);
const pptr = find('puppeteer-core/lib/esm/puppeteer/puppeteer-core.js');
const axePath = find('axe-core/axe.min.js');
if (!pptr || !axePath) { console.error('run `npx -y lighthouse@13.0.1 --version` once to populate the npx cache'); process.exit(2); }
const { default: puppeteer } = await import(pptr);
const axeSource = readFileSync(axePath, 'utf8');
const chrome = execSync('command -v chromium || command -v google-chrome-stable || command -v google-chrome', { shell: '/bin/bash' }).toString().trim();

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const open = async (w, opts = {}) => {
  const page = await browser.newPage();
  if (opts.reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: w, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  return page;
};
const out = { url, width: +width };
try {
  const page = await open(+width);

  // 1. axe-core, everything WCAG 2.2 A/AA plus best practice.
  await page.evaluate(axeSource);
  const axe = await page.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }));
  out.axeViolations = axe.violations.map(v => ({ id: v.id, impact: v.impact, wcag: v.tags.filter(t => /^wcag\d+$/.test(t)), help: v.help, count: v.nodes.length, targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
  out.axeIncomplete = axe.incomplete.map(v => `${v.id} (${v.nodes.length})`);

  // 2. Keyboard walk: order, visible focus, focus hidden under fixed/sticky elements.
  out.keyboard = [];
  for (let i = 0; i < TAB_STOPS; i++) {
    await page.keyboard.press('Tab');
    await new Promise(r => setTimeout(r, 250)); // let smooth scrolling settle before measuring
    const stop = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      const r = e.getBoundingClientRect(), s = getComputedStyle(e);
      const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none';
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 10));
      const covered = hit && !e.contains(hit) && !hit.contains(e) && ['fixed', 'sticky'].includes(getComputedStyle(hit.closest('*')).position) ? hit.tagName : null;
      const name = (e.getAttribute('aria-label') || e.textContent || e.value || e.name || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      return { el: `${e.tagName.toLowerCase()} "${name}"`, ring, offscreen: r.bottom < 0 || r.top > innerHeight, covered };
    });
    if (!stop) break;
    if (out.keyboard.length && out.keyboard[0].el === stop.el) break; // wrapped around
    out.keyboard.push(stop);
  }
  out.keyboardNoRing = out.keyboard.filter(s => !s.ring).map(s => s.el);
  out.keyboardCovered = out.keyboard.filter(s => s.covered).map(s => `${s.el} under ${s.covered}`);
  out.keyboardNotScrolledIntoView = out.keyboard.filter(s => s.offscreen).map(s => s.el);
  out.keyboard = `${out.keyboard.length} stops${out.keyboard.length === TAB_STOPS ? ' (limit reached)' : ''}: ` + out.keyboard.map(s => s.el).join(' → ');

  // 3. Controls with no accessible name, from the real accessibility tree.
  const tree = await page.accessibility.snapshot({ interestingOnly: true });
  const unnamed = [];
  const walk = n => { if (['button', 'link', 'textbox', 'combobox', 'checkbox', 'radio', 'menuitem', 'tab', 'searchbox'].includes(n.role) && !n.name?.trim()) unnamed.push(n.role); (n.children || []).forEach(walk); };
  if (tree) walk(tree);
  out.unnamedControls = unnamed;

  // 4. WCAG 1.4.12 text spacing: content clipped once spacing is overridden.
  out.textSpacingClipped = await page.evaluate(() => {
    const st = document.createElement('style');
    st.textContent = '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}';
    document.head.append(st);
    return [...document.querySelectorAll('body *')].filter(e => {
      const s = getComputedStyle(e);
      return e.clientWidth > 2 && /hidden|clip/.test(s.overflow + s.overflowY) && e.scrollHeight > e.clientHeight + 2 && e.textContent.trim();
    }).slice(0, 10).map(e => `${e.tagName.toLowerCase()}.${[...e.classList].join('.')}`);
  });
  await page.close();

  // 5. Reflow at 320 px (WCAG 1.4.10).
  const narrow = await open(320);
  out.reflow320HorizontalScroll = await narrow.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  await narrow.close();

  // 6. Reduced motion: anything still animating or autoplaying?
  const calm = await open(+width, { reducedMotion: true });
  out.reducedMotion = await calm.evaluate(() => ({
    runningAnimations: document.getAnimations().filter(a => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity).length,
    playingVideos: [...document.querySelectorAll('video')].filter(v => !v.paused).length,
  }));
  await calm.close();

  console.log(JSON.stringify(out, null, 2));
} finally { await browser.close(); }
