(function (global) {
  'use strict';

  // Pure rule shared with deterministic tests. Choose the last step that has
  // reached the reading line; jumping/reversing never depends on previous state.
  function indexAtLine(tops, line) {
    var selected = 0;
    tops.forEach(function (top, index) { if (top <= line) selected = index; });
    return selected;
  }
  global.GymManagerShowcase = Object.freeze({ indexAtLine: indexAtLine });
  if (typeof document === 'undefined') return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var shortViewport = window.matchMedia('(max-height: 600px)');
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
      section.classList.remove('is-enhanced');
      section.classList.add('has-media-error');
      var note = section.querySelector('.app-showcase__media-error');
      if (note) note.hidden = false;
    }
    items.forEach(function (item, index) {
      item.screen.addEventListener('error', error);
      if (item.screen.complete && !item.screen.naturalWidth) error();
      item.link.addEventListener('click', function () { activate(index); });
    });
    function update() {
      var enhanced = !failed && !reducedMotion.matches && !shortViewport.matches && (!desktop || window.innerWidth > 1024);
      section.classList.toggle('is-enhanced', enhanced);
      if (!enhanced) return;
      var mobile = window.innerWidth <= 768;
      var stage = section.querySelector('.app-showcase__stage').getBoundingClientRect();
      var readingLine = mobile ? Math.min(window.innerHeight - 80, stage.bottom + 80) : window.innerHeight * .5;
      activate(indexAtLine(items.map(function (item) { return item.step.getBoundingClientRect().top; }), readingLine));
    }
    activate(0);
    var phone = section.querySelector('[data-showcase-phone]');
    if (phone) phone.addEventListener('click', function () {
      if (items[active].screen.dataset.showcasePending === 'true') return;
      document.dispatchEvent(new CustomEvent('gymmanager:image-open', { detail: { image: items[active].screen, trigger: phone } }));
    });
    components.push(update);
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
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      components.forEach(function (update) { update(); });
      updateNav();
    });
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', schedule);
  shortViewport.addEventListener('change', schedule);
  schedule();
}(globalThis));
