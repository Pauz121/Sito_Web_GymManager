# GymManager — sito pubblico

## Pubblicazione corrente — 29 ottobre 2026

Destinazione verificata nel dashboard: Worker Cloudflare esistente `gym-manager`, repository `Pauz121/Sito_Web_GymManager`, branch production `main`, deploy automatico tramite `npx wrangler deploy`. URL HTTPS: https://gym-manager.paolinob2.workers.dev/ . Nessun nuovo progetto, dominio o segreto.

`wrangler.jsonc` esegue la build già prevista (`node scripts/validate-site.mjs && node scripts/prepare-public.mjs`) e pubblica **solo `dist`**, con HTML directory routing e 404 reali. La precedente autodetection della radice non deve essere usata: non genera le pagine e può esporre sorgenti/documentazione. `render.yaml` resta una preparazione storica, non il deployment corrente. [Configurazione ufficiale Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/).

Le route pubbliche sono sei: `/`, `/desktop/`, `/app-trainer/`, `/download/`, `/privacy/`, `/support/`, più dieci alias compatibili. La Home più recente mantiene Hero/Desktop/Trainer e passa direttamente al workflow/ecosistema Desktop–Trainer e alla CTA finale.

App Client è temporaneamente esclusa da build, navigazione, Home e asset pubblici con `scripts/site-config.mjs` (`clientMarketing: false`). `/app-client` e varianti rispondono 404. Renderer, registro originale, icona e CSS rimangono recuperabili: riabilitare la flag solo dopo autorizzazione e verifica del prodotto. Le descrizioni Client in Privacy/Supporto sono informative sui dati, non inviti al download.

Privacy/Supporto non hanno badge, titoli o metadata di bozza. Contatti approvati invariati; periodi di conservazione, basi giuridiche e dettagli non definiti restano dichiarati tali, senza inventare valori. La pubblicazione non certifica completezza legale o disponibilità App Store.

Test correnti: aggiungere `scripts/publication.test.mjs` al comando Node sotto. Originali/video utente, `.qa`, catture, `dist` e handoff restano esclusi dal commit. Il video utente locale modificato non viene pubblicato né sovrascritto. Le sezioni successive documentano anche le fasi storiche: in caso di conflitto prevale questa disposizione corrente.

## Mobile parity — aggiornamento locale del 29 ottobre 2026

Desktop, Trainer ed Ecosistema mantengono ora le storie controllate dallo scroll verticale anche su telefono e tablet. Hero, contenuti, percorsi e immagini originali restano quelli approvati. Sui layout compatti le slide Desktop/Ecosistema si assestano sulla schermata corrente con una breve transizione orizzontale; sul Desktop resta il movimento continuo. I controlli numerati sono facoltativi. Nessun listener wheel/touch, scroll lock di pagina o libreria aggiunta.

Modalità: mobile sotto768px, tablet768–1023px, Desktop da1024px; altezza sotto520px in landscape usa una composizione corta. Il Trainer usa la composizione compatta anche sotto650px di altezza. Il breakpoint della navbar resta768px. Le altezze dei media usano `svh`; il controller misura lo spazio effettivo e ricalcola dopo resize/contenuti caricati. Reduced motion, assenza JS, errore media e contenuto realmente più alto dello spazio disponibile mantengono la sequenza leggibile completa. La sola larghezza non disattiva più le storie.

Su telefono le schermate Desktop mostrano una regione dell'immagine reale; “Ingrandisci” apre l'originale completo con scorrimento nativo nel dialog e chiusura accessibile. Il menu gestisce Escape, ritorno del focus e navigazione Back. App Client resta esclusa. Stato, matrice11viewport, limiti dei test e file modificati: [MOBILE_EXPERIENCE_PARITY_REPORT.md](MOBILE_EXPERIENCE_PARITY_REPORT.md). Dopo il checkpoint locale l'utente ha autorizzato la pubblicazione tramite il flusso GitHub/Cloudflare esistente.

HTML/CSS/JavaScript vanilla, generazione statica Node senza dipendenze npm. Un progetto, una build, una dist e un solo deployment/domain. Nessun ecommerce, prezzo o tracking; nessuna modifica alle applicazioni.

## Build e unica anteprima

~~~sh
node scripts/validate-site.mjs
node scripts/prepare-public.mjs
node scripts/serve-site.mjs --public
~~~

http://127.0.0.1:8765/. Il server serve SEMPRE dist; --public resta compatibile. Non aprire l’HTML sorgente come sito finito e non pubblicare la root. Node24.x raccomandato (.node-version per Render); test locali su Node20.20.2. Nessuna installazione npm.

## Routing

| Pagina | URL | Output |
| --- | --- | --- |
| Home | / | index.html |
| Desktop | /desktop/ | desktop/index.html |
| Trainer iOS | /app-trainer/ | app-trainer/index.html |
| Client iOS | /app-client/ | app-client/index.html |
| Download | /download/ | download/index.html |
| Privacy, bozza | /privacy/ | privacy/index.html |
| Supporto, bozza | /support/ | support/index.html |

Gli URL senza slash vengono normalizzati. Ogni pagina è reale e prerenderizzata: apertura diretta e refresh non richiedono fallback SPA. È navigazione HTML nativa perché lo stack originale non era React/SPA. Header, footer e metadati vengono generati una sola volta da scripts/site-layout.mjs, con registro centrale delle sette route.

Dieci indirizzi precedenti (.html e otto aree Desktop) sono alias di compatibilità verso le nuove destinazioni pertinenti. Non sono siti diversi. Unknown/private paths restano404.

## Home Phase2

Sei blocchi: Hero approvato, Desktop, Trainer esistente, Client, workflow/ecosistema, CTA Download; poi footer. Nessun approfondimento completo, modulo installer o testo legale incorporato nella Home.

Desktop: sei schermate vere (Dashboard, Clienti, Schede, Alimentazione, Progressi, Agenda). Scroll verticale normale → track orizzontale, senza listener wheel o scroll-lock. Intro fuori dalla parte sticky per lasciare spazio al prodotto. Piccoli controlli accessibili non sono necessari per scorrere. Trainer mantiene DOM/controller/5schermate precedenti. Client usa solo l’icona originale FitManager: telefono dichiarato in preparazione, NON schermata finta.

Ecosistema: Desktop prepara/assegna, Trainer consulta in mobilità, Client collegato accede ai propri contenuti pubblicati; stato finale a ruoli connessi. Il token “Scheda assegnata” è una rappresentazione del programma, non un protocollo di inoltro fra telefoni né promessa di sincronizzazione immediata.

Controller home-story.js condiviso per le due storie, un rAF per burst di scroll, no librerie/timer. Il precedente fallback sotto960px/700px è stato sostituito dalle modalità responsive documentate sopra. Movimento ridotto, media failure o spazio effettivamente insufficiente: contenuto verticale completo. No-JS: default verticale. Inactive slides inert soltanto nell’enhancement; controlli con area44px, testo/immagini non dipendono dal solo colore.

## Sorgenti

- index.html: corpo Home e marker Desktop/Client/Ecosistema.
- scripts/site-layout.mjs: registro pagine, head/header/footer comuni.
- scripts/site-pages.mjs: assemblaggio e rebase sicuro URL; alias.
- scripts/home-render.mjs: sezioni Home, dati Desktop riusati.
- content/desktop-features.mjs + scripts/desktop-render.mjs: otto aree e contenuto ricco /desktop.
- funzionalita.html, download.html, privacy/index.html, support/index.html: input/storico riutilizzati; il vecchio chrome sorgente non è quello pubblico.
- assets/css/styles.css e desktop.css: identità esistente; home-story.css solo Home.
- assets/js/app-showcase.js: Trainer con la medesima sequenza/copy e modalità compatta; home-story.js: Desktop/ecosistema; site.js: menu, zoom/dialog/focus/reveal; download.js: latest stable.

Nuove route: aggiungere un record nel registro e un renderer di corpo, mai un nuovo server. Non modificare dist a mano. Il build allowlist rifiuta file inattesi: ispezionare e archiviare recuperabilmente, non cancellare indiscriminatamente.

## Media e verità prodotto

Desktop8schermate principali disponibili, inclusa Agenda reale utente1416×881, WebP lossless67340byte, RGBMD5 identico281725bbc5a1b9afde479d1ec3172590. Manifest/sidecar di provenienza non pubblici. Trainer5WebP400×816 (1,36,44,52,75s),135362byte totali, estratti dal video reale DEMO. Client: icona originale256px8160byte con provenance, nessuno screenshot.

Video modificato dall’utente IMMUTATO:13004770byte, SHAC82A059B28CB2FEACE44B5ED0CD7416255C08D3F1E83AD84FCF866D7B6253896. Non rigenerarlo. Originali, video storici e QA esclusi da dist.

## Download e bozze

Home legge solo versione; /download possiede installer/guida/fallback. Una richiesta per documento a https://api.github.com/repos/Pauz121/GymManager_relase/releases/latest; nessun token, no draft/prerelease/.sig/.json. Preferenza setup.exe poiMSI. Errore API → pulsante disabilitato+release ufficiale.

Privacy/Supporto complete ma BOZZE, noindex limitato a quelle route. Titolare/contatto approvati conservati. Nessun dominio definitivo inventato; blocker AppStore URL ANCORA APERTO. Nessuna SecurityPolicy distinta inventata.

## Test

~~~sh
node scripts/validate-site.mjs
node scripts/prepare-public.mjs
node --test scripts/site.test.mjs scripts/legal.test.mjs scripts/trainer-showcase.test.mjs scripts/desktop-showcase.test.mjs scripts/home-story.test.mjs
node scripts/test-http.mjs
~~~

HTTP con server attivo. FFprobe necessario ai test media. Test source/controller non equivalgono a VoiceOver/iPhone/Safari/WCAG o benchmark performance. Nuovi script senza dipendenze. Testare anche reverse, deep entry, resize, zoom/Escape/focus e responsive375/768/1024/1366/1440.

## Render — preparazione, non deployment

Un solo Static Site, build node scripts/validate-site.mjs && node scripts/prepare-public.mjs; publish ./dist; repo Pauz121/Sito_Web_GymManager main; root vuota; autoDeploy OFF. Nessuna variabile segreta/startCommand. Config render.yaml con redirect slash per le sei directory; no catch-all /* → /index.html. Documenti fisici per ciascuna route. Riferimento ufficiale verificato: [redirect/rewrite Render](https://render.com/docs/redirects-rewrites). Un deployment, un URL base; pubblico NON ancora verificato.

## Report e continuità

ARCHITECTURE_CORRECTION_REPORT.md e HOME_EXPERIENCE_PHASE2_REPORT.md sono correnti. ONEPAGE_IMPLEMENTATION_REPORT.md è storico/superseduto, non la direzione attuale. Gli altri report conservano le prove precedenti. CODEX_HANDOFF locale conserva storia/checkpoint. DESIGN.md/design.json non riscritti: snapshot storico; brief attuale distingue estensione e drift preesistente.

## Sicurezza e prossimo lavoro

Nessun commit/push/deploy/DB. Non committare segreti, .env*, certificati, auth, originali, log, .qa, dist, node_modules o handoff. Pubblicare solo dist. Prossimo passo dopo review/approvazione Home: sviluppare /desktop dettagliata; /app-trainer, /app-client e /download restano parcheggiate.
