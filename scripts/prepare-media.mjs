import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Exact, reviewed source ranges. No originals are modified or uploaded.
const first = 'img/Prima registrazione.mp4';
const second = 'img/Seconda registrazione.mp4';
const images = [
  ['img/Cliente.jfif', '02-client-upload.webp'],
  ['img/Questionario.jfif', '03-questionnaire.webp'],
  ['img/calendario.jfif', '09-calendar.webp'],
  ['img/Pagamenti.jfif', '11-payments.webp'],
  [first, '12-client-demo.webp', 7],
  [first, '10-progress.webp', 18],
  [second, '04-workout-plan.webp', 12],
  [second, '05-body-focus.webp', 22.6],
  [second, '07-nutrition-overview.webp', 34],
  [second, '08-nutrition-client-plan.webp', 37],
];
const clips = [
  { name: 'workout-analysis', source: second, start: 18, duration: 9, poster: '05-body-focus.webp', title: 'Scheda, Body Focus e analisi dei volumi', description: 'Il Trainer scorre le sessioni di una scheda demo e consulta Body Focus, radar e linee di lavoro.' },
  { name: 'client-progress', source: first, start: 14, duration: 19, poster: '10-progress.webp', title: 'Progressi e composizione corporea', description: 'Rilevazioni, grafici e dettaglio plicometrico del profilo sintetico Giulio Bianchi DEMO.' },
  { name: 'nutrition-plan', source: second, start: 34, duration: 4, poster: '07-nutrition-overview.webp', title: 'Piano nutrizionale del Cliente', description: 'Dal riepilogo del piano demo alle giornate, con pasti, quantità, calorie e macronutrienti.' },
];

function ffmpeg(args) {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${result.status}`);
}
await mkdir(resolve(root, 'assets/screenshots'), { recursive: true });
await mkdir(resolve(root, 'assets/videos'), { recursive: true });
for (const [source, output, second] of images) {
  ffmpeg([...(second === undefined ? [] : ['-ss', String(second)]), '-i', source, '-frames:v', '1', '-an', '-vf', "scale='min(1600,iw)':-2", '-c:v', 'libwebp', '-quality', '86', '-map_metadata', '-1', `assets/screenshots/${output}`]);
}
for (const clip of clips) {
  ffmpeg(['-ss', String(clip.start), '-i', clip.source, '-t', String(clip.duration), '-map', '0:v:0', '-an', '-vf', 'scale=1280:-2,fps=20', '-c:v', 'libx264', '-preset', 'medium', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-map_metadata', '-1', `assets/videos/${clip.name}.mp4`]);
  const vtt = `WEBVTT\n\n00:00.000 --> 00:${String(clip.duration).padStart(2, '0')}.000\n${clip.description}\n`;
  await writeFile(resolve(root, `assets/videos/${clip.name}.it.vtt`), vtt);
}
await writeFile(resolve(root, 'assets/media-manifest.json'), JSON.stringify({ images: images.map(([source, file, second]) => ({ source, file, second: second ?? null })), clips, audio: 'REMOVED', note: 'Dati sintetici/demo. Registrazioni originali escluse dal pacchetto pubblico.' }, null, 2) + '\n');
console.log(`Prepared ${images.length} real screenshots and ${clips.length} silent clips.`);
