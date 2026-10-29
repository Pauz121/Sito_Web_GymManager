(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');
  var isDevelopment = window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname);
  root.classList.toggle('is-development', isDevelopment);

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  function closeMenu() {
    if (!toggle || !links) return;
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('[data-year]').forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  var lightbox = document.createElement('dialog');
  lightbox.className = 'image-dialog';
  lightbox.setAttribute('aria-label', 'Schermata del gestionale ingrandita');
  lightbox.innerHTML = '<form method="dialog"><button class="button button--secondary" type="submit" autofocus>Chiudi immagine <span aria-hidden="true">×</span></button></form><img alt=""><p></p>';
  document.body.appendChild(lightbox);
  var lastImageButton;
  function openImage(image, trigger) {
    if (!image || typeof lightbox.showModal !== 'function') return;
    lastImageButton = trigger;
    var expanded = lightbox.querySelector('img');
    expanded.src = image.currentSrc || image.src;
    expanded.alt = image.alt;
    lightbox.classList.toggle('image-dialog--portrait', image.naturalHeight > image.naturalWidth);
    lightbox.querySelector('p').textContent = image.alt;
    lightbox.showModal();
    root.classList.add('has-dialog');
  }
  document.addEventListener('gymmanager:image-open', function (event) {
    openImage(event.detail.image, event.detail.trigger);
  });
  lightbox.addEventListener('close', function () {
    root.classList.remove('has-dialog');
    if (lastImageButton) lastImageButton.focus({ preventScroll: true });
  });
  lightbox.addEventListener('click', function (event) {
    if (event.target !== lightbox) return;
    var bounds = lightbox.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
  });

  document.querySelectorAll('img[data-screenshot]').forEach(function (image) {
    var placeholder = image.parentElement && image.parentElement.querySelector('.screenshot-placeholder');
    image.addEventListener('load', function () {
      image.hidden = false;
      if (placeholder) placeholder.hidden = true;
      if (!image.parentElement.querySelector('.image-zoom') && typeof lightbox.showModal === 'function') {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'image-zoom';
        button.textContent = 'Ingrandisci ↗';
        button.setAttribute('aria-label', 'Ingrandisci: ' + image.alt);
        button.setAttribute('aria-haspopup', 'dialog');
        button.addEventListener('click', function () {
          openImage(image, button);
        });
        image.insertAdjacentElement('afterend', button);
      }
    });
    image.addEventListener('error', function () {
      image.hidden = true;
      if (placeholder) placeholder.hidden = !isDevelopment;
      if (!isDevelopment) {
        var visual = image.closest('.hero-visual, .gallery-card, .visual-card');
        if (visual) {
          visual.hidden = true;
          if (visual.parentElement) visual.parentElement.classList.add('has-missing-visual');
        }
      }
    });
    if (image.complete) {
      if (image.naturalWidth > 0) image.dispatchEvent(new Event('load'));
      else image.dispatchEvent(new Event('error'));
    }
  });

  var videos = document.querySelectorAll('video');
  videos.forEach(function (video) {
    video.addEventListener('play', function () {
      videos.forEach(function (other) { if (other !== video) other.pause(); });
    });
    function videoError() {
      if (video.parentElement.querySelector('.video-error')) return;
      var note = document.createElement('p');
      note.className = 'video-error';
      note.setAttribute('role', 'status');
      note.textContent = 'Video non disponibile in questo browser. Puoi comunque esplorare le schermate e le descrizioni qui sotto.';
      video.insertAdjacentElement('afterend', note);
    }
    video.addEventListener('error', videoError);
    video.querySelectorAll('source').forEach(function (source) { source.addEventListener('error', videoError); });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) videos.forEach(function (video) { video.pause(); });
  });

  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(function (node) { node.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    reveals.forEach(function (node) { observer.observe(node); });
  }

  window.setTimeout(function () {
    reveals.forEach(function (node) { node.classList.add('is-visible'); });
  }, 900);
}());
