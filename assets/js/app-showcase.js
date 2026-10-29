(function (global) {
  'use strict';

  // Pure rule shared with deterministic tests. Choose the last step that has
  // reached the reading line; jumping/reversing never depends on previous state.
  function indexAtLine(tops, line) {
    var selected = 0;
    tops.forEach(function (top, index) { if (top <= line) selected = index; });
    return selected;
  }
  function normalized(value) { return Math.max(0, Math.min(1, value)); }
  global.GymManagerShowcase = Object.freeze({ indexAtLine: indexAtLine, normalized: normalized });
  if (typeof document === 'undefined') return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var components = [];
  document.querySelectorAll('[data-app-showcase]').forEach(function (section) {
    var steps = Array.from(section.querySelectorAll('[data-showcase-step]'));
    var screens = Array.from(section.querySelectorAll('[data-showcase-screen]'));
    var links = Array.from(section.querySelectorAll('[data-showcase-link]'));
    var caption = section.querySelector('[data-showcase-caption]');
    var title = section.querySelector('[data-showcase-title]');
    var description = section.querySelector('[data-showcase-description]');
    var cta = section.querySelector('[data-showcase-cta]');
    var zoomNote = section.querySelector('.desktop-showcase__zoom-note');
    var desktop = section.dataset.showcaseVariant === 'desktop';
    var stageElement = section.querySelector('.app-showcase__stage');
    var layout = section.querySelector('.app-showcase__layout');
    var activeCopy = section.querySelector('[data-showcase-active-copy]');
    // DOM is the data contract: each instance owns its title/copy/features/screens.
    var items = steps.map(function (step) {
      var key = step.dataset.showcaseStep;
      return {
        key: key, step: step, label: step.dataset.showcaseLabel,
        description: step.dataset.showcaseDescription, href: step.dataset.showcaseHref,
        screen: screens.find(function (image) { return image.dataset.showcaseScreen === key; }),
        link: links.find(function (link) { return link.dataset.showcaseLink === key; })
      };
    });
    if (!items.length || items.some(function (item) { return !item.screen || !item.link; })) return;
    var active = -1;
    var failed = false;
    var compact = false, enabled = false, origin = 0, run = 1, readingLine = 0, tops = [];
    function activate(index) {
      if (active === index) return;
      active = index;
      section.dataset.activeScreen = items[index].key;
      items.forEach(function (item, itemIndex) {
        var current = itemIndex === index;
        item.screen.classList.toggle('is-active', current);
        item.screen.setAttribute('aria-hidden', String(!current));
        item.step.classList.toggle('is-active', current);
        if (current) item.link.setAttribute('aria-current', 'step');
        else item.link.removeAttribute('aria-current');
      });
      var item = items[index];
      if (compact && activeCopy) {
        var originalCopy = item.step.querySelector('.app-showcase__step-copy');
        if (originalCopy) activeCopy.replaceChildren(originalCopy.cloneNode(true));
      }
      var pending = item.screen.dataset.showcasePending === 'true';
      if (caption) caption.textContent = item.label + (pending ? ' · anteprima in preparazione' : ' · schermata reale');
      if (desktop) {
        if (title) title.textContent = item.label;
        if (description) description.textContent = item.description;
        if (cta && /^desktop\/[a-z0-9-]+\/$/.test(item.href)) {
          cta.setAttribute('href', item.href);
          cta.setAttribute('aria-label', 'Approfondisci: ' + item.label);
        }
        if (phone) phone.disabled = pending;
        if (zoomNote) zoomNote.textContent = pending ? 'Anteprima in preparazione. Puoi già aprire l’approfondimento.' : 'Tocca la schermata per leggerla in grande.';
      }
    }
    function error() {
      failed = true;
      section.classList.add('has-media-error');
      var note = section.querySelector('.app-showcase__media-error');
      if (note) note.hidden = false;
      configure();
    }
    items.forEach(function (item, index) {
      item.screen.addEventListener('error', error);
      if (item.screen.complete && !item.screen.naturalWidth) error();
      item.link.addEventListener('click', function () { activate(index); });
    });
    function fallback(reason) {
      enabled = false;
      section.dataset.showcaseMode = reason;
      section.classList.remove('is-enhanced', 'is-compact-story');
      items.forEach(function (item) { item.step.inert = false; item.step.removeAttribute('aria-hidden'); });
      if (activeCopy) activeCopy.hidden = true;
      section.style?.removeProperty('--showcase-height');
    }
    function configure() {
      compact = !desktop && (window.innerWidth < 1024 || window.innerHeight < 650);
      if (failed || reducedMotion.matches || (desktop && window.innerWidth <= 1024)) return fallback(failed ? 'media-error' : reducedMotion.matches ? 'reduced-motion' : 'legacy-desktop');
      enabled = true;
      section.classList.add('is-enhanced');
      section.classList.toggle('is-compact-story', compact);
      section.dataset.showcaseMode = compact ? (window.innerHeight < 520 && window.innerWidth > window.innerHeight ? 'landscape' : window.innerWidth < 768 ? 'mobile' : 'tablet') : 'desktop';
      if (activeCopy) activeCopy.hidden = !compact;
      items.forEach(function (item) { item.step.inert = compact; if (compact) item.step.setAttribute('aria-hidden','true'); else item.step.removeAttribute('aria-hidden'); });
      if (compact && activeCopy && layout) {
        active = -1; activate(0);
        activeCopy.style.minHeight = '0px';
        section.style.setProperty('--showcase-copy-width', activeCopy.getBoundingClientRect().width + 'px');
        // Original text is the source of truth. Measure its maximum only at layout changes.
        var copyHeight = Math.max.apply(null, items.map(function (item) { return item.step.querySelector('.app-showcase__step-copy').getBoundingClientRect().height; }));
        activeCopy.style.minHeight = copyHeight + 'px';
        var stageHeight = stageElement.getBoundingClientRect().height;
        var inset = window.innerWidth <= 768 ? 82 : 94;
        if (stageHeight > window.innerHeight - inset) return fallback('content-overflow');
        run = (items.length - 1) * Math.max(260, stageHeight * .85);
        section.style.setProperty('--showcase-step-run', run / Math.max(1, items.length - 1) + 'px');
        section.style.setProperty('--showcase-height', run + stageHeight + 'px');
        section.dataset.showcaseMeasuredHeight = String(Math.round(stageHeight));
        origin = layout.getBoundingClientRect().top + window.scrollY - inset;
      } else {
        tops = items.map(function (item) { return item.step.getBoundingClientRect().top + (window.scrollY || 0); });
        readingLine = window.innerHeight * .5;
      }
      update();
    }
    function update() {
      if (!enabled || document.hidden) return;
      var y = window.scrollY || 0;
      var p = compact ? normalized((y - origin) / run) : normalized((y + readingLine - tops[0]) / Math.max(1, tops[tops.length - 1] - tops[0]));
      section.style?.setProperty('--showcase-progress', String(p));
      section.dataset.showcaseProgress = String(p);
      activate(compact ? Math.round(p * (items.length - 1)) : indexAtLine(tops.map(function (top) { return top - y; }), readingLine));
    }
    activate(0);
    var phone = section.querySelector('[data-showcase-phone]');
    if (phone) phone.addEventListener('click', function () {
      if (items[active].screen.dataset.showcasePending === 'true') return;
      document.dispatchEvent(new CustomEvent('gymmanager:image-open', { detail: { image: items[active].screen, trigger: phone } }));
    });
    components.push({ configure: configure, update: update });
  });

  var nav = document.querySelector('.nav-links');
  var home = nav && nav.querySelector('[aria-current="page"]');
  var sectionLinks = nav ? Array.from(nav.querySelectorAll('[data-nav-section]')).map(function (link) {
    return { link: link, section: document.getElementById(link.dataset.navSection) };
  }).filter(function (item) { return item.section; }) : [];
  function updateNav() {
    var active = sectionLinks.find(function (item) {
      var bounds = item.section.getBoundingClientRect();
      return bounds.top <= 160 && bounds.bottom > 160;
    });
    sectionLinks.forEach(function (item) {
      if (item === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
    if (home) {
      if (active) home.removeAttribute('aria-current');
      else home.setAttribute('aria-current', 'page');
    }
  }
  var scheduled = false;
  var needsLayout = true;
  function schedule(remeasure) {
    if (remeasure === true) needsLayout = true;
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      if (needsLayout) { needsLayout = false; components.forEach(function (component) { component.configure(); }); }
      components.forEach(function (component) { component.update(); });
      updateNav();
    });
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', function () { schedule(true); });
  window.addEventListener('hashchange', schedule);
  window.addEventListener('pageshow', function () { schedule(true); });
  document.addEventListener?.('gymmanager:story-layout', function () { schedule(true); });
  document.addEventListener?.('visibilitychange', schedule);
  reducedMotion.addEventListener('change', function () { schedule(true); });
  schedule();
}(globalThis));
