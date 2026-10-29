import assert from 'node:assert/strict';
import { canonicalPages } from './site-pages.mjs';
const base = `http://127.0.0.1:${Number(process.env.GYMMANAGER_SITE_PORT || 8765)}`;
for (const path of ['/', '/funzionalita.html', '/download.html', '/privacy/', '/support/', '/privacy/index.html', '/support/index.html', '/assets/css/legal.css', '/assets/css/desktop.css', '/assets/screenshots/05-body-focus.webp']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  await response.arrayBuffer();
}
for (const route of canonicalPages) {
  const path=route==='index.html' ? '/' : '/' + route.replace(/index.html$/,'');
  for(const url of [path,path + (path==='/' ? 'index.html' : 'index.html')]) {
    const response=await fetch(base+url);
    assert.equal(response.status,200,url);
    const html=await response.text();
    assert.doesNotMatch(html,/http-equiv="refresh"/);
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
  }
  if(path!=='/') {
    const bare=path.slice(0,-1);
    const redirect=await fetch(base+bare,{redirect:'manual'});
    assert.equal(redirect.status,308,bare); assert.equal(redirect.headers.get('location'),path);
    assert.equal((await fetch(base+bare)).status,200);
  }
}
const video = base + '/assets/screenshots/04-workout-plan.webp';
const full = await fetch(video, { method: 'HEAD' });
assert.equal(full.status, 200);
assert.equal(full.headers.get('content-type'), 'image/webp');
const size = Number(full.headers.get('content-length'));
for (const [range, expectedLength] of [['bytes=0-99', 100], ['bytes=100-', size - 100], ['bytes=-50', 50]]) {
  const response = await fetch(video, { headers: { Range: range } });
  assert.equal(response.status, 206);
  assert.equal((await response.arrayBuffer()).byteLength, expectedLength);
  assert.ok(response.headers.get('content-range').endsWith('/' + size));
}
for (const range of ['bytes=999999999-', 'bytes=20-10', 'bytes=0-1,5-6', 'bytes=-0']) assert.equal((await fetch(video, { headers: { Range: range } })).status, 416);
for (const path of ['/CODEX_HANDOFF.md', '/PRODUCT.md', '/content/desktop-features.mjs', '/.impeccable/surfaces/index-html.md', '/img/Prima%20registrazione.mp4', '/assets/source/Video%20app%20IOS_Trainer.mp4', '/render.yaml', '/.qa/client.png', '/scripts/serve-site.mjs', '/assets/screenshots/README.md', '/privacy/CODEX_HANDOFF.md', '/privacy/.env', '/assets/js/config.json', '/missing.html', '/desktop/unknown/', '/assets/videos/workout-analysis.mp4', '/assets/videos/client-progress.mp4', '/assets/videos/nutrition-plan.mp4']) assert.equal((await fetch(base + path)).status, 404, path);
for (const screen of ['home', 'calendar', 'clients', 'workout', 'agenda']) {
  const response = await fetch(base + '/assets/screenshots/ios-trainer-' + screen + '.webp');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/webp');
}
for (const [path, type] of [['gymmanager-logo.webp', 'image/webp'], ['favicon.png', 'image/png']]) {
  const response = await fetch(base + '/assets/brand/' + path);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), type);
}
// Run against --public: unused historical media must not enter the output.
assert.equal((await fetch(base + '/assets/videos/ios-trainer-overview-web.mp4')).status, 404);
assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
for (const slug of ['dashboard', 'clienti', 'allenamenti', 'agenda', 'schede-allenamento', 'alimentazione', 'progressi', 'pagamenti']) {
  const response = await fetch(base + '/desktop/' + slug + '/');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('http-equiv="refresh"'));
  assert.ok(html.includes('../#desktop-' + slug));
  assert.equal((await fetch(base + '/desktop/' + slug, { redirect: 'manual' })).status, 308);
  assert.equal((await fetch(base + '/desktop/' + slug + '/index.html')).status, 200);
}
const index = await (await fetch(base + '/')).text();
for (const id of ['desktop','ios-trainer','come-funziona','ecosistema']) assert.ok(index.includes('id="' + id + '"'));
assert.doesNotMatch(index,/id="ios-client"|href="app-client\//);
for (const path of ['/app-client', '/app-client/', '/app-client/index.html', '/assets/brand/client-logo.webp', '/wrangler.jsonc']) assert.equal((await fetch(base + path)).status,404,path);
assert.equal((index.match(/<h1\b/g) || []).length,1);
console.log('HTTP PASS: six public routes with direct bare/slash/index access, ten aliases, Client disabled, assets/ranges and private 404.');
