import { readFile } from 'node:fs/promises';
import { join, posix } from 'node:path';
import { desktopFeatures } from '../content/desktop-features.mjs';
import { escapeHtml, renderDesktopOverview } from './desktop-render.mjs';
import { routes, relativeUrl, renderLayout } from './site-layout.mjs';
import { renderHomeDesktopStory, renderHomeClient, renderHomeEcosystem } from './home-render.mjs';
import { siteFeatures } from './site-config.mjs';

export { routes };
if (desktopFeatures.some(feature => !/^[a-z0-9-]+$/.test(feature.slug)) || new Set(desktopFeatures.map(feature => feature.slug)).size !== desktopFeatures.length) throw new Error('Unsafe or duplicate Desktop slug');
export const sourcePages = ['index.html', 'funzionalita.html', 'download.html', 'privacy/index.html', 'support/index.html'];
export const canonicalPages = routes.map(route => route.path);
export const legacyTargets = new Map([
  ['funzionalita.html', 'desktop/index.html'], ['download.html', 'download/index.html'],
  ...desktopFeatures.map(feature => [`desktop/${feature.slug}/index.html`, `desktop/index.html#desktop-${feature.slug}`])
]);
export const pages = [...canonicalPages, ...legacyTargets.keys()];
export const mainOf = source => {
  const main = source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  if (!main) throw new Error('Source document main content missing');
  return main;
};
// Rebase media and route links once. Inner fragment links retain their page-local IDs.
function rebase(html, sourcePage, outputPage) {
  return html.replace(/(href|src|poster)="([^"]+)"/g, (attribute, name, value) => {
    if (/^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(value)) return attribute;
    const [path, hash] = value.split('#');
    const resolved = posix.normalize(posix.join(posix.dirname(sourcePage), path)) + (path.endsWith('/') ? 'index.html' : '');
    let target = legacyTargets.get(resolved) || resolved;
    if (resolved === 'index.html' && hash === 'desktop') target = 'desktop/index.html';
    else if (resolved === 'funzionalita.html' && hash) target += '#feature-' + hash;
    else if (hash) target += '#' + hash;
    return `${name}="${relativeUrl(outputPage,target)}"`;
  });
}
function namespace(html, prefix, headingOffset) {
  return html.replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}-${id}"`)
    .replace(/href="#([^"]+)"/g, (_, id) => `href="#${prefix}-${id}"`)
    .replace(/aria-labelledby="([^"]+)"/g, (_, ids) => `aria-labelledby="${ids.split(' ').map(id => prefix + '-' + id).join(' ')}"`)
    .replace(/<(\/?)(h[1-6])\b/g, (_, close, tag) => `<${close}h${Math.min(6, Number(tag.slice(1)) + headingOffset)}`);
}
function featureExtras(source) {
  const groups = { clienti: ['clienti', 'questionari'], agenda: ['organizzazione'], 'schede-allenamento': ['allenamento', 'body-focus', 'modelli', 'progressioni'], alimentazione: ['nutrizione'], progressi: ['progressi'], pagamenti: ['pagamenti'] };
  const sections = new Map([...mainOf(source).matchAll(/<section\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)].map(match => [match[1], match[2]]));
  return Object.fromEntries(Object.entries(groups).map(([slug, keys]) => {
    const feature = desktopFeatures.find(item => item.slug === slug);
    const seen = new Set([feature.heroImage?.src, ...feature.screenshots.map(image => image.src)]);
    return [slug, keys.map(key => {
      let html = sections.get(key);
      if (!html) throw new Error('Feature source section missing: ' + key);
      html = html.replace(/<a\b[^>]*href="desktop\/[^\"]+"[^>]*>[\s\S]*?<\/a>/g, '');
      const figures = [];
      html = html.replace(/<figure\b[\s\S]*?<\/figure>/g, figure => {
        const src = figure.match(/src="([^"]+)"/)?.[1];
        if (!seen.has(src)) { figures.push(figure); seen.add(src); }
        return '';
      });
      html = html.replace(/class="[^"]*\bsplit(?:--reverse)?\b[^"]*"/g, 'class="desktop-extra-copy"');
      return `<section class="desktop-extra" id="feature-${key}">${namespace(html, `extra-${key}`, 3)}${figures.join('')}</section>`;
    }).join('')];
  }));
}

function redirectPage(path, target) {
  const href = relativeUrl(path,target);
  return `<!doctype html>\n<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pagina spostata — GymManager</title><meta name="description" content="Continua nella pagina GymManager richiesta."><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0;url=${escapeHtml(href)}"></head><body><main id="contenuto"><h1>La pagina è stata riordinata</h1><p><a href="${escapeHtml(href)}">Continua nella pagina richiesta</a></p></main></body></html>\n`;
}
function trainerPage(trainer) {
  return `<section class="section section--compact"><div class="container section-heading"><h1>GymManager Trainer per iPhone.</h1><p>La companion del professionista: il contesto del gestionale anche quando non sei davanti al computer.</p></div></section>${trainer.replace('href="#ecosistema"', 'href="index.html#ecosistema"')}`;
}
function clientPage() {
  return `<section class="section"><div class="container section-heading"><h1>GymManager Client.<br>Il percorso, dalla parte del cliente.</h1><p>Un’app nativa separata dall’app Trainer, dedicata al cliente e alla consultazione del proprio percorso.</p><p class="status">Presentazione in preparazione</p></div><div class="container client-preview__layout"><div><h2>Due ruoli, un ecosistema.</h2><p>Il Desktop è il centro operativo del professionista. L’esperienza Client ha un ruolo distinto e non sostituisce gli strumenti del Trainer.</p><a class="text-link" href="index.html#ecosistema">Scopri l’ecosistema GymManager</a></div><div class="client-preview__status"><h2>Solo immagini reali.</h2><p>Le schermate e gli approfondimenti verranno integrati dopo la verifica dei materiali reali dell’app Client. Nessuna interfaccia simulata e nessuna data di rilascio pubblico promessa.</p></div></div></section>`;
}
export async function renderSitePages(root) {
  const sources = new Map(await Promise.all(sourcePages.map(async path => [path, await readFile(join(root,path),'utf8')])));
  let home = mainOf(sources.get('index.html'));
  if (home.split('<!-- DESKTOP_PREVIEW -->').length !== 2) throw new Error('One Desktop preview marker required');
  home = home.replace('<!-- DESKTOP_PREVIEW -->', renderHomeDesktopStory());
  home = home.replace('<!-- CLIENT_PREVIEW -->', siteFeatures.clientMarketing ? renderHomeClient() : '');
  home = home.replace('<!-- ECOSYSTEM_STORY -->', renderHomeEcosystem());
  const trainer = home.match(/<section[^>]+id="ios-trainer"[\s\S]*?<\/section>/)?.[0];
  if (!trainer) throw new Error('Existing Trainer section missing');
  const content = new Map([
    ['home', home],
    ['desktop', `<header class="section section--compact"><div class="container section-heading"><h1>GymManager Desktop, nel lavoro di ogni giorno.</h1><p>Esplora il gestionale Windows, area per area. Schermate reali con dati DEMO e spiegazioni pratiche, senza un manuale tecnico.</p></div></header>${renderDesktopOverview(featureExtras(sources.get('funzionalita.html')))}`],
    ['trainer', trainerPage(trainer)],
    ['client', clientPage()],
    ['download', mainOf(sources.get('download.html'))],
    ['privacy', mainOf(sources.get('privacy/index.html'))],
    ['support', mainOf(sources.get('support/index.html'))]
  ]);
  const original = { home: 'index.html', desktop: 'index.html', trainer: 'index.html', client: 'index.html', download: 'download.html', privacy: 'privacy/index.html', support: 'support/index.html' };
  const documents = new Map(routes.map(route => [route.path,renderLayout(route,rebase(content.get(route.key),original[route.key],route.path))]));
  for (const [path,target] of legacyTargets) documents.set(path,redirectPage(path,target));
  return documents;
}
