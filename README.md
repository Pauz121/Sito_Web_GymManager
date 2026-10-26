# GymManager Website

Sito pubblico di presentazione di GymManager: HTML, CSS e JavaScript vanilla, senza framework, dipendenze npm, ecommerce, prezzi o tracking. Repository dedicato al sito; le tre applicazioni rimangono separate.

## Sviluppo e build

Installazione: **non necessaria** (nessun package.json o lockfile).
Node 24.x raccomandato; Render usa la versione dichiarata in .node-version.

~~~sh
node scripts/validate-site.mjs
node scripts/prepare-public.mjs
node scripts/serve-site.mjs --public
~~~

Anteprima: http://127.0.0.1:8765/. Build di produzione: **node scripts/validate-site.mjs && node scripts/prepare-public.mjs**.
Pubblicare esclusivamente **dist/**, mai la root del repository. Il preparatore rifiuta file inattesi già presenti in dist; non cancella file automaticamente.

## Pagine e struttura

- / — Home: prodotto, tre demo Desktop, funzionalità, panoramica iOS Trainer, workflow, ecosistema e gallery.
- /funzionalita.html — guida alle funzioni reali.
- /download.html — ultima release stabile e installer Windows.
- /privacy/ e /support/ — bozze pubbliche con identità e contatti approvati.
- assets/css, assets/js, assets/screenshots, assets/videos — solo media/UI pubblicabili.
- scripts — build/preview/validazione e preparazione media.
- render.yaml — configurazione riproducibile **non ancora applicata**.
- WEBSITE_RELEASE_REPORT.md — decisioni, media e verifiche.

## Video iOS Trainer

La Home contiene una registrazione reale dell’app **iOS Trainer**, non dell’app Client.
Riproduzione su richiesta, pausa/seek/fullscreen nativi ove supportati, riavvio, pausa fuori viewport e quando la pagina viene nascosta. Nessun autoplay né audio; preload=none, poster e descrizione testuale equivalente. Cornice esterna, nessun notch/crop o UI fittizia.

|Elemento|Valore|
|---|---|
|Source locale (NON incluso)|assets/source/Video app IOS_Trainer.mp4|
|Originale|9.643.583 byte; 88,766735 s; 384×832; H.264; nominale60fps/medio45,64fps; AAC silenzioso(-91dB)|
|Poster selezionato|00:23 — scheda del cliente sintetico Giulio Bianchi DEMO, nessun popup/transizione|
|Poster|assets/screenshots/ios-trainer-poster.webp|
|Video web|assets/videos/ios-trainer-overview-web.mp4|
|Ottimizzato|4.791.248 byte; 88,766016 s; H.264/yuv420p30fps; fast-start; audio RIMOSSO|
|SHA-256 originale invariato|cf2f1f8d8b53e8209c60ca8ad39c97bfebf16331b8f4943b7d2395dcebb7d81e|

Nove candidati:3,13,23,33,43,53,63,73,83s. Controllati anche storyboard di30frame e profilo finale Trainer Demo. I frame con transizioni, calendario poco significativo, empty state o recorder/sheet temporanei non sono stati scelti come poster. L’originale non è stato modificato; la copia web conserva l’intera registrazione, comprese le interazioni native transitorie.

I derivati già versionati bastano alla build: **Render non richiede FFmpeg né l’originale**.
Per rigenerare localmente, fornire il source fuori Git e installare FFmpeg/FFprobe secondo il proprio ambiente:

~~~sh
node scripts/prepare-trainer-video.mjs
node scripts/prepare-trainer-video.mjs --poster-at=23
~~~

Il primo comando estrae candidati/contact sheet in .qa/trainer-video; il secondo rigenera solo i derivati dichiarati. La variabile opzionale TRAINER_VIDEO_SOURCE accetta un source locale alternativo; non è una variabile di deploy. Gli originali delle tre clip Desktop sono anch’essi esclusi. Non eseguire prepare-media senza quei file.

## Download sempre aggiornato

Il browser legge **https://api.github.com/repos/Pauz121/GymManager_relase/releases/latest**.
Nessun token. Draft/prerelease e asset tecnici vengono rifiutati; priorità al setup.exe Windows, poi MSI. Versione/data/URL non sono hardcoded. In caso di errore la CTA è disabilitata e compare un fallback alla release ufficiale.

## Test

~~~sh
node scripts/validate-site.mjs
node scripts/prepare-public.mjs
node --test scripts/site.test.mjs scripts/legal.test.mjs scripts/trainer-video.test.mjs
# Con il server attivo:
node scripts/test-http.mjs
~~~

FFprobe è necessario SOLO ai test media locali, non alla build Render. Lint configurato/typecheck: non applicabili; usare node --check per controllare la sintassi JavaScript. I test coprono asset reali, allowlist, privacy, codec/audio/fast-start, geometria, futura release/fallback e HTTP Range per il seek. Non equivalgono a certificazione WCAG o test su iPhone fisico.

## Render — preparazione, NON deploy

Repository: **Pauz121/Sito_Web_GymManager**, branch **main**, root directory vuota.
Service: **Static Site**, non Web Service.

|Impostazione|Valore|
|---|---|
|Build command|node scripts/validate-site.mjs && node scripts/prepare-public.mjs|
|Publish directory|dist|
|Node|24.22.1 da .node-version|
|Variabili applicative/segreti|NESSUNA|
|Installazione dipendenze|NESSUNA; SKIP_INSTALL_DEPS=true nel Blueprint|
|SPA catch-all|NESSUNO: cinque documenti HTML reali|
|Redirect|/privacy → /privacy/; /support → /support/|
|Auto deploy|OFF, da abilitare solo su decisione del titolare|
|Deploy eseguito|NO|

Collegare il repository da Render → New → Static Site e usare i valori sopra, oppure importare render.yaml come Blueprint **solo dopo autorizzazione al deploy**. Non aggiungere start command, framework, database o servizi a pagamento. Il nome del servizio non è una promessa di URL disponibile.

Riferimenti ufficiali verificati per questa configurazione:
[Static Sites](https://render.com/docs/static-sites), [Blueprint](https://render.com/docs/blueprint-spec),
[Node version](https://render.com/docs/node-version), [Redirects](https://render.com/docs/redirects-rewrites).
Dopo il vero deploy verificare HTTPS, /, /privacy, /support, video/range e download dal dominio assegnato.

## Privacy, supporto e sicurezza

Le due pagine mantengono il banner **“Bozza — sito ancora privo di dominio ufficiale definitivo”**, noindex e contatti approvati: Paolino Bottiglieri / Paolinob2@libero.it. Nessun URL definitivo, dato legale o periodo di conservazione inventato. I blocker App Store rimangono aperti.

Non committare .env*, credenziali, certificati, token, originali, .qa, log, dist, node_modules o CODEX_HANDOFF.md. Il repository pubblico contiene solo sito e strumenti propri del sito. Nessuna modifica applicativa o Supabase viene pubblicata da qui.
