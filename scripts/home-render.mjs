import { desktopFeatures } from '../content/desktop-features.mjs';
import { escapeHtml as e, featureFigure } from './desktop-render.mjs';
import { siteFeatures } from './site-config.mjs';

export const homeDesktopSlugs = ['dashboard','clienti','schede-allenamento','alimentazione','progressi','agenda'];
// Existing real screenshots only. The mobile viewport reveals a focus region;
// the original remains available through the existing image dialog.
function storyVisual(html) {
  return html.replace(/(<img\b[^>]*class="screenshot-image"[^>]*>)/, '<div class="story-screen-focus">$1</div>');
}
export function renderScrollStory({ id, title, description, slides, cta, className = '', accessory = '' }) {
  return '<section class="section scroll-story ' + className + '" id="' + id + '" aria-labelledby="' + id + '-heading" data-scroll-story>' +
    '<div class="story-intro container"><header class="story-heading"><h2 id="' + id + '-heading">' + title + '</h2><p>' + description + '</p></header></div><div class="story-pin container">' +
    accessory + '<div class="story-window"><div class="story-track" data-story-track>' +
    slides.map((slide,index) => '<article class="story-slide" data-story-slide aria-label="' + e(slide.label) + '">' +
      slide.visual + '<div class="story-copy"><h3>' + e(slide.title) + '</h3><p>' + e(slide.description) + '</p></div></article>').join('') +
    '</div></div><div class="story-controls"><span class="story-counter" data-story-counter aria-hidden="true">01 / ' + String(slides.length).padStart(2,'0') +
    '</span><nav class="story-steps" aria-label="Esplora questa storia">' +
    slides.map((slide,index) => '<button type="button" data-story-go="' + index + '" aria-label="Mostra ' + e(slide.label) + '">' + String(index+1).padStart(2,'0') + '</button>').join('') +
    '</nav><a class="text-link" href="' + cta.href + '">' + cta.text + '</a></div></div></section>';
}

export function renderHomeClient() {
  return `<section class="section client-experience" id="ios-client" aria-labelledby="client-preview-title"><div class="container client-experience__layout">
    <div class="client-experience__copy"><h2 id="client-preview-title">Il percorso continua.<br>Dalla parte del cliente.</h2><p>Tu prepari il lavoro. Il cliente collegato ritrova i contenuti pubblicati per lui, in un’app nativa distinta dagli strumenti del Trainer.</p>
      <dl class="client-experience__topics"><div><dt>Allenamento</dt><dd>La scheda e le indicazioni da consultare durante la sessione.</dd></div><div><dt>Nutrizione</dt><dd>Giornate, pasti e quantità del proprio piano.</dd></div><div><dt>Progressi</dt><dd>Le rilevazioni disponibili, nel contesto del proprio percorso.</dd></div></dl>
      <a class="button button--secondary" href="app-client/">Approfondisci l’app Client</a>
    </div><figure class="client-experience__identity"><div class="client-identity-phone"><img src="assets/brand/client-logo.webp" alt="Icona originale FitManager del progetto iOS Client" width="256" height="256" loading="lazy" decoding="async"><strong>App Client</strong><span>In validazione</span><p>Anteprima in preparazione.<br>Qui arriveranno le schermate reali.</p></div><figcaption>Identità originale dell’app Client, non una schermata del prodotto. Nessuna disponibilità pubblica o data di rilascio promessa.</figcaption></figure>
  </div></section>`;
}

export function renderHomeEcosystem({ includeClient = siteFeatures.clientMarketing } = {}) {
  const workout = desktopFeatures.find(item=>item.slug==='schede-allenamento');
  const desktop = '<div class="ecosystem-visual ecosystem-visual--desktop">' + storyVisual(featureFigure(workout)) + '</div>';
  const trainer = '<figure class="ecosystem-visual"><div class="ecosystem-phone"><img data-screenshot src="assets/screenshots/ios-trainer-workout.webp" alt="Schermata reale della scheda del cliente DEMO nell’app iOS Trainer" width="400" height="816" loading="lazy" decoding="async"></div><figcaption class="media-caption">App Trainer: schermata reale, solo dati DEMO.</figcaption></figure>';
  const client = '<figure class="ecosystem-visual"><div class="ecosystem-client"><img src="assets/brand/client-logo.webp" alt="Icona originale dell’app Client FitManager" width="256" height="256" loading="lazy" decoding="async"><strong>App Client</strong><span>Schermata in preparazione</span></div><figcaption class="media-caption">Identità del prodotto Client, non una schermata simulata.</figcaption></figure>';
  const identities = '<div class="ecosystem-connected' + (includeClient ? '' : ' ecosystem-connected--trainer') + '"><div><img src="assets/brand/gymmanager-logo.webp" alt="Logo originale GymManager Desktop" width="48" height="48" loading="lazy"><strong>Desktop</strong><span>Prepara e assegna</span></div><div><img src="assets/brand/gymmanager-logo.webp" alt="Logo originale GymManager Trainer" width="48" height="48" loading="lazy"><strong>Trainer iOS</strong><span>Consulta in mobilità</span></div>' + (includeClient ? '<div><img src="assets/brand/client-logo.webp" alt="Icona originale FitManager Client" width="48" height="48" loading="lazy"><strong>Client iOS</strong><span>Segue il proprio piano</span></div>' : '') + '</div>';
  return renderScrollStory({
    id:'ecosistema',className:'ecosystem-story',title:includeClient ? 'Lo stesso programma. Tre modi di usarlo.' : 'Il tuo lavoro, dal Desktop all’iPhone.',
    description:includeClient ? 'Il Desktop è il centro operativo. La companion Trainer mantiene il contesto in mobilità; il Cliente collegato consulta ciò che è pubblicato per lui. Accessi e ruoli distinti, non un inoltro manuale da telefono a telefono.' : 'Prepara e organizza il lavoro nel Desktop. Con l’app Trainer ritrovi il contesto dei tuoi clienti anche quando sei fuori studio, con lo stesso account GymManager.',
    accessory:'<div class="ecosystem-transfer" aria-hidden="true"><div class="ecosystem-transfer__nodes"><span>Desktop</span><span>Trainer iOS</span>' + (includeClient ? '<span>Client iOS</span>' : '') + '</div><div class="ecosystem-transfer__tile">Scheda assegnata</div></div>',
    slides:[
      {label:'Desktop: prepara e assegna',visual:desktop,title:'Il programma nasce nel Desktop.',description:'Organizza sessioni, esercizi e indicazioni, poi assegna la copia al cliente. Il modello riutilizzabile rimane distinto dal suo piano.'},
      {label:'Trainer: consulta in mobilità',visual:trainer,title:'Il contesto ti segue, anche fuori studio.',description:'La companion Trainer permette di consultare la scheda e le indicazioni del cliente senza essere davanti al computer.'},
      ...(includeClient ? [{label:'Client: consulta il piano pubblicato',visual:client,title:'Al cliente, il piano che gli è dedicato.',description:'L’account collegato accede ai propri contenuti pubblicati e validi per il periodo previsto. Non alle schede degli altri clienti.'}] : []),
      {label:'Ecosistema: strumenti collegati',visual:'<div class="ecosystem-final">'+identities+'<p>' + (includeClient ? 'Un programma assegnato, accessi distinti.' : 'Desktop e app Trainer, lo stesso account.') + '</p></div>',title:'Il percorso resta uno. Gli strumenti cambiano.',description:includeClient ? 'La rappresentazione racconta i ruoli del prodotto, non una sincronizzazione istantanea garantita di ogni dato. La vista Client attende immagini reali.' : 'Il Desktop resta il centro operativo; l’app Trainer ne accompagna l’uso in mobilità. La disponibilità dei contenuti dipende dalle funzioni utilizzate: non è una promessa di sincronizzazione istantanea di ogni dato.'}
    ],cta:{href:'desktop/',text:'Scopri il centro operativo'}
  });
}
export function renderHomeDesktopStory() {
  return renderScrollStory({
    id:'desktop', title:'Il tuo lavoro prende forma.', description:'Dalla prima visione della giornata al percorso della persona. Scorri per entrare nel gestionale: schermate reali, solo dati DEMO.',
    slides:homeDesktopSlugs.map(slug => {
      const feature=desktopFeatures.find(item=>item.slug===slug);
      const ratio=feature.heroImage.width/feature.heroImage.height;
      const visual=storyVisual(featureFigure(feature)).replace('<figure ', '<figure style="--story-aspect: ' + ratio + '" ');
      return { label:feature.title, visual, title:feature.subtitle, description:feature.shortDescription };
    }),
    cta:{href:'desktop/',text:'Approfondisci il Desktop'}
  });
}
