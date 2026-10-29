import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles, renderSitePages } from './public-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const documents = await renderSitePages(root);
const files = await publicFiles(root, documents);
async function existingFiles(dir, prefix = '') {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const result = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${entry.name}`);
    const name = prefix + entry.name;
    if (entry.isDirectory()) result.push(...await existingFiles(join(dir, entry.name), name + '/'));
    else result.push(name);
  }
  return result;
}
// Fail closed rather than silently publishing stale/private files from an earlier build.
for (const file of await existingFiles(output)) if (!files.has(file)) throw new Error(`Unexpected file in dist: ${file}. Inspect it before preparing again.`);
for (const file of files) {
  await mkdir(dirname(join(output, file)), { recursive: true });
  if (documents.has(file)) await writeFile(join(output, file), documents.get(file), 'utf8');
  else await copyFile(join(root, file), join(output, file));
}
console.log(`Public package ready: ${output} (${files.size} files). Raw uploads, QA, scripts and documents excluded.`);
