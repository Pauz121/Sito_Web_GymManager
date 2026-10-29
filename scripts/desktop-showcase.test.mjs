import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { desktopFeatures } from '../content/desktop-features.mjs';
import { renderSitePages, publicFiles, localTarget } from './public-files.mjs';
import { canonicalPages, legacyTargets } from './site-pages.mjs';
import { escapeHtml, renderDesktopOverview } from './desktop-render.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const documents = await renderSitePages(root);
const home = documents.get('index.html');
const desktop = documents.get('desktop/index.html');
const download = documents.get('download/index.html');
const expected = ['dashboard','clienti','allenamenti','agenda','schede-allenamento','alimentazione','progressi','pagamenti'];
test('final dark CTA keeps small text and keyboard focus legible at both gradient endpoints', async () => {
  const css = await readFile(join(root, 'assets/css/styles.css'), 'utf8');
  const text = css.match(/\.cta-panel \.eyebrow\s*\{\s*color:\s*(#[a-f0-9]{6});\s*\}/i)?.[1];
  const focus = css.match(/\.cta-panel :focus-visible\s*\{\s*outline-color:\s*(#[a-f0-9]{6});\s*\}/i)?.[1];
  const panel = css.match(/\.cta-panel\s*\{[^}]*linear-gradient\(130deg,\s*(#[a-f0-9]{6}),\s*(#[a-f0-9]{6})\)/i);
  assert.ok(text && focus && panel, 'explicit scoped text/focus rules and panel gradient must exist');
  function luminance(hex) {
    const [r, g, b] = hex.slice(1).match(/../g).map(value => {
      const channel = parseInt(value, 16) / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    });
    return .2126 * r + .7152 * g + .0722 * b;
  }
  for (const background of panel.slice(1)) {
    for (const [color, minimum] of [[text, 4.5], [focus, 3]]) {
      const values = [luminance(color), luminance(background)].sort((a, b) => b - a);
      assert.ok((values[0] + .05) / (values[1] + .05) >= minimum, `${color} on ${background}`);
    }
  }
});


test('six public routes share one navigation tree; ten aliases point to relevant pages', () => {
  assert.deepEqual(canonicalPages, ['index.html','desktop/index.html','app-trainer/index.html','download/index.html','privacy/index.html','support/index.html']);
  assert.equal(legacyTargets.size,10);
  assert.deepEqual(desktopFeatures.map(feature => feature.slug), expected);
  assert.equal((desktop.match(/class="desktop-chapter"/g)||[]).length,8);
  for (const route of canonicalPages) {
    const html = documents.get(route);
    assert.doesNotMatch(html,/http-equiv="refresh"/);
    assert.equal((html.match(/<h1\b/g)||[]).length,1,route);
    const nav=html.match(/<div class="nav-links"[\s\S]*?<\/div>/)[0];
    assert.deepEqual([...nav.matchAll(/>([^<]+)<\/a>/g)].map(m=>m[1]),['Home','Desktop','App Trainer','Scarica']);
    assert.doesNotMatch(nav,/data-nav-section/);
  }
  for (const [route,target] of legacyTargets) {
    const html=documents.get(route), href=html.match(/href="([^"]+)"/)[1];
    assert.ok(html.length<1200);
    assert.match(html,/http-equiv="refresh"/);
    assert.doesNotMatch(html,/<img|<footer|<script|desktop-chapter/);
    assert.equal(localTarget(route,href),target.split('#')[0]);
  }
});
test('all eight details and actual workflows are present below their own large real image', () => {
  let previous = 0;
  for (const feature of desktopFeatures) {
    const start = desktop.indexOf('id="desktop-' + feature.slug + '"');
    assert.ok(start > previous);
    previous = start;
    const chapter = desktop.slice(start, desktop.indexOf('</article>', start));
    assert.ok(chapter.indexOf('class="desktop-feature__visual') < chapter.indexOf('class="desktop-chapter__body"'));
    for (const value of [feature.longDescription,feature.purpose,...feature.actions,...feature.workflow,...feature.capabilities.flatMap(c => [c.title,c.text])]) assert.ok(chapter.includes(escapeHtml(value)), feature.slug + ':' + value);
  }
});
test('Home is only product overview: detail chapters, download form and legal stay on their routes', () => {
  assert.doesNotMatch(home,/class="desktop-chapter"|class="legal-copy"|id="download-card"/);
  for (const key of ['desktop','ios-trainer','come-funziona','ecosistema']) assert.ok(home.includes('id="'+key+'"'),key);
  assert.match(home,/href="desktop\/">Approfondisci il Desktop/);
  assert.match(home,/href="app-trainer\/">Approfondisci l’app Trainer/);
  assert.doesNotMatch(home,/href="app-client\//);
});
test('Home keeps its opening and places the large mockup after both original buttons', () => {
  assert.match(home, /Il tuo lavoro da Trainer, <em>in un unico posto\.<\/em>/);
  assert.ok(home.indexOf('Scarica GymManager</a>') < home.indexOf('class="hero-visual'));
  assert.ok(home.indexOf('Guarda il gestionale</a>') < home.indexOf('class="hero-visual'));
  assert.match(home, /href="download\/">Scarica GymManager/);
  assert.match(home, /href="#desktop">Guarda il gestionale/);
  assert.equal((home.match(/<h1\b/g) || []).length, 1);
  assert.equal((home.match(/<main\b/g) || []).length, 1);
  assert.equal((home.match(/<footer\b/g) || []).length, 1);
});
test('all existing functionality topics survive inside corresponding chapters', () => {
  for (const key of ['clienti','questionari','allenamento','body-focus','nutrizione','modelli','progressioni','progressi','organizzazione','pagamenti']) assert.ok(desktop.includes('id="feature-' + key + '"'), key);
  for (const term of ['Questionario iniziale','Standard','Body Focus','Progressioni']) assert.ok(desktop.includes(term),term);
});
test('all primary screenshots have true WebP dimensions; no Agenda pending placeholder remains', async () => {
  let total = 0;
  for (const feature of desktopFeatures) {
    assert.ok(feature.heroImage, feature.slug);
    const image = feature.heroImage, path = join(root,image.src);
    const probe = spawnSync('ffprobe',['-v','error','-show_streams','-of','json',path],{encoding:'utf8'});
    assert.equal(probe.status,0,probe.stderr);
    const stream = JSON.parse(probe.stdout).streams[0];
    assert.equal(stream.codec_name,'webp');
    assert.equal(stream.width,image.width); assert.equal(stream.height,image.height);
    total += (await stat(path)).size;
  }
  assert.ok(total < 1000000);
  assert.doesNotMatch(desktop,/Anteprima in preparazione|Manca una cattura reale/);
});
test('user Agenda screenshot is losslessly represented, provenance explicit and source untouched', async () => {
  const path = join(root,'assets/screenshots/desktop-agenda.webp');
  const hash = createHash('sha256').update(await readFile(path)).digest('hex');
  assert.equal(hash,'8f210e1d5698e2c67b389bd5f4ac0024c86ba57664299d2ac54cfc8ae23e2c49');
  const manifest = JSON.parse(await readFile(join(root,'assets/desktop-showcase-manifest.json'),'utf8'));
  assert.equal(manifest.pending.length,0);
  assert.ok(manifest.newImages.some(image => image.path.endsWith('desktop-agenda.webp') && image.sourceSha256 === '48b69cd6522ee7a9dfcac15bdc783e74fd52635baeeadc7c336374d76ebaa567'));
});
test('all route IDs and local anchors resolve without duplicates', () => {
  for (const [route,html] of documents) {
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,route);
    for (const [,href] of html.matchAll(/href="(#[^"]+)"/g)) assert.ok(ids.includes(href.slice(1)),route+href);
  }
});
test('full content is prerendered and build output matches the source model exactly', async () => {
  for (const [path,html] of documents) assert.equal(await readFile(join(root,'dist',path),'utf8'),html,path);
  assert.equal(renderDesktopOverview(),renderDesktopOverview());
  const files = await publicFiles(root);
  for (const file of files) assert.doesNotMatch(file,/\.md$|\.json$|\.mjs$|^content\/|^\.impeccable|\.mp4$|\.vtt$/);
  assert.ok(files.has('assets/screenshots/desktop-agenda.webp'));
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});
test('legacy relative targets remain valid under project-prefix static hosting', () => {
  for (const [route] of legacyTargets) {
    const href = documents.get(route).match(/href="([^"]+)"/)[1];
    const url = new URL(href,new URL(route,'https://example.invalid/project/'));
    assert.ok(url.pathname.startsWith('/project/') && !url.pathname.startsWith('/project/desktop/desktop/'));
  }
});
test('download page alone owns installer/guide/fallback; Home only fetches version', () => {
  assert.equal((download.match(/data-download-link/g)||[]).length,1);
  assert.equal((home.match(/data-download-link/g)||[]).length,0);
  for(const name of ['data-release-version','data-release-date','data-release-status','data-release-fallback','data-release-asset']) assert.ok(download.includes(name),name);
  assert.ok(download.includes('id="download-card"'));
  assert.ok(download.includes('Controlla sempre la provenienza del file.'));
});
