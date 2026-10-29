(function (global) {
  'use strict';
  const clamp = value => Math.max(0,Math.min(1,value));
  function progress(top,run,inset=94) { return run > 0 ? clamp((inset-top)/run) : 0; }
  function activeIndex(value,count) { return Math.min(count-1,Math.max(0,Math.round(clamp(value)*(count-1)))); }
  function modeFor(width,height) { return height < 520 && width > height ? 'landscape' : width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'; }
  function visualPosition(value,count,mode) { return mode==='desktop' ? clamp(value)*(count-1) : activeIndex(value,count); }
  global.GymManagerStory = { progress, activeIndex, modeFor, visualPosition };
  if (typeof document === 'undefined') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stories = [...document.querySelectorAll('[data-scroll-story]')].map(section => {
    const track=section.querySelector('[data-story-track]'), pin=section.querySelector('.story-pin');
    const slides=[...section.querySelectorAll('[data-story-slide]')], buttons=[...section.querySelectorAll('[data-story-go]')];
    const counter=section.querySelector('[data-story-counter]');
    let enabled=false, run=0, introHeight=0, transferWidth=0, inset=94, active=-1, failed=false;
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
    function fallback(reason) {
      enabled=false; active=-1;
      section.dataset.storyMode=reason;
      section.classList.remove('is-scroll-enhanced','is-story-visible');
      section.style.removeProperty('--story-height'); section.style.removeProperty('--story-x');
      section.style.removeProperty('--story-progress'); section.style.removeProperty('--transfer-x');
      slides.forEach(slide=>{slide.inert=false;slide.removeAttribute('aria-hidden');});
      setActive(0);
    }
    function configure() {
      if(!track || !pin || slides.length<2) return fallback('unavailable');
      if(reduced.matches || failed) return fallback(reduced.matches ? 'reduced-motion' : 'media-error');
      const mode=modeFor(window.innerWidth,window.innerHeight);
      section.dataset.storyMode=mode;
      inset=window.innerWidth<=768 ? 82 : 94;
      enabled=true; active=-1; section.classList.add('is-scroll-enhanced');
      // Geometry reads only on configure/resize, not interleaved with each slide write.
      const pinHeight=pin.getBoundingClientRect().height;
      introHeight=section.querySelector('.story-intro').getBoundingClientRect().height;
      const tile=section.querySelector('.ecosystem-transfer__tile');
      transferWidth=Math.max(0,pin.getBoundingClientRect().width-(tile?.getBoundingClientRect().width || 180));
      section.dataset.storyMeasuredHeight=String(Math.round(pinHeight));
      if(pinHeight>window.innerHeight-inset) return fallback('content-overflow');
      // Mobile run follows stable CSS stage geometry (svh), not collapsing browser chrome.
      run=(slides.length-1)*(mode==='desktop' ? Math.max(420,window.innerHeight*.62) : Math.max(260,pinHeight*.85));
      section.style.setProperty('--story-height',(run+pinHeight+introHeight)+'px');
      update();
    }
    function update() {
      if(!enabled || document.hidden) return;
      const rect=section.getBoundingClientRect();
      const visible=rect.bottom>0 && rect.top<window.innerHeight;
      section.classList.toggle('is-story-visible',visible);
      const p=progress(rect.top+introHeight,run,inset);
      section.style.setProperty('--story-x',(-visualPosition(p,slides.length,section.dataset.storyMode)*100)+'%');
      section.style.setProperty('--story-progress',String(p));
      section.style.setProperty('--transfer-x',(transferWidth*p)+'px');
      setActive(activeIndex(p,slides.length));
    }
    buttons.forEach((button,index)=>button.addEventListener('click',()=>{
      if(!enabled) return;
      const y=window.scrollY+section.getBoundingClientRect().top+introHeight-inset+run*index/(slides.length-1);
      window.scrollTo({top:y,behavior:'instant'});
    }));
    section.querySelectorAll('img').forEach(image=>{
      image.addEventListener('error',()=>{failed=true;fallback('media-error');});
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
    if('ResizeObserver' in window) {
      const measured=new window.ResizeObserver(()=>{layoutQueued=true;schedule();});
      measured.observe(pin);
      measured.observe(section.querySelector('.story-intro'));
    }
    return {configure,update};
  });
  let queued=false, layoutQueued=false;
  function schedule() {
    if(queued) return;
    queued=true; window.requestAnimationFrame(()=>{
      queued=false;
      if(layoutQueued) {layoutQueued=false;configure();} else stories.forEach(story=>story.update());
    });
  }
  function configure() {
    stories.forEach(story=>story.configure());
    document.dispatchEvent?.(new CustomEvent('gymmanager:story-layout'));
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',configure,{passive:true});
  window.addEventListener('pageshow',configure);
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',configure);
  configure();
})(typeof globalThis!=='undefined' ? globalThis : this);
