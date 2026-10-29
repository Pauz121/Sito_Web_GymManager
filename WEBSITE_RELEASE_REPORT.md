# GymManager Website — release preparation, 26 ottobre 2026

> Historical publication checkpoint c7aa6cc. The Trainer presentation described below was subsequently replaced locally by the five-screen scroll showcase. See TRAINER_SHOWCASE_REPORT.md for current implementation and tests. That subsequent task has NOT been committed/pushed/deployed; the pre-existing user-modified recording is preserved and excluded from current public output.

## Risultato e confini

Evoluzione del sito esistente, non ricostruzione. Cinque pagine statiche HTML/CSS/JavaScript vanilla, senza package manager, dipendenze, framework o lockfile. Nessuna modifica ai sorgenti Desktop/Trainer iOS/IOS_Client, al database, a Supabase o ai workflow applicativi. Nuovo repository pubblico dedicato: Pauz121/Sito_Web_GymManager, main, preesistente e vuoto alla verifica iniziale.

Il video iOS Trainer completa la presentazione: Hero → tre estratti Desktop → valore/funzionalità → panoramica iOS Trainer → workflow/ecosistema/gallery → download. Le feature esistenti e le tre applicazioni restano distinte. Nessun prezzo, ecommerce, tracking, testimonianza inventata o claim di pubblicazione App Store.

## Audit e decisioni

- Sito buildless con preparatore allowlist già funzionante, cinque documenti reali e routing tramite cartelle: riutilizzato.
- Identità esistente warm-neutral/charcoal/rosso, componenti e font conservati. Nessun redesign o libreria di player.
- Video verticale: testo affiancato al player da tablet/desktop, stack testo→player sotto768px. Cornice esterna, nessun notch o crop.
- Player nativo, seek/pausa/fullscreen dove supportato; pulsante esplicito di riavvio porta il player in vista e gli assegna focus prima di avviarlo.
- Nessun autoplay; preload=none. Pausa quando il player lascia il viewport o la pagina diventa nascosta; nessuna ripresa automatica. Ricontrollo geometrico evita che una vecchia notifica dell’observer annulli un riavvio appena richiesto.
- Nome accessibile, didascalia Trainer≠Client, copia comprensibile senza video e descrizione equivalente espandibile.
- Privacy/Supporto approvati preservati byte-per-byte: banner bozza, noindex e contatti Paolino Bottiglieri / Paolinob2@libero.it. Dominio HTTPS ufficiale MISSING e blocker App Store OPEN.

## Media reale

SOURCE VIDEO: assets/source/Video app IOS_Trainer.mp4 (locale, escluso dal repository).
Originale: 9.643.583byte /88,766735s /384×832 /H.264 /nominale60fps,medio45,64fps; AAC stereo con mean/max-91dB.
SHA256 originale: cf2f1f8d8b53e8209c60ca8ad39c97bfebf16331b8f4943b7d2395dcebb7d81e; invariato dopo elaborazione.

Candidati automatici: 00:03,00:13,00:23,00:33,00:43,00:53,01:03,01:13,01:23.
Contact sheet locale9candidati più storyboard30frame e controllo finale01:27. Profili visibili identificati esplicitamente DEMO, email demo e Trainer Demo. Frame in transizione/sheet/recorder/loading o poco rappresentativi esclusi dal poster.
SELECTED POSTER TIMESTAMP:00:23.
POSTER: assets/screenshots/ios-trainer-poster.webp,384×832,scheda sintetica Giulio Bianchi DEMO.
WEB VIDEO: assets/videos/ios-trainer-overview-web.mp4.
OPTIMIZED SIZE:4.791.248byte, riduzione circa50,3%.
WEB DURATION:88,766016s.
VIDEO CODEC:H.264/yuv420p30fps,fast-start.
AUDIO:REMOVED.
Originale preservato; nessun upscaling né alterazione dell’interfaccia. La registrazione completa conserva normali interazioni e overlay transitori presenti nel file fornito; il poster è pulito. Build senza source/FFmpeg, riproducibilità locale via scripts/prepare-trainer-video.mjs e manifest.

## Skills realmente lette e applicate

|Skill|Finding/principio|Decisione Codex|Implementato / motivo|
|---|---|---|---|
|UI/UX Pro Max|Ricerca ux mirata: click-to-play, controllo utente, pausa offscreen, alternative testuali.|ACCEPTED per il risultato Web pertinente; il primo risultato carousel non impone un carousel.|YES: video su richiesta e controlli nativi.|
|interface-design|La skill esclude espressamente landing/marketing; utili solo riuso token e primitive native.|MODIFIED: niente dashboard, nuova palette o design-system duplicato.|YES solo i principi compatibili.|
|Impeccable|Polish preserva il mondo visivo esistente; verificare layout/contrasto e media reali.|ACCEPTED: cornice esterna e composizione responsive, niente redesign o effetti gratuiti.|YES; screenshot reali desktop/mobile.|
|ux-heuristics + WCAG checklist|Controllo, riconoscibilità, tastiera, equivalenza del video e visibilità dello stato.|ACCEPTED a scope: player nativo, descrizione e focus; nessuna certificazione/score empirico inventato.|YES; verifica browser e fonte.|
|Sites|Riutilizzo checkout statico e build/preview locale; output solo pubblicabile.|MODIFIED per destinazione esplicita Render: nessuna registrazione/deploy Sites.|YES build/allowlist/preview, hosting escluso.|

Antigravity: tentativo reale GYM-WEBSITE-TRAINER-20261026-001, analysis-only, FAILED(exit1/providerERROR), output non utilizzabile e file modificati NONE. Codex REJECTED, fallback opzionale consentito. Nessuna finta review né delega Git/deploy.

## Verifiche

- node scripts/validate-site.mjs: PASS5pagine, link/ancore/asset/metadata, h1unico/IDunici, no placeholder/tracking.
- node scripts/prepare-public.mjs: PASS28file, inclusi poster/videoottimizzato; originali/QA/script/report/config/handoff esclusi.
- node --test scripts/site.test.mjs scripts/legal.test.mjs scripts/trainer-video.test.mjs:24/24PASS,nessuno skip.
- Media: ffprobe/volumedetect, H264/noaudio/30fps/risoluzione/durata/fast-start/hash e budget5MB del nuovo video verificati. Le tre clip precedenti mantengono il proprio budget e test originari.
- node --check: PASS per JavaScript del sito e script selezionati. Lint dedicato/typecheck:NOT APPLICABLE, nessuna configurazione TypeScript/ESLint introdotta.
- HTTP locale:PASS pagine e redirect308, MIME, HEAD, range206/416, originale/source/config/QA/handoff non esposti.
- Browser:20combinazioni5pagine×375/768/1024/1440senza overflow; bozze visibili; player rapporto384/832 e stackingmobile corretti. Menu mobile apertura/Escape e focus visibile verificati.
- Browser video: riproduzione effettiva readyState4/durata88,766016; pausa tastiera e seek, riavvio a0 verificati. Nessun autoplay iniziale.
- Ambiente locale di esecuzione:Node20.20.2Windows; Render Node24.22.1 dichiarato e non eseguito su Render in questa task.
- Lighthouse, VoiceOver/dispositivi fisici e deploy pubblico:NOT RUN. Non è una certificazione WCAG.

Evidenze locali in .qa/trainer-video, mai nel repository pubblico. Il controllo HTTP locale non sostituisce la verifica dei redirect/media sul vero host Render.

## Repository e pre-commit

Da committare: pagine, soli asset pubblici referenziati, due manifest riproducibili, build/test/preview/media scripts propri del sito, README, policy progetto, questo report, .gitignore, .node-version e render.yaml.
Esclusi: source MP4 e upload/img, .qa, dist, log, segreti/.env, handoff locale, applicazioni, orchestratore, screenshot storico non usato e script storico di acquisizione dell’app con percorsi personali.
dist è generato durante la build, NON committato. Nessun token/browser secret necessario. Prima di commit/push: verificare manifest staged, scansione secret/percorso personale e git diff --cached --check.

## Render preparation (docs ufficiali correnti)

SERVICE TYPE:Static Site.
REPOSITORY:Sito_Web_GymManager.
BRANCH:main.
ROOT DIRECTORY:root repository.
BUILD COMMAND:node scripts/validate-site.mjs && node scripts/prepare-public.mjs.
PUBLISH DIRECTORY:dist.
NODE:24.22.1 da .node-version.
APP ENVIRONMENT VARIABLES:NONE.
BUILD OPTION:SKIP_INSTALL_DEPS=true, non segreto.
SPA REWRITE:NONE. Redirect solo/privacy→/privacy/ e/support→/support/.
AUTO DEPLOY:OFF.
DEPLOYED:NO.
PUBLIC URL:NONE, non inventato.

Fonti: [Static Sites](https://render.com/docs/static-sites), [Blueprint](https://render.com/docs/blueprint-spec), [Node](https://render.com/docs/node-version), [Routing](https://render.com/docs/redirects-rewrites). Configurazione verificata rispetto alle istruzioni; nessun servizio Render creato o Blueprint applicato.

## Next exact step

Dopo il push GitHub autorizzato, collegare il repository a Render con le impostazioni sopra SOLO quando il titolare autorizza il vero deploy; verificare poi HTTPS/route/video/download pubblici. Il push non è un deploy. URL definitivi e contenuti legali finali richiedono ancora approvazione.
