# Desktop — panoramica e otto approfondimenti

> CHECKPOINT STORICO, superseduto dalla richiesta pagina unica. Stato corrente in ONEPAGE_IMPLEMENTATION_REPORT.md: tutti gli approfondimenti nello stesso index, Agenda reale ora presente, vecchi URL solo alias.

Stato locale al 26 ottobre 2026. Nessun nuovo commit, push, deploy o intervento sulle applicazioni/database.

## Desktop overview

Completata. La Home sostituisce il gruppo di video Desktop e la galleria scollegata con un percorso di schermate reali. Mantiene la cornice Desktop, la navigazione e l’identità calda/neutra, antracite e rossa già approvate. Il sito presenta il prodotto in modo pratico, non come manuale tecnico.

| Ordine | Area | Pagina statica generata | Anteprima |
|---|---|---|---|
| 1 | Dashboard | /desktop/dashboard/ | Reale |
| 2 | Clienti | /desktop/clienti/ | Reale |
| 3 | Allenamenti / Lezioni | /desktop/allenamenti/ | Reale |
| 4 | Agenda personale | /desktop/agenda/ | In preparazione |
| 5 | Schede allenamento | /desktop/schede-allenamento/ | Reale |
| 6 | Alimentazione | /desktop/alimentazione/ | Reale |
| 7 | Progressi | /desktop/progressi/ | Reale |
| 8 | Pagamenti | /desktop/pagamenti/ | Reale |

Tutte le otto pagine sono popolate: titolo/valore, hero, scopo, azioni reali, tre moduli descrittivi, workflow e precedente/panoramica/successiva. Non soltanto un template vuoto. Metadati specifici e un solo H1 per pagina. Link relativi compatibili con hosting in sottocartella; nessun dominio definitivo inventato.

## Componente e modello riutilizzabili

- `content/desktop-features.mjs`: unica fonte per id, slug, ordine, titolo, sottotitolo, descrizioni, scopo, heroImage/overviewImage, azioni, moduli, workflow, immagini supplementari e riferimenti di verifica. Ordine e pagine adiacenti derivati dalla stessa lista.
- `scripts/desktop-render.mjs`: template comune di panoramica e approfondimento; i contenuti testuali sono sottoposti a escaping HTML.
- `scripts/site-pages.mjs`: compila il marker della Home e genera otto HTML completi riutilizzando header/footer. Nessun router SPA o fetch del modello nel browser.
- `assets/js/app-showcase.js`: controller esistente esteso con variante Desktop circoscritta. Schermata, titolo, descrizione e destinazione Approfondisci hanno una sola selezione attiva.
- `assets/css/desktop.css`: finestra landscape, percorso editoriale e dettagli responsive, usando i token esistenti.
- Build/preview/validazione pubblicano 13 documenti e i soli asset referenziati: 39 file, zero video. Modello, script di sviluppo, manifest, documenti, originali e QA restano fuori da dist.

Per aggiungere una sezione: inserire un record nel modello, una vera immagine WebP con alt/dimensioni/didascalia oppure un pending esplicito, azioni/moduli/workflow verificati; aggiornare provenance, test dell’ordine e redirect hosting. Rigenerare dist, non modificare manualmente otto pagine. Procedura completa in README.

## Scroll e navigazione

Su viewport ampie la finestra resta sticky e lo scroll nativo seleziona una schermata alla volta. I link alle otto aree consentono anche un salto diretto. Niente autoplay, scroll hijacking o spostamento del focus allo scroll. Il pulsante sull’immagine apre il dialog nativo di ingrandimento esistente.

A 1024px o meno, con altezza fino a 600px, movimento ridotto o JavaScript assente, ogni passo espone immagine → testo → CTA nella normale pagina. Nessun piccolo monitor sticky sul mobile. Errori media ripristinano il percorso inline. Agenda ha un placeholder dichiarato, zoom disabilitato e Approfondisci funzionante.

## Screenshot reali e privacy

Sette immagini principali reali e due supplementari (Body Focus e piano alimentare). Nessuna immagine generata o schermata ricostruita in HTML. Nuove catture estratte automaticamente dalle registrazioni fornite:

| File | Sorgente | Timestamp | Dimensioni | Byte |
|---|---|---|---|---|
| desktop-dashboard.webp | Prima registrazione.mp4 | 0s | 1600×828 | 36512 |
| desktop-allenamenti.webp | Prima registrazione.mp4 | 86s | 1400×726 | 53532 |
| desktop-pagamenti.webp | Seconda registrazione.mp4 | 46s | 1600×820 | 52320 |

Clienti, Schede, Alimentazione e Progressi riutilizzano screenshot reali precedenti. Manifest: `assets/desktop-showcase-manifest.json`; tre sidecar documentano l’origine dei nuovi file. Sono state scartate transizioni/loading e immagini poco rappresentative. Solo account Trainer Demo e clienti esplicitamente DEMO; nessun dato personale reale identificato nelle immagini selezionate. Originali invariati.

**Immagine mancante: `assets/screenshots/desktop-agenda.webp`.** Serve la vera Agenda personale, non la sezione Note cliente: acquisire in Trainer Demo una vista app-only 1600×900 con priorità Alta/Media/Bassa e attività sintetiche aperte/completate; niente dati reali, popup o caricamenti. La pagina è già completa; rimane pendente soltanto quel media.

## Copy verificato sul prodotto

YES — confronto in sola lettura con Dashboard, ClientDetailPage, Calendar/TrainingCalendar, AgendaPage/AgendaList/AgendaTaskModal, Workouts/Assignment/Analysis, Nutrition, ClientProgressSection e Payments/ClientPaymentsSection. I riferimenti sono nel modello di sviluppo, non nel pubblico HTML. Non è una nuova validazione funzionale delle app.

Distinzioni conservate: lezioni ≠ editor programmi; Agenda ≠ Note cliente; modello ≠ copia assegnata; stime corporee ≠ misure diagnostiche; registro quote ≠ contabilità fiscale. Nessun nuovo claim AI, terapia, integrazione bancaria o automazione non dimostrata.

## Skill e review

Impeccable: contesto e direzione incumbent letti; principi applicati: brief prima di un redesign arbitrario, contenuto reale dominante, gerarchia editoriale, ritmo immagine/testo, scroll nativo, fallback responsive e accessibilità. Decisione Codex: ACCEPTED per gerarchia/fallback/controlli; MODIFIED per conservare esattamente stile e cornice approvati invece di introdurre una nuova identità, font o dipendenze. Nessuna composizione generata: l’utente ha scelto direttamente codice/stile esistente.

Il detector è stato eseguito una sola volta: warning, NON clean PASS. Immagini inattive nascoste sono intenzionali e verificate; debito estetico ereditato non giustifica un redesign globale. Review indipendente Codex in sola lettura: evidenze valide e requisiti/direzione accettati; un P2 materiale sul contrasto di label/focus nel CTA scuro. Corretto con #ff9daa già presente nelle superfici scure, testato contro entrambi gli estremi del gradiente (almeno 7,6:1), verificato nel browser con focus da tastiera. Il reviewer ha confermato RESOLVED / SHIP per quel solo finding, non una certificazione generale.

Sites: percorso locale applicato alla verifica finale di build e consegna. Principi pertinenti: riusare il checkout esistente, preservare brand/scope, pubblicare soltanto output statico esplicito, usare la preview locale e chiudere il server di QA. Decisione Codex: ACCEPTED per questo flusso locale; nessuna registrazione/sincronizzazione/hosting del servizio Sites e nessuna nuova pipeline di pubblicazione, perché la task non autorizza deploy.

Documentazione dello stile completata: `DESIGN.md` e `.impeccable/design.json` estraggono palette, font realmente dichiarati/fallback, geometrie, profondità, breakpoint e nove componenti esistenti. Codex ha letto entrambi i file e confrontato i valori con il CSS: ACCEPTED. Le rampe del pannello sono esplicitamente illustrative, non nuovi colori di produzione. I documenti non entrano nella build pubblica.

Antigravity/Gemini: tentativo advisory `GYM-WEBSITE-DESKTOP-20261026-001` FAILED, exit 1, provider ERROR/no response; nessuna task o modifica eseguita con successo. Fallback Codex consentito dalla policy del sito. Review indipendente e documentazione sono sub-agent Codex, non Gemini. Audit locale nell’orchestratore master; nessun segreto inviato.

## Test e limiti

- PASS: 41/41 test Node source/controller/media/regressione, inclusa la nuova verifica del contrasto CTA. Non sono 41 test funzionali su dispositivi.
- PASS: validator su 13 pagine, build allowlisted di 39 file, sintassi JavaScript e whitespace diff.
- PASS: sintassi di tutti i 17 file JavaScript, struttura delle otto sezioni del documento di design e parsing del sidecar schemaVersion 2.
- PASS: revisione finale del diff/scope e scansione di 37 file testuali modificati/nuovi: zero segreti riconoscibili ad alta affidabilità e zero file con percorsi personali di macchina. Non sostituisce una verifica manuale dei futuri file staged.
- PASS: HTTP su tutte le pagine, redirect con slash, MIME/HEAD/Range 206/416 delle immagini, 404 per route sconosciute e file privati/script/vecchi video.
- PASS: 52 combinazioni browser, 13 pagine × larghezze 375/768/1024/1440; niente overflow orizzontale, un H1, logo caricato e nessuna immagine visibile rotta. Ispezionata anche vista 1280×720.
- PASS: percorso precedente/successivo da tastiera, CTA Agenda, zoom Enter/Escape e ritorno del focus. Stati sincronizzati per tutti gli otto passi coperti dal controller testato.
- Preservato: contenuto markup della sezione Trainer equivalente al baseline di inizio task dopo normalizzazione line ending; immagini Trainer e video locale non alterati. Video protetto SHA256 `C82A059B28CB2FEACE44B5ED0CD7416255C08D3F1E83AD84FCF866D7B6253896`, 13004770 byte.
- Prove locali ignorate: `.impeccable/review/` e `.qa/desktop-showcase/browser-matrix.json`. Le catture full-page precedentemente validate restano valide; la ricattura finale fullPage è fallita nel provider browser, mentre viewport e prova focalizzata testo/focus sono riuscite. Nessun falso claim di ricattura completa.
- NOT RUN: Lighthouse, Safari/iPhone fisico, VoiceOver e certificazione WCAG formale. Reduce Motion del sistema/browser senza JS: branch source e test controllati verificati, non runtime di sistema certificato.

## File interessati

Home e navigazione delle cinque pagine sorgenti; CSS Desktop e due regole contrasto nello stile comune; controller showcase; modello/render/site-pages; preparatore, allowlist, validator, server e suite; redirect preparati in render.yaml; tre nuovi WebP/provenance; README, AGENTS, PRODUCT, documentazione di design/report/handoff. Modifiche precedenti del Trainer conservate e distinguibili nei checkpoint. Nessuna modifica alle applicazioni o al backend.

## Pubblicazione e prossimo passo

Solo locale. Branch main, HEAD c7aa6cc4467d2020849427fdc2a6388a90ed6ab5 invariato; index vuoto. Nessun nuovo commit/push/tag/deploy. Config Render aggiornata solo come preparazione, auto deploy OFF. Vecchia dist archiviata recuperabilmente in `.qa/desktop-showcase/pre-desktop-dist`.

Rivedere le otto aree e fornire lo screenshot Agenda. Pubblicazione richiede autorizzazione separata. Hosting/dominio ufficiale e Privacy/Supporto definitive restano pendenti. Check Studio, Questionario, Impostazioni e altre aree sono secondarie: aggiungerle soltanto dopo review dell’utente, con lo stesso modello.
