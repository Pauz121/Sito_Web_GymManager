import { posix } from 'node:path';
import { escapeHtml as e } from './desktop-render.mjs';
import { siteFeatures } from './site-config.mjs';

// One tree, one build and one shared layout. Native documents, not a second SPA.
export const allRoutes = [
  { key: 'home', path: 'index.html', label: 'Home', title: 'GymManager — Gestionale per Personal Trainer', description: 'Il lavoro quotidiano del Trainer, organizzato in un unico ecosistema professionale.', styles: ['desktop', 'home-story'], scripts: ['app-showcase', 'home-story', 'download'] },
  { key: 'desktop', path: 'desktop/index.html', label: 'Desktop', title: 'Gestionale Desktop — GymManager', description: 'Scopri le aree del gestionale GymManager per Windows, con schermate reali e flussi di lavoro concreti.', styles: ['desktop'] },
  { key: 'trainer', path: 'app-trainer/index.html', label: 'App Trainer', title: 'App iOS Trainer — GymManager', description: 'Clienti, calendario, schede e agenda nella companion iOS Trainer.', scripts: ['app-showcase'] },
  { key: 'client', path: 'app-client/index.html', label: 'App Client', title: 'App iOS Client — GymManager', description: 'Il ruolo del Cliente nell’ecosistema GymManager. Presentazione in preparazione, senza disponibilità pubblica promessa.' },
  { key: 'download', path: 'download/index.html', label: 'Scarica', title: 'Scarica GymManager', description: 'Ultima release stabile Desktop Windows e guida di installazione.', scripts: ['download'] },
  { key: 'privacy', path: 'privacy/index.html', label: 'Privacy', title: 'Privacy Policy — GymManager', description: 'Privacy Policy per l’intero ecosistema GymManager.', styles: ['legal'], legal: true },
  { key: 'support', path: 'support/index.html', label: 'Supporto', title: 'Supporto — GymManager', description: 'Assistenza per accesso, account, privacy, sincronizzazione e problemi tecnici.', styles: ['legal'], legal: true }
];
export const routes = allRoutes.filter(route => route.key !== 'client' || siteFeatures.clientMarketing);
export function relativeUrl(page, target) {
  const [path, hash] = target.split('#');
  const directory = path === 'index.html' ? '.' : path.endsWith('/index.html') ? posix.dirname(path) : null;
  let href = posix.relative(posix.dirname(page), directory ?? path) || '.';
  if (directory !== null) href += '/';
  return href + (hash ? '#' + hash : '');
}
const brand = page => `<a class="brand" href="${relativeUrl(page, 'index.html')}" aria-label="GymManager, Home"><img class="brand-logo" src="${relativeUrl(page, 'assets/brand/gymmanager-logo.webp')}" alt="Logo GymManager" width="48" height="48"><span>GYMMANAGER</span></a>`;
export function renderHeader(route) {
  return `<header class="site-header"><nav class="nav container" aria-label="Navigazione principale">${brand(route.path)}<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Apri il menu"><span></span></button><div class="nav-links" id="nav-links">${routes.filter(item => !item.legal).map(item => `<a${item.key === 'download' ? ' class="button button--primary"' : ''} href="${relativeUrl(route.path,item.path)}"${item.key === route.key ? ' aria-current="page"' : ''}>${e(item.label)}</a>`).join('')}</div></nav></header>`;
}
export function renderFooter(route) {
  return `<footer class="site-footer"><div class="footer-grid container"><div class="footer-brand">${brand(route.path)}<p>Gestionale Desktop e ecosistema applicativo per Personal Trainer.</p></div><nav class="footer-links" aria-label="Navigazione footer">${routes.map(item => `<a href="${relativeUrl(route.path,item.path)}"${item.key === route.key ? ' aria-current="page"' : ''}>${e(item.label)}</a>`).join('')}</nav></div><div class="footer-bottom container"><span>© <span data-year></span> GymManager</span><span>Software gestionale per professionisti del fitness.</span></div></footer>`;
}
export function renderLayout(route, main) {
  const asset = target => relativeUrl(route.path, 'assets/' + target);
  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(route.title)}</title>
  <meta name="description" content="${e(route.description)}">
  <meta property="og:title" content="${e(route.title)}">
  <meta property="og:description" content="${e(route.description)}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#18181b">
  <link rel="icon" href="${asset('brand/favicon.png')}" type="image/png">
  ${['styles', ...(route.styles || [])].map(name => `<link rel="stylesheet" href="${asset('css/' + name + '.css')}">`).join('\n  ')}
  ${['site', ...(route.scripts || [])].map(name => `<script defer src="${asset('js/' + name + '.js')}"></script>`).join('\n  ')}
</head>
<body class="${route.legal ? 'legal-page' : 'route-' + route.key}" id="top">
  <a class="skip-link" href="#contenuto">Vai al contenuto</a>
  ${renderHeader(route)}
  <main id="contenuto">${main}</main>
  ${renderFooter(route)}
</body>
</html>
`;
}
