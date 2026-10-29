import { desktopFeatures } from '../content/desktop-features.mjs';

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const e = escapeHtml;
export const featureHref = feature => `#desktop-${feature.slug}`;
export function featureFigure(feature, image = feature.heroImage) {
  if (!image) return `<figure class="desktop-feature__visual app-frame"><div class="desktop-image-pending" role="img" aria-label="${e(feature.title)}: schermata reale non disponibile"><strong>Anteprima in preparazione</strong></div></figure>`;
  return `<figure class="desktop-feature__visual app-frame"><div class="app-frame__bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="screenshot-image" data-screenshot src="${e(image.src)}" alt="${e(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async"><figcaption class="media-caption">${e(image.caption)}</figcaption></figure>`;
}
export function renderDesktopOverview(extras = {}) {
  return `<section class="section desktop-story" id="desktop" aria-labelledby="desktop-title">
    <div class="container" id="demo">
      <header class="desktop-story__intro"><h2 id="desktop-title">Il gestionale, area per area.</h2><p>Schermate reali e spiegazioni concrete, nello stesso percorso. Scorri per vedere come si organizza il lavoro del Trainer.</p></header>
      <nav class="desktop-story__index" aria-label="Aree del gestionale">${desktopFeatures.map(feature => `<a href="${featureHref(feature)}">${e(feature.title)}</a>`).join('')}</nav>
      ${desktopFeatures.map(feature => `<article class="desktop-chapter" id="desktop-${e(feature.slug)}" aria-labelledby="desktop-${e(feature.slug)}-title">
        <header class="desktop-chapter__heading"><span class="desktop-chapter__number" aria-label="Area ${feature.order} di ${desktopFeatures.length}">${feature.order} / ${desktopFeatures.length}</span><h3 id="desktop-${e(feature.slug)}-title">${e(feature.title)}</h3><p>${e(feature.subtitle)}</p></header>
        ${featureFigure(feature)}
        <div class="desktop-chapter__body">
          <p class="desktop-chapter__lead">${e(feature.longDescription)}</p>
          <section class="desktop-chapter__purpose"><h4>A cosa serve</h4><p>${e(feature.purpose)}</p></section>
          <section class="desktop-chapter__actions"><h4>Cosa puoi fare</h4><ul>${feature.actions.map(action => `<li>${e(action)}</li>`).join('')}</ul></section>
          <section class="desktop-chapter__capabilities"><h4>Dentro ${e(feature.title)}</h4>${feature.capabilities.map(capability => `<div><h5>${e(capability.title)}</h5><p>${e(capability.text)}</p></div>`).join('')}</section>
          ${feature.screenshots.map(image => featureFigure(feature, image)).join('')}
          <section class="desktop-chapter__workflow"><h4>Nel lavoro di ogni giorno</h4><ol>${feature.workflow.map(step => `<li>${e(step)}</li>`).join('')}</ol></section>
          ${extras[feature.slug] ? `<section class="desktop-chapter__extras"><h4>Altri dettagli</h4>${extras[feature.slug]}</section>` : ''}
        </div>
      </article>`).join('')}
    </div>
  </section>`;
}
