import { readFile } from 'node:fs/promises';
import { posix } from 'node:path';

export const pages = ['index.html', 'funzionalita.html', 'download.html', 'privacy/index.html', 'support/index.html'];
export const isPublicAsset = path => /^assets\/(?:favicon\.svg|css\/[\w.-]+\.css|js\/[\w.-]+\.js|screenshots\/[\w.-]+\.webp|videos\/[\w.-]+\.(?:mp4|vtt))$/.test(path);

// Relative URLs keep project-subdirectory hosting (e.g. GitHub Pages) working.
export function localTarget(page, href) {
  if (!href || /^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(href)) return null;
  const path = decodeURIComponent(href.split(/[?#]/)[0]);
  if (path.startsWith('/') || path.includes('\\') || path.includes('\0')) throw new Error(`Unsafe local URL: ${href}`);
  const target = posix.normalize(posix.join(posix.dirname(page), path));
  if (target === '..' || target.startsWith('../')) throw new Error(`Outside site: ${href}`);
  return target.endsWith('/') ? target + 'index.html' : target;
}

export async function publicFiles(root) {
  const files = new Set(pages);
  for (const page of pages) {
    const html = await readFile(posix.join(root.replaceAll('\\', '/'), page), 'utf8');
    for (const match of html.matchAll(/(?:src|href|poster)="([^"]+)"/g)) {
      const target = localTarget(page, match[1]);
      if (!target) continue;
      if (pages.includes(target)) continue;
      if (!isPublicAsset(target)) throw new Error(`Not a public page/asset: ${page} → ${target}`);
      files.add(target);
    }
  }
  return files;
}
