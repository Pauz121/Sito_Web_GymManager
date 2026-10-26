import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { localTarget, pages, publicFiles, isPublicAsset } from './public-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const draftPages = ['privacy/index.html', 'support/index.html'];
const draftMarker = 'Bozza — sito ancora privo di dominio ufficiale definitivo';
const read = path => readFile(join(root, path), 'utf8');

test('both drafts contain the approved identity/contact, visible marker and noindex', async () => {
  for (const page of draftPages) {
    const html = await read(page);
    assert.ok(html.includes(`<strong>${draftMarker}</strong>`));
    assert.match(html, /Paolino Bottiglieri/);
    assert.match(html, /href="mailto:Paolinob2@libero\.it"/);
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(html, /rel="canonical"|https:\/\/(?:localhost|127\.0\.0\.1)/);
    assert.doesNotMatch(html, /<form|<iframe|<input|stripe\.com|buy\.stripe|checkout\.stripe/i);
    assert.doesNotMatch(html, /\b\d{11}\b|DPO:|PEC:|Via [A-Z]/);
    assert.doesNotMatch(html, /\b(?:30|60|90|365) giorni|\b(?:2|5|10) anni/);
  }
});

test('privacy covers the whole ecosystem, real permissions and unknown retention', async () => {
  const html = await read('privacy/index.html');
  for (const text of ['Desktop Trainer', 'App iOS Trainer', 'IOS_Client', 'Supabase Auth', 'Supabase PostgreSQL', 'Supabase Storage', 'Supabase Edge Functions', 'Stripe', 'HealthKit', 'posizione', 'locali', 'Periodo da definire prima della pubblicazione definitiva', 'minori', 'trasferimenti', 'Basi giuridiche', 'ancora in lavorazione']) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /100% sicur|GDPR certified|military grade/i);
  assert.match(html, /salvare sul backend il risultato completo, incluso il percorso/);
});

test('support covers login, association, account/deletion, sync, technical and privacy', async () => {
  const html = await read('support/index.html');
  for (const id of ['accesso', 'associazione', 'account', 'sincronizzazione', 'tecnico', 'privacy', 'contatto']) assert.ok(html.includes(`id="${id}"`), id);
  assert.match(html, /ancora in lavorazione/);
  assert.match(html, /privacy\//);
  assert.match(html, /password, codici monouso o token/);
});

test('all five pages provide navigable Privacy and Support footer links', async () => {
  for (const page of pages) {
    const html = await read(page);
    const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer, page);
    const targets = [...footer.matchAll(/href="([^"]+)"/g)].map(match => localTarget(page, match[1]));
    assert.ok(targets.includes('privacy/index.html'), page);
    assert.ok(targets.includes('support/index.html'), page);
  }
});

test('nested relative assets work under a GitHub Pages project prefix', async () => {
  const base = new URL('https://preview.invalid/project/'); // Test fixture, never shipped.
  for (const page of draftPages) {
    const html = await read(page);
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const path = localTarget(page, match[1]);
      if (!path) continue;
      const target = new URL(match[1], new URL(page, base));
      assert.ok(target.pathname.startsWith('/project/'), match[1]);
      assert.ok(pages.includes(path) || isPublicAsset(path), path);
    }
  }
});

test('public URL resolution rejects traversal, private content and unexpected extensions', () => {
  for (const path of ['../../.env', '/CODEX_HANDOFF.md', '..\\..\\secret', '%2e%2e/%2e%2e/secret']) assert.throws(() => localTarget('privacy/index.html', path), path);
  for (const path of ['assets/screenshots/README.md', 'assets/js/config.json', 'img/logo.png', 'scripts/public-files.mjs', '.env']) assert.equal(isPublicAsset(path), false, path);
  assert.equal(localTarget('privacy/index.html', '../support/'), 'support/index.html');
});

test('generated package is exactly the public allowlist, with byte-identical drafts', async () => {
  const expected = await publicFiles(root);
  async function walk(dir, prefix = '') {
    const paths = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      assert.equal(entry.isSymbolicLink(), false);
      const name = prefix + entry.name;
      if (entry.isDirectory()) paths.push(...await walk(join(dir, entry.name), name + '/'));
      else paths.push(name);
    }
    return paths;
  }
  const actual = await walk(join(root, 'dist'));
  assert.deepEqual(actual.sort(), [...expected].sort());
  for (const page of draftPages) assert.equal(await read(`dist/${page}`), await read(page));
});

test('standalone Render config publishes only dist and cannot trigger app releases', async () => {
  const config = await read('render.yaml');
  assert.match(config, /runtime: static/);
  assert.match(config, /staticPublishPath: \.\/dist/);
  assert.match(config, /node scripts\/prepare-public\.mjs/);
  assert.match(config, /autoDeployTrigger: off/);
  assert.match(config, /source: \/privacy\s+destination: \/privacy\//);
  assert.match(config, /source: \/support\s+destination: \/support\//);
  assert.doesNotMatch(config, /startCommand|desktop-v|supabase|source: \/\*/);
});

test('draft status and palette remain accessible and do not depend on JavaScript', async () => {
  const css = await read('assets/css/legal.css');
  assert.match(css, /min-height: 44px/);
  assert.doesNotMatch(css, /opacity: 0\b|display: none|overflow: hidden/);
  function luminance(hex) {
    const values = hex.match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  }
  const a = luminance('513a13'), b = luminance('fff6e4');
  assert.ok((b + .05) / (a + .05) >= 4.5);
});
