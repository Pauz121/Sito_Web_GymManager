# App Trainer — scroll showcase, 26 ottobre 2026

> Checkpoint della task Trainer precedente. Il successivo percorso Desktop estende il sito a13documenti e39file pubblici; vedere DESKTOP_SHOWCASE_REPORT.md per lo stato corrente. Schermate/copy/componente Trainer restano preservati; il controller condiviso ora gestisce anche l’istanza Desktop. Nessuna nuova pubblicazione eseguita.

## Risultato

Modificato solo il sito autorevole `projects/Sito_Web_GymManager` e la continuità/orchestrazione pertinente. Cinque pagine conservate, stack HTML/CSS/JS vanilla, nessun pacchetto. Nessun codice applicativo, database, migration, deploy o nuovo push/commit.

- Copy Trainer concreto: gestione in mobilità, clienti, appuntamenti, schede e agenda; continuità con il Desktop, senza affermazioni su disponibilità pubblica non verificate.
- Video nel telefono sostituito da cinque schermate statiche reali, estratte automaticamente dalla registrazione locale con dati sintetici.
- Telefono sticky, una schermata attiva per volta, transizione discreta; scorrimento pagina nativo e scorciatoie da tastiera.
- App Trainer/App Client nella navbar delle cinque pagine, anche da Privacy/Supporto; stato attivo di sezione nella Home, pagina corrente conservata altrove.
- Logo GymManager autentico in dieci posizioni header/footer e favicon; vecchio SVG generico rimosso e recuperabile da Git. Non usato il diverso marchio Fit Manager dell’app Client.
- Destinazione App Client onesta, “In validazione”; componente già riutilizzabile, nessuno screenshot Client inventato.

## Componenti/file

`index.html`: introduzione, vantaggi, cinque step, telefono, collegamenti accessibili, destinazione Client.

`assets/js/app-showcase.js`: istanze indipendenti da markup/data attributes; regola pura `indexAtLine`, un solo aggiornamento per frame, listener passivo, gestione resize/deep-link/ritorno pagina, stato attivo e fallback. Non prende controllo dello scroll né del focus.

`assets/css/styles.css`: composizione sticky desktop/mobile, dimensioni realistiche senza crop, fallback inline, focus e controllo dimensione del dialog verticale. Regole esistenti del resto del sito conservate.

`assets/js/site.js`: riuso del dialog immagini con ritorno al controllo, rimozione dei soli controlli ormai inutilizzati del vecchio video Trainer; tre video Desktop e pausa su pagina nascosta preservati.

`funzionalita.html`, `download.html`, `privacy/index.html`, `support/index.html`: solo navbar e marchio/favicon. Nessuna modifica ai testi legali.

`assets/brand/gymmanager-logo.webp`, `assets/brand/favicon.png`: derivati ridimensionati del vero asset Trainer. `scripts/public-files.mjs` e `serve-site.mjs`: allowlist e MIME PNG. Nessun contenuto privato pubblicabile.

`scripts/trainer-showcase.test.mjs`: sostituisce gli assert del video Trainer non più mostrato. Suite download, legalità, clip Desktop e sicurezza mantenute. `scripts/test-http.mjs`, `site.test.mjs`, `README.md`, `AGENTS.md`: verifiche e istruzioni aggiornate. Vecchi report/helper/manifest video conservati come storia, non sorgente della sezione attuale.

## Media reali / privacy

|Schermata|Timestamp|File|
|---|---:|---|
|Home|1s|assets/screenshots/ios-trainer-home.webp|
|Calendario|36s|assets/screenshots/ios-trainer-calendar.webp|
|Clienti|44s|assets/screenshots/ios-trainer-clients.webp|
|Scheda|52s|assets/screenshots/ios-trainer-workout.webp|
|Agenda|75s|assets/screenshots/ios-trainer-agenda.webp|

400×816, WebP, totale135.362byte. Tutti ispezionati: Trainer Demo, nomi DEMO e contatti sintetici; nessun dato di clienti reali. Scartati frame con caricamento, filtro vuoto, sheet temporanei o transizioni. Trasparenze native delle tab bar conservate, nessuna UI ricostruita. Provenance/hash in `assets/trainer-showcase-manifest.json`, escluso dalla build pubblica.

Il video preesistente modificato dall’utente rimane byte-identico:13.004.770byte; SHA256 **c82a059b28cb2feace44b5ed0cd7416255c08d3f1e83ad84fcf866d7b6253896**. Non viene ripristinato, ricodificato o pubblicato in dist. Nessuna necessità di rieseguire il vecchio helper che lo sovrascriverebbe. Build precedente spostata recuperabilmente in `.qa/pre-showcase-dist-20261026`, non cancellata.

## Interazioni e accessibilità

L’ultimo step che raggiunge la linea di lettura seleziona la schermata corrispondente. La scelta non dipende dalla direzione precedente: funziona con scroll inverso e salti. Telefono e didascalia seguono lo stesso stato, link con aria-current; inattivi aria-hidden.

Telefono azionabile con tocco/Enter per ingrandire: dialog nativo già esistente, Escape e ritorno focus verificati nel browser. Nessuna notifica live a ogni scroll. Immagini con alt e dimensioni esplicite. Navbar e step restano link normali, non gesture-only.

Senza JS, con Reduce Motion o viewport alte ≤600px: immagini inline associate al testo, niente sticky o transizioni. La navbar mobile senza JS rimane visibile. Errore immagine disattiva enhancement e preserva lettura/fallback. Riduzione movimento e no-JS coperti a livello source/test; emulazione OS Reduce Motion e browser con JS realmente disattivato NON ESEGUITE. Viewport basso verificato realmente nel browser.

## Riutilizzo App Client

Titolo, descrizione, vantaggi, articoli e immagini sono contenuti nell’istanza `[data-app-showcase]`. Le chiavi collegano `[data-showcase-step]`, `[data-showcase-screen]`, `[data-showcase-link]`; ID anchor devono essere univoci. Duplicare la struttura con contenuti Client approvati, senza modificare l’algoritmo. Inserire le immagini in src HTML per inclusione nella build allowlisted. Documentazione operativa nel README; non servono nuovi framework.

## Skill e review

SKILL USED: Impeccable, lettura reale SKILL.md, animate, craft-floor, polish; contesto eseguito una volta.

RELEVANT PRINCIPLES: incumbent come autorità, una sola narrazione, movimento leggero con contenuto già leggibile, progressive enhancement, percorsi da tastiera, riduzione movimento, preservare identità e architettura.

FINDINGS: precedente video poco consultabile per singola funzione, marchio GM generico, nav priva delle destinazioni richieste; su mobile una schermata intera è piccola.

CODEX DECISION: ACCEPTED per sequenza/anchor/logo; MODIFIED per ingrandimento tramite dialog già esistente e fallback inline su viewport bassi, anziché scroll lock o nuove dipendenze. IMPLEMENTED: YES.

Detector finale eseguito UNA volta: exit1 con warning, NON dichiarato PASS. Review: quattro “buried raster” sono gli screenshot inattivi intenzionali, verificati attivi/leggibili dopo cambio step; non asset ornamentali nascosti. “Cramped section” non confermato visivamente: container laterali reali presenti. Font Inter/system, eyebrow/mini-status, glow e bordo laterale sono convenzioni preesistenti fuori da questa sezione: proposta di redesign REJECTED perché l’utente richiede di conservarle. Segnalazioni contrasto CTA finale/alcuni metadata preesistenti restano debito, non certificazione AA. Nuovi testi usano ink/ink-soft/accent-dark su paper e focus ad alto contrasto; nessun eyebrow aggiunto.

## Delega

Antigravity `GYM-WEBSITE-SCROLL-20261026-001`: tentativo read-only FAILED, exit1/provider ERROR, timeout autenticazione/DNS, risposta assente. Codex verification FAILED/REJECTED registrata; nessuna modifica delegata. Fallback Codex consentito dalla policy sito. Nessuna delega accettata o dichiarazione fittizia.

## Test e stato

- Validator cinque pagine, ID/anchor/metadata/assets/release strategy: PASS.
- Build allowlisted33file: PASS, niente registrazione Trainer completa, source/QA/handoff/script/report in output.
- Test Node29/29: PASS (contratti source, controller in test double, media reali, byte identity, download/futura release/fallback, legalità e scope). Non sono29test nativi o certificazione WCAG.
- HTTP pubblico: PASS pagine/redirect, MIME WebP/PNG/MP4, HEAD/Range206/416, esclusione privati e video Trainer non usato.
- Browser reale: cinque pagine×375/768/1024/1440px, tutti senza overflow orizzontale, logo caricato, entrambe le nuove voci. Controlli aggiuntivi800/900tablet,320×667,844×390: niente overflow; fallback inline nel viewport basso.
- Verificati scroll, step/link/deep link, immagini caricate/stato unico, menu mobile e navigazione Client, tastiera Enter/Escape/focus dialog. Console warning/error vuota al controllo.
- JavaScript syntax e git diff --check: PASS.
- Safari/iPhone fisico, VoiceOver, Lighthouse e verifica formale WCAG: NOT RUN.

## Limiti / pubblicazione

Nessun nuovo commit/push/deploy autorizzato o eseguito. HEAD precedente c7aa6cc resta invariato; video dirty preesistente protetto. Privacy/Supporto restano bozze e dominio/hosting definitivi mancanti. App Client necessita immagini reali prima della propria panoramica, non è un errore dello showcase. Next: review utente del risultato locale; eventuale pubblicazione richiede autorizzazione separata.
