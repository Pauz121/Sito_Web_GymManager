import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { allRoutes, routes } from './site-layout.mjs';
import { siteFeatures } from './site-config.mjs';
import { renderSitePages, publicFiles } from './public-files.mjs';
import { renderHomeClient, renderHomeEcosystem } from './home-render.mjs';
const root = resolve(import.meta.dirname, '..');
const documents = await renderSitePages(root);

test('Client marketing is disabled at build time, not merely hidden with CSS', async () => {
  assert.equal(siteFeatures.clientMarketing, false);
  assert.ok(allRoutes.some(route => route.key === 'client'));
  assert.ok(!routes.some(route => route.key === 'client'));
  assert.ok(!documents.has('app-client/index.html'));
  const files = await publicFiles(root, documents);
  assert.ok(!files.has('assets/brand/client-logo.webp'));
  for (const [path, html] of documents) {
    assert.doesNotMatch(html, /href="[^"]*app-client|id="ios-client"|client-logo\.webp/, path);
    const header = html.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0];
    const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0];
    for (const chrome of [header, footer].filter(Boolean)) assert.doesNotMatch(chrome, /App Client|bozza|draft/i);
  }
});

test('Client source remains recoverable through the single presentation flag', () => {
  assert.match(renderHomeClient(), /id="ios-client"/);
  assert.match(renderHomeEcosystem({ includeClient: true }), /Client iOS/);
  assert.doesNotMatch(renderHomeEcosystem(), /Client iOS|client-logo/);
});

test('public legal metadata, body and cross-links have no provisional presentation', () => {
  for (const key of ['privacy','support']) {
    const html = documents.get(key + '/index.html');
    assert.doesNotMatch(html, /bozza|draft|placeholder|pagina temporanea|ambiente temporaneo|dominio ufficiale|versione definitiva/i);
    assert.match(html, /class="legal-page"/);
    assert.match(html, /Paolino Bottiglieri/);
    assert.match(html, /mailto:Paolinob2@libero.it/);
    assert.match(html, /datetime="2026-10-29"/);
  }
});

test('Cloudflare uses the existing Worker and established build with a dist-only asset boundary', async () => {
  const config = JSON.parse(await readFile(resolve(root, 'wrangler.jsonc'), 'utf8'));
  assert.equal(config.name, 'gym-manager');
  assert.equal(config.assets.directory, './dist');
  assert.equal(config.assets.html_handling, 'auto-trailing-slash');
  assert.equal(config.assets.not_found_handling, 'none');
  assert.equal(config.build.command, 'node scripts/validate-site.mjs && node scripts/prepare-public.mjs');
  for (const key of ['account_id','routes','vars','secrets','d1_databases','r2_buckets']) assert.equal(config[key], undefined);
});
