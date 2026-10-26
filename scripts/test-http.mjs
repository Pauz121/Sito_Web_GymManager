import assert from 'node:assert/strict';
const base = `http://127.0.0.1:${Number(process.env.GYMMANAGER_SITE_PORT || 8765)}`;
for (const path of ['/', '/funzionalita.html', '/download.html', '/privacy/', '/support/', '/privacy/index.html', '/support/index.html', '/assets/css/legal.css', '/assets/screenshots/05-body-focus.webp', '/assets/videos/workout-analysis.it.vtt']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  await response.arrayBuffer();
}
for (const path of ['/privacy', '/support']) {
  const redirect = await fetch(base + path, { redirect: 'manual' });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('location'), path + '/');
  const page = await fetch(base + path);
  assert.equal(page.status, 200);
  assert.ok((await page.text()).includes('Bozza — sito ancora privo di dominio ufficiale definitivo'));
}
const video = base + '/assets/videos/workout-analysis.mp4';
const full = await fetch(video, { method: 'HEAD' });
assert.equal(full.status, 200);
assert.equal(full.headers.get('content-type'), 'video/mp4');
const size = Number(full.headers.get('content-length'));
for (const [range, expectedLength] of [['bytes=0-99', 100], ['bytes=100-', size - 100], ['bytes=-50', 50]]) {
  const response = await fetch(video, { headers: { Range: range } });
  assert.equal(response.status, 206);
  assert.equal((await response.arrayBuffer()).byteLength, expectedLength);
  assert.ok(response.headers.get('content-range').endsWith('/' + size));
}
for (const range of ['bytes=999999999-', 'bytes=20-10', 'bytes=0-1,5-6', 'bytes=-0']) assert.equal((await fetch(video, { headers: { Range: range } })).status, 416);
for (const path of ['/CODEX_HANDOFF.md', '/img/Prima%20registrazione.mp4', '/assets/source/Video%20app%20IOS_Trainer.mp4', '/render.yaml', '/.qa/client.png', '/scripts/serve-site.mjs', '/assets/screenshots/README.md', '/privacy/CODEX_HANDOFF.md', '/privacy/.env', '/assets/js/config.json', '/missing.html']) assert.equal((await fetch(base + path)).status, 404, path);
const overview = base + '/assets/videos/ios-trainer-overview-web.mp4';
const overviewHead = await fetch(overview, { method: 'HEAD' });
assert.equal(overviewHead.status, 200);
assert.equal(overviewHead.headers.get('content-type'), 'video/mp4');
assert.equal((await fetch(overview, { headers: { Range: 'bytes=1000-1999' } })).status, 206);
const poster = await fetch(base + '/assets/screenshots/ios-trainer-poster.webp');
assert.equal(poster.status, 200);
assert.equal(poster.headers.get('content-type'), 'image/webp');
assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
console.log('HTTP PASS: pages, screenshots, captions, MP4 MIME, HEAD, 206 seek ranges, 416 invalid ranges and private-file exclusion.');
