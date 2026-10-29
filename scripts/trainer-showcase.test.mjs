import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { publicFiles, localTarget, renderSitePages } from './public-files.mjs';
import { canonicalPages as pages } from './site-pages.mjs';
import { renderHomeClient } from './home-render.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const documents = await renderSitePages(root);
const read = file => documents.has(file) ? Promise.resolve(documents.get(file)) : readFile(join(root, file), 'utf8');
const html = await read('index.html');
const source = await read('assets/js/app-showcase.js');
const section = html.match(/<section[^>]+id="ios-trainer"[\s\S]*?<\/section>/)?.[0];
const keys = ['home', 'calendar', 'clients', 'workout', 'agenda'];
const context = vm.createContext({});
vm.runInContext(source, context);
const indexAtLine = context.GymManagerShowcase.indexAtLine;

test('five real screens replace the Trainer video, with corresponding stories and anchors', () => {
  assert.ok(section);
  assert.match(html, /<script\b[^>]+src="assets\/js\/app-showcase.js"/);
  assert.doesNotMatch(section, /<video|autoplay|data-video-restart/);
  assert.equal((section.match(/data-showcase-step=/g) || []).length, 5);
  assert.equal((section.match(/data-showcase-screen=/g) || []).length, 5);
  for (const key of keys) {
    assert.ok(section.includes('id="trainer-' + key + '"'));
    assert.ok(section.includes('href="#trainer-' + key + '"'));
    assert.ok(section.includes('data-showcase-screen="' + key + '"'));
  }
  assert.match(section, /dati DEMO/);
  assert.match(section, /estensione del tuo gestionale/);
  assert.ok(html.indexOf('id="ios-trainer"') < html.indexOf('id="ecosistema"'));
});

test('scroll selection handles start, boundaries, fast jumps, reverse and deep links deterministically', () => {
  assert.equal(indexAtLine([600, 1200, 1800, 2400, 3000], 450), 0);
  assert.equal(indexAtLine([-500, 450, 1100, 1700, 2300], 450), 1);
  assert.equal(indexAtLine([-2500, -1900, -1300, -700, -100], 450), 4);
  assert.equal(indexAtLine([-100, 500, 1100, 1700, 2300], 450), 0);
  assert.equal(indexAtLine([-1800, -1200, -600, 0, 600], 450), 3);
});

test('public package references only WebP screens and real brand, never the old full Trainer recording', async () => {
  const files = await publicFiles(root);
  for (const key of keys) {
    const name = 'assets/screenshots/ios-trainer-' + key + '.webp';
    assert.ok(files.has(name));
    assert.deepEqual(await readFile(join(root, name)), await readFile(join(root, 'dist', name)));
  }
  assert.equal(files.has('assets/videos/ios-trainer-overview-web.mp4'), false);
  assert.equal(files.has('assets/screenshots/ios-trainer-poster.webp'), false);
  assert.ok(files.has('assets/brand/favicon.png'));
  assert.ok(files.has('assets/brand/gymmanager-logo.webp'));
});

test('screens retain original 400x816 geometry and together weigh less than160KB', async () => {
  let bytes = 0;
  for (const key of keys) {
    const path = join(root, 'assets/screenshots/ios-trainer-' + key + '.webp');
    const result = spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', path], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const stream = JSON.parse(result.stdout).streams[0];
    assert.equal(stream.codec_name, 'webp');
    assert.equal(stream.width, 400);
    assert.equal(stream.height, 816);
    bytes += (await stat(path)).size;
  }
  assert.ok(bytes < 160_000, bytes);
});

test('each derived screen has documented provenance, rather than generated UI', async () => {
  const manifest = JSON.parse(await read('assets/trainer-showcase-manifest.json'));
  assert.deepEqual(manifest.screens.map(s => s.id), keys);
  assert.deepEqual(manifest.screens.map(s => s.timestamp), [1, 36, 44, 52, 75]);
  for (const screen of manifest.screens) {
    const bytes = await readFile(join(root, screen.path));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), screen.sha256);
  }
  assert.equal(manifest.sourceSha256, 'c82a059b28cb2feace44b5ed0cd7416255c08d3f1e83ad84fcf866d7b6253896');
});

test('all pages use real header/footer logo, PNG favicon and correctly resolved App navigation', async () => {
  for (const page of pages) {
    const text = await read(page);
    assert.doesNotMatch(text, />GM<|brand-mark|assets\/favicon\.svg/);
    assert.equal((text.match(/class="brand-logo"/g) || []).length, 2, page);
    assert.match(text, /rel="icon"[^>]+type="image\/png"/);
    for (const key of ['app-trainer']) {
      const links = [...text.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
      assert.ok(links.some(href => localTarget(page,href) === key + '/index.html'), page + ':' + key);
    }
    const nav = text.match(/<div class="nav-links"[\s\S]*?<\/div>/)[0];
    assert.doesNotMatch(nav,/data-nav-section/);
  }
});

test('no-JS and reduced-motion fallback exposes every screenshot with its own text', async () => {
  assert.equal((section.match(/class="app-showcase__inline"/g) || []).length, 5);
  assert.doesNotMatch(section, /class="app-showcase__step[^"]* reveal/);
  const css = await read('assets/css/styles.css');
  assert.match(css, /\.app-showcase__stage \{ display: none/);
  assert.doesNotMatch(css, /prefers-reduced-motion: reduce\), \(max-height: 600px\)/);
  assert.match(css, /\.is-enhanced \.app-showcase__inline \{ display: block/);
  assert.match(source, /failed \|\| reducedMotion.matches/);
  assert.doesNotMatch(source, /shortViewport/);
  assert.doesNotMatch(source, /preventDefault|setInterval|scrollTo|scrollIntoView/);
});

test('source interaction/accessibility contract: scoped instances, focusable links, no forced focus or scroll lock', async () => {
  assert.match(source, /querySelectorAll\('\[data-app-showcase\]'\)/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /passive: true/);
  assert.match(source, /setAttribute\('aria-current', 'step'\)/);
  assert.match(source, /setAttribute\('aria-current', 'location'\)/);
  assert.match(source, /setAttribute\('aria-hidden'/);
  assert.match(source, /classList.remove\('is-enhanced', 'is-compact-story'\)/);
  assert.doesNotMatch(source, /\.focus\(|innerHTML|fetch\(/);
  assert.match(source, /originalCopy.cloneNode/);
  const css = await read('assets/css/styles.css');
  assert.match(css, /\.app-showcase__nav a \{ min-height: 44px/);
  assert.match(css, /object-fit: contain/);
});

test('retained unpublished Client source makes no false media or availability claim', () => {
  const client = renderHomeClient();
  assert.doesNotMatch(html, /id="ios-client"/);
  assert.match(client, /In validazione/);
  assert.match(client, /schermate reali/);
  assert.match(client, /non una schermata del prodotto/);
  assert.doesNotMatch(client, /<video|assets\/screenshots\/ios-client|App Store|Scarica/);
});

test('Desktop overview replaces videos with real static images without autoplay', async () => {
  const js = await read('assets/js/site.js');
  assert.equal((html.match(/<video\b/g) || []).length, 0);
  assert.doesNotMatch(js, /data-video-restart|video\.play\(/);
  assert.match(js, /if \(document.hidden\) videos.forEach/);
});

// Exercise the real controller in an isolated DOM test double, not a second
// implementation. Native layout/interaction remains a separate browser check.
function mount({ reduced = false, short = false, width = 1440, height = 900, stageHeight = 340, topSets = [[0, 800, 1600, 2400, 3200]] } = {}) {
  function node() {
    const attrs = {}, classes = new Set(), handlers = {};
    return {
      attrs, classes, handlers, dataset: {}, complete: true, naturalWidth: 400,
      style: {values:{},setProperty(k,v){this.values[k]=v;},removeProperty(k){delete this.values[k];}},
      setAttribute(k, v) { attrs[k] = v; }, removeAttribute(k) { delete attrs[k]; },
      addEventListener(k, fn) { handlers[k] = fn; },
      classList: { add(k) { classes.add(k); }, remove(...values) { values.forEach(k=>classes.delete(k)); }, toggle(k, on) { if (on) classes.add(k); else classes.delete(k); } }
    };
  }
  const sections = topSets.map(tops => {
    const section = node(), phone = node(), caption = node(), note = node();
    const copy=node(); copy.getBoundingClientRect=()=>({width:160,height:240}); copy.replaceChildren=value=>{copy.rendered=value;};
    const steps = keys.map((key, i) => ({ ...node(), dataset: { showcaseStep: key, showcaseLabel: key }, querySelector:()=>({getBoundingClientRect:()=>({height:240}),cloneNode:()=>({key})}), getBoundingClientRect: () => ({ top: tops[i] }) }));
    const screens = keys.map(key => ({ ...node(), dataset: { showcaseScreen: key } }));
    const links = keys.map(key => ({ ...node(), dataset: { showcaseLink: key } }));
    section.querySelectorAll = selector => selector === '[data-showcase-step]' ? steps : selector === '[data-showcase-screen]' ? screens : links;
    section.querySelector = selector => selector === '[data-showcase-caption]' ? caption : selector === '[data-showcase-phone]' ? phone : selector === '.app-showcase__media-error' ? note : selector==='[data-showcase-active-copy]' ? copy : selector==='.app-showcase__layout' ? {getBoundingClientRect:()=>({top:2000})} : { getBoundingClientRect: () => ({ bottom: 400,height:stageHeight }) };
    return Object.assign(section, { screens, steps, links, note, caption, phone, copy });
  });
  const events = {}, media = { reduced: { matches: reduced, addEventListener() {} }, short: { matches: short, addEventListener() {} } };
  const sandbox = vm.createContext({
    document: { querySelectorAll: () => sections, querySelector: () => null, dispatchEvent() {} },
    window: { innerWidth: width, innerHeight: height, scrollY: 0, matchMedia: query => query.includes('reduce') ? media.reduced : media.short, addEventListener: (k, fn) => { events[k] = fn; }, requestAnimationFrame: fn => fn() },
    CustomEvent: function (type, options) { this.type = type; this.detail = options.detail; }
  });
  vm.runInContext(source, sandbox);
  return { sections, media, events, scroll(y) { sandbox.window.scrollY = y; events.scroll(); } };
}

test('controller selects exactly one image/link; direct selections and scroll reversal use the same contract', () => {
  const tops = [0, 800, 1600, 2400, 3200];
  const { sections: [section], events } = mount({ topSets: [tops] });
  assert.equal(section.dataset.activeScreen, 'home');
  section.links[3].handlers.click();
  assert.equal(section.dataset.activeScreen, 'workout');
  assert.equal(section.screens.filter(s => s.attrs['aria-hidden'] === 'false').length, 1);
  tops.splice(0, 5, -2500, -1700, -900, -100, 700);
  events.resize();
  assert.equal(section.dataset.activeScreen, 'workout');
  tops.splice(0, 5, 0, 800, 1600, 2400, 3200);
  events.resize();
  assert.equal(section.dataset.activeScreen, 'home');
  assert.equal(section.links.filter(s => s.attrs['aria-current'] === 'step').length, 1);
});

test('separate instances keep independent state and image failures restore inline fallback', () => {
  const { sections: [one, two], events } = mount({ topSets: [[0, 800, 1600, 2400, 3200], [-800, 0, 800, 1600, 2400]] });
  assert.equal(one.dataset.activeScreen, 'home');
  assert.equal(two.dataset.activeScreen, 'calendar');
  one.screens[0].handlers.error();
  events.scroll();
  assert.equal(one.classes.has('is-enhanced'), false);
  assert.equal(one.classes.has('has-media-error'), true);
  assert.equal(one.note.hidden, false);
  assert.equal(two.classes.has('is-enhanced'), true);
});

test('reduced motion retains inline fallback without conflating short height', () => {
  assert.equal(mount({reduced:true}).sections[0].classes.has('is-enhanced'),false);
  assert.equal(mount({short:true}).sections[0].classes.has('is-enhanced'),true);
});

test('cached Trainer geometry follows actual scroll and reverse without a layout re-read', () => {
  const m=mount();
  for(const step of m.sections[0].steps) step.getBoundingClientRect=()=>{throw new Error('geometry read during scroll');};
  m.scroll(2200); assert.equal(m.sections[0].dataset.activeScreen,'workout');
  m.scroll(10000); assert.equal(m.sections[0].dataset.activeScreen,'agenda');
  m.scroll(0); assert.equal(m.sections[0].dataset.activeScreen,'home');
  assert.equal(m.sections[0].dataset.showcaseProgress,'0.140625');
});

test('compact Trainer traverses all five real-source copies and reverses deterministically',()=>{
  for(const [width,height] of [[320,568],[375,812],[768,1024],[844,390]]) {
    const m=mount({width,height,stageHeight:280}), section=m.sections[0];
    assert.ok(section.classes.has('is-compact-story'));
    const run=Number.parseFloat(section.style.values['--showcase-step-run'])*4;
    const origin=2000-(width<=768?82:94);
    for(const [p,key] of [[0,'home'],[.25,'calendar'],[.5,'clients'],[.75,'workout'],[1,'agenda'],[.25,'calendar'],[0,'home']]) {
      m.scroll(origin+run*p);
      assert.equal(section.dataset.activeScreen,key);
      assert.equal(section.copy.rendered.key,key);
      assert.equal(section.screens.filter(s=>s.attrs['aria-hidden']==='false').length,1);
    }
    assert.ok(section.steps.every(step=>step.inert && step.attrs['aria-hidden']==='true'));
  }
});

test('measured overflow/media error/reduced motion restore all Trainer source content',()=>{
  const overflow=mount({width:320,height:568,stageHeight:600}).sections[0];
  assert.equal(overflow.dataset.showcaseMode,'content-overflow');
  assert.ok(overflow.steps.every(step=>!step.inert && step.attrs['aria-hidden']===undefined));
  const m=mount({width:375,height:812}), section=m.sections[0];
  section.screens[0].handlers.error();
  assert.equal(section.dataset.showcaseMode,'media-error');
  assert.ok(section.steps.every(step=>!step.inert));
  assert.equal(mount({width:375,height:812,reduced:true}).sections[0].dataset.showcaseMode,'reduced-motion');
});
