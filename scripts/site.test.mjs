import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const downloadSource = await readFile(join(root, 'assets/js/download.js'), 'utf8');
const stable = (version) => ({ tag_name: 'desktop-v' + version, draft: false, prerelease: false, published_at: '2026-10-19', assets: [{ name: `GymManager_${version}_x64-setup.exe`, browser_download_url: `https://github.com/Pauz121/GymManager_relase/releases/download/desktop-v${version}/setup.exe` }] });
function domNode() {
  return { textContent: '—', hidden: true, attrs: { 'aria-disabled': 'true' }, setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; }, querySelector() { return this.link || null; } };
}
async function browserMock(response, { home = false } = {}) {
  const nodes = Object.fromEntries(['release-version', 'release-date', 'release-asset', 'download-link', 'release-status', 'release-fallback'].map(k => [k, domNode()]));
  nodes['release-fallback'].link = {};
  let calls = 0;
  const document = {
    querySelector(selector) { return selector.includes('release-version') || !home ? nodes['release-version'] : null; },
    querySelectorAll(selector) { return home && selector === '[data-download-link]' ? [] : [nodes[selector.slice(6, -1)]]; },
  };
  const context = vm.createContext({ document, AbortController, setTimeout, clearTimeout, Intl, fetch: async () => { calls++; return response; } });
  vm.runInContext(downloadSource, context);
  await new Promise(resolve => setImmediate(resolve));
  return { nodes, calls };
}

test('release UI updates version and direct installer without HTML changes', async () => {
  for (const version of ['1.0.9', '1.0.10']) {
    const { nodes, calls } = await browserMock({ ok: true, json: async () => stable(version) });
    assert.equal(calls, 1);
    assert.equal(nodes['release-version'].textContent, version);
    assert.ok(nodes['download-link'].href.includes(`/desktop-v${version}/`));
    assert.equal(nodes['download-link'].attrs['aria-disabled'], undefined);
  }
});
test('Home also fetches its version even without a direct download button', async () => {
  const { nodes, calls } = await browserMock({ ok: true, json: async () => stable('1.0.10') }, { home: true });
  assert.equal(calls, 1);
  assert.equal(nodes['release-version'].textContent, '1.0.10');
});
test('API error disables download, clears stale version and exposes safe fallback', async () => {
  const { nodes } = await browserMock({ ok: false, status: 403 });
  assert.equal(nodes['download-link'].attrs['aria-disabled'], 'true');
  assert.equal(nodes['download-link'].href, undefined);
  assert.equal(nodes['release-version'].textContent, 'da verificare');
  assert.equal(nodes['release-fallback'].hidden, false);
  assert.equal(nodes['release-fallback'].link.href, 'https://github.com/Pauz121/GymManager_relase/releases/latest');
});
test('draft, prerelease and metadata-only releases cannot enable the download', async () => {
  for (const data of [{ ...stable('2.0.0'), draft: true }, { ...stable('2.0.0'), prerelease: true }, { ...stable('2.0.0'), assets: [{ name: 'latest.json', browser_download_url: 'https://example.test/latest.json' }] }]) {
    const { nodes } = await browserMock({ ok: true, json: async () => data });
    assert.equal(nodes['download-link'].attrs['aria-disabled'], 'true');
    assert.equal(nodes['release-fallback'].hidden, false);
  }
});
test('all three curated clips are silent H264, short, fast-start and lightweight', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'assets/media-manifest.json'), 'utf8'));
  assert.equal(manifest.images.length, 10);
  assert.equal(manifest.clips.length, 3);
  let total = 0;
  for (const clip of manifest.clips) {
    const path = join(root, `assets/videos/${clip.name}.mp4`);
    const probe = spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', path], { encoding: 'utf8' });
    assert.equal(probe.status, 0, probe.stderr);
    const data = JSON.parse(probe.stdout);
    assert.equal(data.streams.length, 1);
    assert.equal(data.streams[0].codec_name, 'h264');
    assert.equal(data.streams[0].codec_type, 'video');
    assert.ok(Math.abs(Number(data.format.duration) - clip.duration) < .1);
    const bytes = await readFile(path);
    assert.ok(bytes.indexOf(Buffer.from('moov')) < bytes.indexOf(Buffer.from('mdat')));
    total += bytes.length;
  }
  assert.ok(total < 4_000_000, `Video total too large: ${total}`);
});
test('public package excludes all originals, QA, scripts, reports and handoff', async () => {
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { assert.ok(!/^(img|\.qa|scripts)$/.test(entry.name)); await walk(path); }
      else {
        assert.ok(!/\.md$|\.jfif$/i.test(entry.name));
        // The full 89s Trainer overview has its own reviewed 5MB budget; old clips retain 4MB.
        const budget = entry.name === 'ios-trainer-overview-web.mp4' ? 5_000_000 : 4_000_000;
        assert.ok((await stat(path)).size < budget);
      }
    }
  }
  await walk(join(root, 'dist'));
});

test('essential light/dark text and button palette meets 4.5:1 contrast', () => {
  function luminance(hex) {
    const rgb = hex.match(/\w\w/g).map(value => parseInt(value, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  }
  for (const [foreground, background] of [['5d5d65', 'f7f5f2'], ['ae1f31', 'f7f5f2'], ['ffffff', 'd9293f'], ['ff9daa', '18181b'], ['d7d7de', '18181b'], ['c7c7cf', '252529'], ['9999a3', '121214']]) {
    const a = luminance(foreground), b = luminance(background);
    assert.ok((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5, `${foreground} on ${background}`);
  }
});
