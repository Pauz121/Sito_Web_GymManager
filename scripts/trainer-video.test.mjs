import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles, isPublicAsset } from './public-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(join(root, file), 'utf8');
const manifest = JSON.parse(await read('assets/trainer-video-manifest.json'));
const html = await read('index.html');
const section = html.match(/<section[^>]+id="ios-trainer"[\s\S]*?<\/section>/)?.[0];
const video = section?.match(/<video\b[^>]*>/)?.[0];

test('overview follows real features, precedes workflow and is explicitly Trainer, not Client', () => {
  assert.ok(section);
  assert.ok(html.indexOf('class="feature-grid"') < html.indexOf('id="ios-trainer"'));
  assert.ok(html.indexOf('id="ios-trainer"') < html.indexOf('id="come-funziona"'));
  assert.match(section, /iOS Trainer/);
  assert.match(section, /Non è l’app iOS Client/);
  assert.match(section, /profili sintetici DEMO/);
});
test('native video has controlled playback, fixed portrait geometry, poster and equivalent text', () => {
  for (const value of [' controls ', ' playsinline ', 'preload="none"', 'width="384"', 'height="832"', 'aria-describedby="trainer-overview-description"']) assert.ok(video.includes(value), value);
  assert.doesNotMatch(video, /\sautoplay|\sloop/);
  assert.match(video, /poster="assets\/screenshots\/ios-trainer-poster.webp"/);
  assert.match(section, /<details[\s\S]*La panoramica, anche senza video/);
  assert.match(section, /data-video-restart aria-controls="ios-trainer-video"/);
});
test('overview is H264 yuv420p 30fps portrait, no audio, full length and fast-start under5MB', async () => {
  const path = join(root, manifest.webVideo);
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', path], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.streams.length, 1);
  const stream = data.streams[0];
  assert.equal(stream.codec_type, 'video');
  assert.equal(stream.codec_name, 'h264');
  assert.equal(stream.pix_fmt, 'yuv420p');
  assert.equal(stream.width, 384);
  assert.equal(stream.height, 832);
  assert.equal(stream.avg_frame_rate, '30/1');
  assert.ok(Math.abs(Number(data.format.duration) - manifest.duration) < .05);
  const bytes = await readFile(path);
  assert.ok(bytes.length < 5_000_000);
  assert.ok(bytes.length < manifest.originalBytes);
  assert.ok(bytes.indexOf(Buffer.from('moov')) < bytes.indexOf(Buffer.from('mdat')));
});
test('poster is original-size WebP from a documented actual candidate', async () => {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', join(root, manifest.poster)], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const stream = JSON.parse(result.stdout).streams[0];
  assert.equal(stream.codec_name, 'webp');
  assert.equal(stream.width, 384);
  assert.equal(stream.height, 832);
  assert.ok(manifest.candidates.some(candidate => candidate.timestamp === manifest.selectedPosterTimestamp));
  assert.equal(manifest.selectedPosterTimestamp, 23);
  assert.equal(manifest.sourceSha256, 'cf2f1f8d8b53e8209c60ca8ad39c97bfebf16331b8f4943b7d2395dcebb7d81e');
});
test('public output contains exact optimized media and never raw recordings or manifests', async () => {
  const files = await publicFiles(root);
  assert.ok(files.has(manifest.poster));
  assert.ok(files.has(manifest.webVideo));
  assert.equal(files.has(manifest.source), false);
  assert.equal(isPublicAsset(manifest.source), false);
  assert.equal(isPublicAsset('assets/trainer-video-manifest.json'), false);
  for (const path of [manifest.poster, manifest.webVideo]) {
    assert.equal((await stat(join(root, 'dist', path))).size, (await stat(join(root, path))).size);
    assert.deepEqual(await readFile(join(root, 'dist', path)), await readFile(join(root, path)));
  }
});
test('portrait presentation cannot crop footage and stacks below text on small screens', async () => {
  const css = await read('assets/css/styles.css');
  assert.match(css, /\.trainer-phone video[^}]+aspect-ratio: 384 \/ 832; object-fit: contain/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.trainer-overview__layout \{ grid-template-columns: minmax\(0, 1fr\)/);
});
test('offscreen pause never introduces autoplay/resume and restart is user initiated', async () => {
  const js = await read('assets/js/site.js');
  assert.match(js, /!entry\.isIntersecting && \(bounds\.bottom <= 0 \|\| bounds\.top >= window\.innerHeight\)/);
  assert.match(js, /video\.scrollIntoView\(\{ block: 'center', behavior: 'instant' \}\)/);
  assert.match(js, /video\.focus\(\{ preventScroll: true \}\)/);
  assert.match(js, /if \(document\.hidden\) videos\.forEach/);
  assert.match(js, /button\.addEventListener\('click', function \(\) \{[\s\S]*video\.currentTime = 0;[\s\S]*video\.play\(\)/);
});
test('standalone build requires no package install, runtime secret or SPA catch-all', async () => {
  const config = await read('render.yaml');
  assert.match(config, /buildCommand: node scripts\/validate-site\.mjs && node scripts\/prepare-public\.mjs/);
  assert.match(config, /staticPublishPath: \.\/dist/);
  assert.match(config, /autoDeployTrigger: off/);
  assert.doesNotMatch(config, /source: \/\*|secret|service_role|startCommand/);
  assert.equal((await read('.node-version')).trim(), '24.22.1');
});
