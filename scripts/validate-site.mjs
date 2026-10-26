import { readFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pages, localTarget, isPublicAsset } from './public-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1], match[2] ?? match[3]]));
}

const pageText = new Map();
for (const page of pages) {
  const html = await readFile(join(root, page), 'utf8');
  pageText.set(page, html);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert(new Set(ids).size === ids.length, `${page}: ID duplicati`);
  assert((html.match(/<h1\b/g) ?? []).length === 1, `${page}: serve un solo titolo principale`);
  assert(/^<!doctype html>/i.test(html.trimStart()), `${page}: doctype mancante`);
  assert(/<html lang="it">/i.test(html), `${page}: lingua italiana mancante`);
  assert(/<meta name="viewport"/i.test(html), `${page}: viewport mancante`);
  assert(/<title>[^<]+<\/title>/i.test(html), `${page}: title mancante`);
  assert(/<meta name="description"/i.test(html), `${page}: description mancante`);
  assert(/<main id="contenuto">/i.test(html), `${page}: main semantico mancante`);
  assert(/<nav[^>]+aria-label=/i.test(html), `${page}: nav senza nome accessibile`);
  assert(!/<meta[^>]+name="(generator|google-site-verification)"/i.test(html), `${page}: metadata non autorizzato`);
  assert(!/(google-analytics|googletagmanager|facebook\.net|meta-pixel)/i.test(html), `${page}: tracking rilevato`);
  const legalPage = page === 'privacy/index.html' || page === 'support/index.html';
  // Factual provider disclosure on a legal draft is not a purchase integration.
  assert(!/(checkout|prova gratuita|abbonamento mensile)/i.test(html), `${page}: contenuto commerciale non consentito`);
  if (!legalPage) assert(!/stripe/i.test(html), `${page}: contenuto commerciale non consentito`);
  assert(!/(?:src|href)="[^"\s]*(?:stripe\.com|buy\.stripe|checkout)/i.test(html), `${page}: pagamento esterno non consentito`);
  assert(!/SCREENSHOT REQUIRED|screenshot-placeholder/.test(html), `${page}: placeholder ancora presente`);
  assert(!/0\.1\.8/.test(html), `${page}: versione obsoleta hardcoded`);
  assert(!/(?:src|poster|href)="img\//.test(html), `${page}: originale non ottimizzato referenziato`);

  for (const imageTag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const attrs = attributes(imageTag);
    assert(Boolean(attrs.alt), `${page}: immagine senza alt`);
    if (attrs.src && !attrs.src.startsWith('http')) {
      try { await access(join(root, localTarget(page, attrs.src))); }
      catch { assert(false, `${page}: asset immagine mancante ${attrs.src}`); }
    }
  }

  for (const tag of html.match(/<(?:source|track|script|video)\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    for (const path of [attrs.src, attrs.poster].filter(Boolean)) {
      const target = localTarget(page, path);
      assert(target && isPublicAsset(target), `${page}: media/script esterno non previsto ${path}`);
      try { await access(join(root, target)); } catch { assert(false, `${page}: media/script mancante ${path}`); }
    }
    if (tag.startsWith('<video')) {
      assert(/\scontrols(?:\s|>)/.test(tag) && /\splaysinline(?:\s|>)/.test(tag), `${page}: video senza controlli nativi/playsinline`);
      assert(attrs.preload === 'none' && !/\sautoplay/.test(tag), `${page}: video caricato o avviato automaticamente`);
      assert(Boolean(attrs['aria-label']) && Boolean(attrs.poster), `${page}: video senza nome/poster`);
    }
  }

  for (const href of [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])) {
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const [target] = href.split('#');
    if (!target) continue;
    try { await access(join(root, localTarget(page, target))); }
    catch { assert(false, `${page}: link interno non trovato ${target}`); }
  }
}

for (const [page, html] of pageText) {
  for (const href of [...html.matchAll(/href="([^"]*#[^"]+)"/g)].map((match) => match[1])) {
    const [targetPage, id] = href.split('#');
    const targetHtml = targetPage ? pageText.get(localTarget(page, targetPage)) : html;
    if (targetHtml) assert(targetHtml.includes(`id="${id}"`), `${page}: ancora non trovata ${href}`);
  }
}

await import(pathToFileURL(join(root, 'assets/js/download.js')).href);
const release = globalThis.GymManagerRelease;
assert(Boolean(release), 'download.js: API pubblica non esposta per il test');
if (release) {
  const parsed = release.parseStableRelease({
    tag_name: 'desktop-v1.0.9', draft: false, prerelease: false, published_at: '2026-09-11T18:46:00Z', html_url: 'https://example.test/release',
    assets: [
      { name: 'latest.json', browser_download_url: 'https://example.test/latest.json' },
      { name: 'GymManager_1.0.9_x64-setup.exe.sig', browser_download_url: 'https://example.test/setup.sig' },
      { name: 'GymManager_1.0.9_x64_en-US.msi', browser_download_url: 'https://example.test/setup.msi' },
      { name: 'GymManager_1.0.9_x64-setup.exe', browser_download_url: 'https://example.test/setup.exe' }
    ]
  });
  assert(parsed.version === '1.0.9', 'download.js: normalizzazione versione errata');
  assert(parsed.downloadUrl.endsWith('setup.exe'), 'download.js: installer principale errato');
  try {
    release.parseStableRelease({ tag_name: 'desktop-v2.0.0-beta', draft: false, prerelease: true, assets: [] });
    assert(false, 'download.js: prerelease non rifiutata');
  } catch { /* comportamento atteso */ }
}

if (failures.length) {
  console.error(`VALIDATION FAILED (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`VALIDATION PASSED: ${pages.length} pagine, link/metadata/accessibilità di base e strategia release verificate.`);
