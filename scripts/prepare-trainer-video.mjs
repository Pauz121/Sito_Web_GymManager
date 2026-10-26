import { spawnSync } from 'node:child_process';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, process.env.TRAINER_VIDEO_SOURCE || 'assets/source/Video app IOS_Trainer.mp4');
const qa = resolve(root, '.qa/trainer-video');
const times = [3, 13, 23, 33, 43, 53, 63, 73, 83];
const run = (tool, args) => {
  const result = spawnSync(tool, args, { encoding: 'utf8', windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(tool + ' failed: ' + (result.error?.message || result.stderr));
  return result.stdout;
};
const probe = path => JSON.parse(run('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', path]));
const hash = async path => createHash('sha256').update(await readFile(path)).digest('hex');
const before = await hash(source);
const original = probe(source);
const stream = original.streams.find(s => s.codec_type === 'video');
if (!stream || stream.width > stream.height) throw new Error('Expected the reviewed portrait source');
await mkdir(qa, { recursive: true });
for (const [i, seconds] of times.entries()) {
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(seconds), '-i', source,
    '-frames:v', '1', '-an', '-map_metadata', '-1', '-c:v', 'libwebp', '-quality', '92',
    resolve(qa, 'candidate-' + String(i).padStart(2, '0') + '.webp')]);
}
run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', '1', '-i',
  resolve(qa, 'candidate-%02d.webp'), '-vf', 'scale=192:-1,tile=3x3', '-frames:v', '1', resolve(qa, 'contact-sheet.png')]);
const output = {
  source: relative(root, source).replaceAll('\\', '/'), sourceSha256: before,
  originalBytes: (await stat(source)).size, duration: Number(original.format.duration),
  codec: stream.codec_name, width: stream.width, height: stream.height,
  nominalFps: stream.r_frame_rate, averageFps: stream.avg_frame_rate,
  candidates: times.map((timestamp, i) => ({ file: 'candidate-' + String(i).padStart(2, '0') + '.webp', timestamp }))
};
const posterArgument = process.argv.find(a => a.startsWith('--poster-at='));
if (posterArgument) {
  const timestamp = Number(posterArgument.split('=')[1]);
  if (!Number.isFinite(timestamp) || timestamp < 0 || timestamp >= output.duration) throw new Error('Invalid poster timestamp');
  const video = resolve(root, 'assets/videos/ios-trainer-overview-web.mp4');
  const poster = resolve(root, 'assets/screenshots/ios-trainer-poster.webp');
  await mkdir(dirname(video), { recursive: true });
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-map', '0:v:0', '-an',
    '-vf', 'fps=30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', '-map_metadata', '-1', video]);
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(timestamp), '-i', source,
    '-frames:v', '1', '-an', '-map_metadata', '-1', '-c:v', 'libwebp', '-quality', '92', poster]);
  const web = probe(video);
  output.selectedPosterTimestamp = timestamp;
  output.poster = relative(root, poster).replaceAll('\\', '/');
  output.webVideo = relative(root, video).replaceAll('\\', '/');
  output.optimizedBytes = (await stat(video)).size;
  output.webDuration = Number(web.format.duration);
  output.webStream = web.streams.map(s => ({ codec: s.codec_name, kind: s.codec_type, width: s.width, height: s.height, fps: s.avg_frame_rate }));
  await writeFile(resolve(root, 'assets/trainer-video-manifest.json'), JSON.stringify(output, null, 2) + '\n');
}
if (await hash(source) !== before) throw new Error('Original changed');
await writeFile(resolve(qa, 'inspection.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify(output, null, 2));
