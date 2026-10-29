(function (global) {
  'use strict';
  const clamp = value => Math.max(0,Math.min(1,value));
  function progress(top,run,inset=94) { return run > 0 ? clamp((inset-top)/run) : 0; }
  function activeIndex(value,count) { return Math.min(count-1,Math.max(0,Math.round(clamp(value)*(count-1)))); }
  global.GymManagerStory = { progress, activeIndex };
  if (typeof document === 'undefined') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const size = window.matchMedia('(min-width: 960px) and (min-height: 700px)');
  const stories = [...document.querySelectorAll('[data-scroll-story]')].map(section => {
    const track=section.querySelector('[data-story-track]'), pin=section.querySelector('.story-pin');
    const slides=[...section.querySelectorAll('[data-story-slide]')], buttons=[...section.querySelectorAll('[data-story-go]')];
    const counter=section.querySelector('[data-story-counter]');
    let enabled=false, run=0, introHeight=0, transferWidth=0, active=-1, failed=false;
    function setActive(index) {
      if(index===active) return;
      active=index; section.dataset.storyActive=String(index);
      slides.forEach((slide,i) => {
        slide.inert=enabled && i!==index;
        if(enabled) slide.setAttribute('aria-hidden',String(i!==index)); else slide.removeAttribute('aria-hidden');
      });
      buttons.forEach((button,i)=>i===index ? button.setAttribute('aria-current','step') : button.removeAttribute('aria-current'));
      if(counter) counter.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
    }
    function fallback() {
      enabled=false; active=-1;
      section.classList.remove('is-scroll-enhanced','is-story-visible');
      section.style.removeProperty('--story-height'); section.style.removeProperty('--story-x');
      slides.forEach(slide=>{slide.inert=false;slide.removeAttribute('aria-hidden');});
      setActive(0);
    }
    function configure() {
      if(!track || !pin || slides.length<2 || !size.matches || reduced.matches || failed) return fallback();
      enabled=true; active=-1; section.classList.add('is-scroll-enhanced');
      // Geometry reads only on configure/resize, not interleaved with each slide write.
      const pinHeight=pin.getBoundingClientRect().height;
      introHeight=section.querySelector('.story-intro').getBoundingClientRect().height;
      transferWidth=Math.max(0,pin.getBoundingClientRect().width-180);
      section.dataset.storyMeasuredHeight=String(Math.round(pinHeight));
      if(pinHeight>window.innerHeight-94) return fallback();
      run=(slides.length-1)*Math.max(420,window.innerHeight*.62);
      section.style.setProperty('--story-height',(run+pinHeight+introHeight)+'px');
      update();
    }
    function update() {
      if(!enabled || document.hidden) return;
      const rect=section.getBoundingClientRect();
      const visible=rect.bottom>0 && rect.top<window.innerHeight;
      section.classList.toggle('is-story-visible',visible);
      const p=progress(rect.top+introHeight,run);
      section.style.setProperty('--story-x',(-p*(slides.length-1)*100)+'%');
      section.style.setProperty('--story-progress',String(p));
      section.style.setProperty('--transfer-x',(transferWidth*p)+'px');
      setActive(activeIndex(p,slides.length));
    }
    buttons.forEach((button,index)=>button.addEventListener('click',()=>{
      if(!enabled) return;
      const y=window.scrollY+section.getBoundingClientRect().top+introHeight-94+run*index/(slides.length-1);
      window.scrollTo({top:y,behavior:'auto'});
    }));
    section.querySelectorAll('img').forEach(image=>{
      image.addEventListener('error',()=>{failed=true;fallback();});
      if(image.complete && image.naturalWidth===0) failed=true;
    });
    if('IntersectionObserver' in window) {
      const prefetch=new IntersectionObserver(entries=>{
        if(!entries.some(entry=>entry.isIntersecting)) return;
        section.querySelectorAll('img').forEach(image=>{image.loading='eager';});
        prefetch.disconnect();
      },{rootMargin:'700px'});
      prefetch.observe(section);
    }
    return {configure,update};
  });
  let queued=false;
  function schedule() {
    if(queued) return;
    queued=true; window.requestAnimationFrame(()=>{queued=false;stories.forEach(story=>story.update());});
  }
  function configure() { stories.forEach(story=>story.configure()); }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',configure,{passive:true});
  window.addEventListener('pageshow',configure);
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',configure); size.addEventListener('change',configure);
  configure();
})(typeof globalThis!=='undefined' ? globalThis : this);
