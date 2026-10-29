import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { localTarget, publicFiles, isPublicAsset, renderSitePages } from './public-files.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const documents = await renderSitePages(root);
const home = documents.get('index.html');
const text = html => html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const section = key => documents.get(key + '/index.html');
test('public legal pages retain approved identity/contact without draft presentation', () => {
  for (const key of ['privacy','support']) {
    const html = section(key);
    assert.doesNotMatch(html,/bozza|draft|placeholder|versione definitiva|pubblicazione definitiva/i);
    assert.match(html,/Paolino Bottiglieri/);
    assert.match(html,/mailto:Paolinob2@libero.it/);
    assert.doesNotMatch(html,/name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(html,/<form|<input|<iframe|100% sicur|GDPR certified|military grade/i);
    assert.doesNotMatch(html,/http-equiv="refresh"|rel="canonical"/);
  }
  assert.doesNotMatch(home,/legal-copy|name="robots" content="noindex, nofollow"/);
});
test('no legal paragraphs, lists or definitions lost from source documents', async () => {
  for (const key of ['privacy','support']) {
    const source = await readFile(join(root,key,'index.html'),'utf8');
    const main = source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
    const target = text(section(key));
    for (const [, , content] of main.matchAll(/<(p|li|dt|dd)\b[^>]*>([\s\S]*?)<\/\1>/g)) assert.ok(target.includes(text(content)),key + ':' + text(content));
  }
});
test('privacy retains ecosystem disclosure, HealthKit/location and undefined retention', () => {
  const html = section('privacy');
  for (const term of ['Supabase Auth','Supabase PostgreSQL','Supabase Storage','Supabase Edge Functions','Stripe','HealthKit','posizione','Periodi e criteri di conservazione non ancora definiti','Basi giuridiche','ancora in lavorazione']) assert.ok(html.includes(term),term);
  assert.doesNotMatch(html,/\b(?:30|60|90|365) giorni|\b(?:2|5|10) anni/);
});
test('support security notices, account/deletion and original local IDs survive', () => {
  for (const key of ['accesso','associazione','account','sincronizzazione','tecnico','privacy','contatto']) assert.ok(section('support').includes('id="' + key + '"'));
  assert.match(section('support'),/password, codici monouso o token/);
  assert.match(section('support'),/href="..\/privacy\/"/);
  assert.match(section('privacy'),/href="..\/support\/"/);
});
test('shared footer exposes separate legal routes, not primary product menu', () => {
  const footer = home.match(/<footer[\s\S]*?<\/footer>/)[0];
  assert.match(footer,/href="privacy\/"/); assert.match(footer,/href="support\/"/);
  const header=home.match(/<header class="site-header">[\s\S]*?<\/header>/)[0];
  assert.doesNotMatch(header,/privacy\/|support\//);
});
test('public URL resolution rejects traversal and private content', () => {
  for (const path of ['../../.env','/CODEX_HANDOFF.md','..\\..\\secret','%2e%2e/%2e%2e/secret']) assert.throws(() => localTarget('privacy/index.html',path),path);
  for (const path of ['assets/screenshots/README.md','assets/js/config.json','img/logo.png','scripts/public-files.mjs','.env']) assert.equal(isPublicAsset(path),false,path);
});
test('public build matches allowlist exactly and legal documents are populated', async () => {
  const expected = await publicFiles(root);
  async function walk(dir,prefix='') {
    const paths=[];
    for(const entry of await readdir(dir,{withFileTypes:true})) {
      assert.equal(entry.isSymbolicLink(),false);
      const name=prefix+entry.name;
      if(entry.isDirectory()) paths.push(...await walk(join(dir,entry.name),name+'/')); else paths.push(name);
    }
    return paths;
  }
  assert.deepEqual((await walk(join(root,'dist'))).sort(),[...expected].sort());
  for(const key of ['privacy','support']) {
    const html=await readFile(join(root,'dist',key,'index.html'),'utf8');
    assert.doesNotMatch(html,/http-equiv="refresh"/);
    assert.match(html,/legal-copy/); assert.doesNotMatch(html,/bozza|draft/i);
  }
});
test('Render remains a single static service with no auto deployment or catch-all SPA rewrite', async () => {
  const config=await readFile(join(root,'render.yaml'),'utf8');
  assert.equal((config.match(/runtime: static/g)||[]).length,1);
  assert.match(config,/staticPublishPath: \.\/dist/); assert.match(config,/autoDeployTrigger: off/);
  assert.doesNotMatch(config,/startCommand|desktop-v|supabase|source: \/\*/);
});
test('legal text retains existing readable layout without scripts', async () => {
  const css=await readFile(join(root,'assets/css/legal.css'),'utf8');
  assert.match(css,/min-height: 44px/);
  assert.doesNotMatch(css,/opacity: 0\b|display: none|overflow: hidden/);
});
