// Accessibility checks on a live or local URL, for the a11y skill.
// Usage: node a11y.mjs <url> [width=1280]
// Runs: full axe-core (WCAG 2.2 A/AA + best practice), a keyboard walk, unnamed controls in the
// accessibility tree, reflow at 320 px (naming what overflows), the WCAG 1.4.12 text-spacing
// override, reduced motion, and a keyboard test of the mobile menu.
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

const browser = await puppeteer.launch({ executablePath: chrome, headless: true,
  // HOST_RULES='MAP host ip' routes around a local network block (see design-review SKILL.md).
  args: process.env.HOST_RULES ? [`--host-resolver-rules=${process.env.HOST_RULES}`] : [] });
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
  // Reveal-on-scroll content is invisible to axe until it has animated in: scroll through, then
  // force final states, so contrast and names are checked on what visitors actually end up seeing.
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } scrollTo(0, 0); });
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important}html{scroll-behavior:auto!important}.reveal,[class*=reveal],[class*=fade]{opacity:1!important;transform:none!important}' });

  // 1. axe-core, everything WCAG 2.2 A/AA plus best practice.
  await page.evaluate(axeSource);
  const axe = await page.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }));
  out.axeViolations = axe.violations.map(v => ({ id: v.id, impact: v.impact, wcag: v.tags.filter(t => /^wcag\d+$/.test(t)), help: v.help, count: v.nodes.length, targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
  out.axeIncomplete = axe.incomplete.map(v => ({ id: v.id, count: v.nodes.length, targets: v.nodes.slice(0, 5).map(n => n.target.join(' ')) }));

  // 2. Keyboard walk: order, visible focus, focus hidden under fixed/sticky elements.
  out.keyboard = [];
  for (let i = 0; i < TAB_STOPS; i++) {
    await page.keyboard.press('Tab');
    await new Promise(r => setTimeout(r, 150));
    const stop = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      const r = e.getBoundingClientRect(), s = getComputedStyle(e);
      // A ring is a visible change from the unfocused state: outline >= 2 px, or a changed
      // box-shadow/border. Compare against the same element blurred.
      const focused = { o: s.outlineStyle !== 'none' ? parseFloat(s.outlineWidth) : 0, b: s.boxShadow, c: s.borderColor, w: s.borderWidth };
      e.blur(); const u = getComputedStyle(e); const unfocused = { b: u.boxShadow, c: u.borderColor, w: u.borderWidth }; e.focus({ preventScroll: true });
      const ring = focused.o >= 2 ? 'outline' : focused.b !== unfocused.b ? 'shadow (check it is visible)' : (focused.c !== unfocused.c || focused.w !== unfocused.w) ? 'border (check 3:1 and >= 2 px)' : focused.o > 0 ? 'outline < 2 px' : null;
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
  // Grouped by kind: one site-wide focus style shows up as one line, not 60.
  out.keyboardWeakRing = Object.entries(Object.groupBy(out.keyboard.filter(s => s.ring && s.ring !== 'outline'), s => s.ring))
    .map(([kind, stops]) => `${kind}: ${stops.length} stops, e.g. ${stops.slice(0, 3).map(s => s.el).join(', ')}`);
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
      const r = e.getBoundingClientRect();
      const visuallyHidden = r.width <= 2 || r.height <= 2 || s.clip !== 'auto' || s.clipPath !== 'none';
      return !visuallyHidden && /hidden|clip/.test(s.overflow + s.overflowY) && e.scrollHeight > e.clientHeight + 2 && e.textContent.trim();
    }).slice(0, 10).map(e => `${e.tagName.toLowerCase()}.${[...e.classList].join('.')}`);
  });
  await page.close();

  // 5. Reflow at 320 px (WCAG 1.4.10).
  const narrow = await open(320);
  out.reflow320Overflow = await narrow.evaluate(() => {
    if (document.documentElement.scrollWidth <= innerWidth + 1) return [];
    // Name the elements that stick out, outermost first, so the fix has a target.
    const wide = [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed');
    return wide.filter(e => !wide.includes(e.parentElement)).slice(0, 8).map(e => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${[...e.classList].join('.')} right=${Math.round(e.getBoundingClientRect().right)}`);
  });

  // 7. Mobile menu at 390 px: opens with the keyboard, focus goes into it, Escape closes it.
  await narrow.setViewport({ width: 390, height: 844 });
  out.mobileMenu = await narrow.evaluate(() => {
    const btn = [...document.querySelectorAll('button[aria-expanded],[aria-controls][aria-expanded],button[aria-label*=enu i]')].find(b => b.getBoundingClientRect().width > 0);
    return btn ? { found: true, label: btn.getAttribute('aria-label') || btn.textContent.trim(), expanded: btn.getAttribute('aria-expanded'), controls: btn.getAttribute('aria-controls') } : { found: false };
  });
  if (out.mobileMenu.found) {
    const sel = '[aria-expanded],button[aria-label*=enu i]';
    const state = () => narrow.evaluate(s => { const b = [...document.querySelectorAll(s)].find(x => x.getBoundingClientRect().width > 0); const menu = b.getAttribute('aria-controls') && document.getElementById(b.getAttribute('aria-controls')); return { expanded: b.getAttribute('aria-expanded'), label: b.getAttribute('aria-label') || b.textContent.trim(), focusInMenu: menu ? menu.contains(document.activeElement) : null, focus: document.activeElement.tagName.toLowerCase() + ' "' + (document.activeElement.textContent || '').trim().slice(0, 30) + '"' }; }, sel);
    await narrow.evaluate(s => [...document.querySelectorAll(s)].find(x => x.getBoundingClientRect().width > 0).focus(), sel);
    await narrow.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 400));
    out.mobileMenu.afterEnter = await state();
    await narrow.keyboard.press('Tab'); await new Promise(r => setTimeout(r, 150));
    out.mobileMenu.afterTab = await state();
    await narrow.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 300));
    out.mobileMenu.afterEscape = await state();
  } else {
    out.mobileMenu.note = 'no button with aria-expanded found at 390 px: if there is a menu, it is not exposed as expandable (checkbox hacks, divs)';
  }
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
