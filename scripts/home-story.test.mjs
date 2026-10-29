import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { renderSitePages } from './site-pages.mjs';
import { homeDesktopSlugs } from './home-render.mjs';
const root=resolve(import.meta.dirname,'..');
const docs=await renderSitePages(root), home=docs.get('index.html');
const source=await readFile(resolve(root,'assets/js/home-story.js'),'utf8');
const sandbox=vm.createContext({}); vm.runInContext(source,sandbox);
test('native scroll progress clamps and supports reverse/deep entry deterministically',()=>{
  const {progress,activeIndex}=sandbox.GymManagerStory;
  assert.equal(progress(500,1000),0); assert.equal(progress(94,1000),0);
  assert.equal(progress(-406,1000),.5); assert.equal(progress(-1906,1000),1);
  assert.equal(progress(94,0),0);
  for(const [p,index] of [[0,0],[.2,1],[.6,3],[1,5],[.2,1]]) assert.equal(activeIndex(p,6),index);
});
test('six curated real screens, concise copy and separate detail CTA',()=>{
  assert.equal(homeDesktopSlugs.length,6);
  const desktop=home.slice(home.indexOf('id="desktop"'),home.indexOf('id="ios-trainer"'));
  assert.equal((desktop.match(/data-story-slide/g)||[]).length,6);
  assert.equal((desktop.match(/data-story-go=/g)||[]).length,6);
  assert.match(desktop,/href="desktop\/">Approfondisci il Desktop/);
  assert.doesNotMatch(desktop,/A cosa serve|class="desktop-chapter"|<video/);
  assert.equal((desktop.match(/--story-aspect:/g)||[]).length,6);
});
test('motion is additive with no wheel hijack, dependency, timer or forced focus',async()=>{
  assert.match(source,/requestAnimationFrame/); assert.match(source,/passive:true/);
  assert.match(source,/prefers-reduced-motion/); assert.match(source,/slide.inert/);
  assert.doesNotMatch(source,/preventDefault|wheel|setInterval|\.focus\(|fetch\(/);
  const css=await readFile(resolve(root,'assets/css/home-story.css'),'utf8');
  assert.match(css,/position: sticky/); assert.match(css,/translate3d/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/\.story-slide \{ min-width: 0; margin:/);
});

test('public Home has five sections without a Client marketing gap',()=>{
  const main=home.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  const names=[...main.matchAll(/<section\b[^>]*>/g)].map(m=>m[0].match(/id="([^"]+)"/)?.[1]||'hero');
  assert.deepEqual(names,['hero','desktop','ios-trainer','ecosistema','inizia']);
  assert.doesNotMatch(main,/class="desktop-chapter"|class="legal-copy"|id="download-card"/);
  assert.match(main,/href="download\/">Scarica GymManager/);
  assert.equal((home.match(/<footer\b/g)||[]).length,1);
});
test('public ecosystem retains real Desktop/Trainer evidence without advertising App Client',()=>{
  const eco=home.slice(home.indexOf('id="ecosistema"'),home.indexOf('id="inizia"'));
  assert.equal((eco.match(/data-story-slide/g)||[]).length,3);
  for(const token of ['04-workout-plan.webp','ios-trainer-workout.webp','Scheda assegnata','lo stesso account']) assert.ok(eco.includes(token),token);
  assert.match(eco,/non è una promessa di sincronizzazione istantanea/);
  assert.doesNotMatch(eco,/client-logo|App Client|Client iOS|app-client|<video|autoplay/);
});

function mount({reduced=false,narrow=false,failed=false}={}) {
  const classes=new Set(),vars={},events={},attrs={}; let top=0,scroll={};
  const slides=Array.from({length:6},()=>({inert:false,setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];}}));
  const buttons=slides.map(()=>({handlers:{},setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];},addEventListener(k,fn){this.handlers[k]=fn;}}));
  const image={complete:failed,naturalWidth:failed?0:1600,addEventListener(k,fn){this[k]=fn;}};
  const pin={getBoundingClientRect:()=>({height:600,width:1100})};
  const section={dataset:{},style:{setProperty(k,v){vars[k]=v;},removeProperty(k){delete vars[k];}},classList:{add(k){classes.add(k);},remove(...keys){keys.forEach(k=>classes.delete(k));},toggle(k,on){on?classes.add(k):classes.delete(k);}},getBoundingClientRect:()=>({top,bottom:top+3500}),querySelector(s){return s==='[data-story-track]'?{}:s==='.story-pin'?pin:s==='[data-story-counter]'?attrs:{getBoundingClientRect:()=>({height:150})};},querySelectorAll(s){return s==='[data-story-slide]'?slides:s==='[data-story-go]'?buttons:[image];}};
  const sandbox=vm.createContext({document:{hidden:false,querySelectorAll:()=>[section],addEventListener(k,fn){events[k]=fn;}},window:{innerHeight:900,scrollY:1000,matchMedia:q=>({matches:q.includes('reduce')?reduced:!narrow,addEventListener(){}}),addEventListener(k,fn){events[k]=fn;},requestAnimationFrame:fn=>fn(),scrollTo(value){scroll=value;}}});
  vm.runInContext(source,sandbox);
  return {section,slides,buttons,image,classes,vars,events,scroll:()=>scroll,move(value){top=value;events.scroll();}};
}
test('real controller changes horizontal transform, active slide, inert and counter in both directions',()=>{
  const m=mount(); assert.ok(m.classes.has('is-scroll-enhanced'));
  m.move(-1172); assert.equal(m.section.dataset.storyActive,'2');
  assert.match(m.vars['--story-x'],/^-/); assert.equal(m.slides.filter(s=>!s.inert).length,1);
  m.move(500); assert.equal(m.section.dataset.storyActive,'0');
  assert.equal(m.buttons[0]['aria-current'],'step');
  m.buttons[5].handlers.click(); assert.ok(m.scroll().top>1000);
});
test('reduced motion, narrow viewport and image failure expose every slide with no inert content',()=>{
  for(const flags of [{reduced:true},{narrow:true},{failed:true}]) {
    const m=mount(flags); assert.equal(m.classes.has('is-scroll-enhanced'),false);
    assert.ok(m.slides.every(s=>!s.inert && s['aria-hidden']===undefined));
  }
  const m=mount(); m.image.error(); assert.equal(m.classes.has('is-scroll-enhanced'),false);
});
