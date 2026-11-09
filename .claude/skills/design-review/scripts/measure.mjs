// In-page measurements at an exact viewport width, for design-review.
// Usage: node measure.mjs <url> [width=390] [height=844]
// Uses puppeteer-core from the Lighthouse npx cache (run capture.sh once first) and the system Chromium.
import { readdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { execSync } from 'node:child_process';

const [url, width = '390', height = '844'] = process.argv.slice(2);
if (!url) { console.error('usage: node measure.mjs <url> [width] [height]'); process.exit(2); }

const npx = `${homedir()}/.npm/_npx`;
const entry = existsSync(npx) && readdirSync(npx)
  .map(d => `${npx}/${d}/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js`).find(existsSync);
if (!entry) { console.error('puppeteer-core not found: run capture.sh (npx lighthouse) once first'); process.exit(2); }
const { default: puppeteer } = await import(entry);
const chrome = execSync('command -v chromium || command -v google-chrome-stable || command -v google-chrome', { shell: '/bin/bash' }).toString().trim();

const browser = await puppeteer.launch({ executablePath: chrome, headless: true,
  // HOST_RULES='MAP host ip' routes around a local network block (see design-review SKILL.md).
  args: process.env.HOST_RULES ? [`--host-resolver-rules=${process.env.HOST_RULES}`] : [] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: +width, height: +height, isMobile: +width < 700, hasTouch: +width < 700 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  // Scroll through once so reveal-on-scroll content is in its final state.
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 900));

  const m = await page.evaluate(() => {
    const top = e => Math.round(e.getBoundingClientRect().top + scrollY);
    const visible = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0; };
    const small = [...document.querySelectorAll('body *')].filter(e =>
      [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && visible(e) && parseFloat(getComputedStyle(e).fontSize) < 12);
    const targets = [...document.querySelectorAll('a[href],button,input,select,textarea,[role=button],[tabindex]:not([tabindex="-1"])')].filter(visible)
      .map(e => { const r = e.getBoundingClientRect(); return { e, w: Math.round(r.width), h: Math.round(r.height) }; })
      // Links inside running text are exempt from WCAG target size.
      .filter(t => !(t.e.tagName === 'A' && t.e.closest('p,li') && t.e.closest('p,li').textContent.trim().length > t.e.textContent.trim().length + 20));
    const label = e => (e.getAttribute('aria-label') || e.textContent || e.name || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
    const idrefs = [...document.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls]')]
      .flatMap(e => ['aria-labelledby', 'aria-describedby', 'aria-controls'].flatMap(a => (e.getAttribute(a) || '').split(/\s+/).filter(Boolean)))
      .filter(id => !document.getElementById(id));
    const img = [...document.querySelectorAll('img,video,picture,canvas')].find(e => visible(e) && e.getBoundingClientRect().width > 150);
    const form = document.querySelector('form');
    return {
      innerWidth, scrollHeight: document.body.scrollHeight,
      horizontalScroll: document.documentElement.scrollWidth > innerWidth, // a11y.mjs names the culprits at 320 px
      lang: document.documentElement.lang, main: document.querySelectorAll('main,[role=main]').length,
      firstLargeMediaTop: img ? top(img) : null, firstFormTop: form ? top(form) : null,
      sections: [...document.querySelectorAll('section[id],main > [id]')].map(s => `${s.id}@${top(s)}+${s.offsetHeight}`),
      textUnder12px: small.length, textUnder12pxSample: [...new Set(small.map(e => `${parseFloat(getComputedStyle(e).fontSize)}px "${label(e)}"`))].slice(0, 12),
      targetsUnder24: targets.filter(t => t.w < 24 || t.h < 24).map(t => `${t.w}x${t.h} "${label(t.e)}"`).slice(0, 15),
      targetsUnder44: targets.filter(t => t.w < 44 || t.h < 44).length, targets: targets.length,
      brokenAriaRefs: idrefs, deadHashLinks: [...document.querySelectorAll('a[href="#"]')].map(label),
      scrollPaddingTop: getComputedStyle(document.documentElement).scrollPaddingTop,
      reducedMotionCss: [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => r.conditionText?.includes('prefers-reduced-motion')); } catch { return false; } }),
    };
  });
  // Cookies including httpOnly ones that document.cookie cannot see.
  m.cookies = (await page.cookies()).map(c => `${c.name}${c.httpOnly ? ' (httpOnly)' : ''}${c.session ? ' (session)' : ''} ${c.domain}`);
  // Same page with JavaScript off: is the content still there?
  const nojs = await browser.newPage();
  await nojs.setJavaScriptEnabled(false);
  await nojs.setViewport({ width: +width, height: +height });
  await nojs.goto(url, { waitUntil: 'load', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2500)); // let CSS-only entry animations finish, they are not JS-dependent
  m.noJs = await nojs.evaluate(() => ({
    // Cloudflare Email Obfuscation rewrites addresses into /cdn-cgi/l/email-protection, decoded by JS.
    obfuscatedEmails: document.querySelectorAll('a[href*="/cdn-cgi/l/email-protection"],[data-cfemail]').length,
    mailtoLinks: document.querySelectorAll('a[href^="mailto:"]').length,
    noscriptText: [...document.querySelectorAll('noscript')].map(n => n.textContent.trim().slice(0, 80)).filter(Boolean),
  }));
  m.noJsHiddenSections = await nojs.evaluate(() => [...document.querySelectorAll('section')].filter(s => +getComputedStyle(s).opacity === 0 || [...s.querySelectorAll('*')].some(e => e.offsetHeight > 50 && +getComputedStyle(e).opacity === 0)).map(s => s.id || s.className));
  console.log(JSON.stringify({ url, ...m }, null, 2));
} finally { await browser.close(); }
