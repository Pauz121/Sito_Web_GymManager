# Historical report — SUPERSEDED

The latest architecture correction rejects the giant Home. Current: one project/build/deployment with seven real routes. See ARCHITECTURE_CORRECTION_REPORT.md and HOME_EXPERIENCE_PHASE2_REPORT.md. Previous evidence is retained below as history, not current acceptance criteria.

# Pagina unica GymManager — 26 ottobre 2026

## Risultato

Un solo documento completo: `dist/index.html`. Conserva testo, pulsanti e cornice iniziale della Home. Seguono otto capitoli Desktop con screenshot larghi quanto la cornice iniziale e informazioni interamente sotto, non affiancate. Nessuna navigazione verso pagine di approfondimento separate e nessuna fila di pulsanti Approfondisci.

Ordine: Dashboard, Clienti, Allenamenti/Lezioni, Agenda personale, Schede allenamento, Alimentazione, Progressi, Pagamenti. Ogni capitolo include scopo, azioni, moduli e workflow prima contenuti nelle otto pagine. Anche i dieci argomenti della precedente pagina Funzionalità sono integrati nei capitoli pertinenti, senza duplicare le immagini già presenti nello stesso capitolo.

La sezione Trainer resta nello stesso index con le cinque immagini reali e il proprio comportamento. App Client, workflow ed ecosistema conservati. Download completo, guida Windows e avvisi sono ora in `#download`, con una sola integrazione GitHub latest stable e fallback esistente.

## Privacy, sicurezza e supporto

Privacy e Supporto sono interamente integrati in `#privacy` e `#support`. Identificativi delle sottosezioni prefissati per evitare conflitti. Verificata automaticamente la conservazione di ogni paragrafo, voce di elenco e definizione dei due documenti originali. Contatti e avvisi di bozza invariati.

Non esisteva un documento Security distinto nel sito: la sezione «Sicurezza e supporto» incorpora gli avvisi reali già esistenti su password, token, screenshot, dati e recupero account. Non è stata inventata una nuova policy o una garanzia di sicurezza. Nessuna nuova valutazione legale del contenuto.

Dominio ufficiale e approvazione definitiva ancora mancanti. Poiché ora le bozze fanno parte dello stesso documento e robots non è applicabile a una sola sezione, l’intero index conserva temporaneamente `noindex, nofollow`. Non dichiarare chiusi i blocker App Store o pronta l’indicizzazione definitiva.

## Agenda reale ricevuta

- PNG fornito dall’utente: 1416×881, screenshot app-only Trainer Demo e clienti/attività contrassegnati DEMO.
- Originale SHA256: `48b69cd6522ee7a9dfcac15bdc783e74fd52635baeeadc7c336374d76ebaa567`.
- `assets/screenshots/desktop-agenda.webp`, lossless, 67340 byte, stessa risoluzione, nessun ritaglio o ritocco.
- WebP SHA256: `8f210e1d5698e2c67b389bd5f4ac0024c86ba57664299d2ac54cfc8ae23e2c49`.
- Confronto pixel RGB decodificati originale/WebP: entrambi MD5 `281725bbc5a1b9afde479d1ec3172590`.
- Provenance nel manifest e sidecar, non pubblicati. Originale intatto; tutte le otto immagini principali ora disponibili.

## Architettura e compatibilità

Il modello `content/desktop-features.mjs` resta l’unica fonte dei dettagli Desktop. `scripts/desktop-render.mjs` produce capitoli verticali. `scripts/site-pages.mjs` integra anche le sezioni dei documenti precedenti, corregge link/ID/livelli dei titoli e genera un solo index completo, senza fetch o componenti duplicati nel browser.

I quattro vecchi documenti rimangono sorgenti di build/storico: non perderli o modificarli come se fossero ancora pagine pubbliche autonome. I vecchi URL pubblici hanno dodici piccoli alias di redirect con link di fallback all’anchor corretto; non sono dodici siti o copie del contenuto. Funzionano anche su hosting statico e in sottocartella. Nessuna nuova pipeline/framework/dipendenza/servizio.

Il sito pubblicabile contiene 40 file: un documento completo, dodici alias minimali e asset ottimizzati. Solo `dist` va pubblicata. Nessun originale, documento, script di sviluppo, manifest, QA o video storico nella build.

## Skill e delega

Impeccable layout/craft/polish: identità esistente, immagini dominanti, gruppi per significato, informazioni sotto il proprio media, DOM/lettura nello stesso ordine, controlli nativi e adattamento responsive. Decisione ACCEPTED, applicata senza nuova identità o font. Direction brief aggiornata alla richiesta esplicita dell’utente; DESIGN.md storico dello stile non sovrascritto.

Sites: percorso locale, checkout esistente, allowlist e preview, nessuna registrazione o pubblicazione. Antigravity advisory `GYM-WEBSITE-ONEPAGE-20261026-001`: FAILED exit1/providerERROR/no risposta; nessuna modifica. Codex ha registrato fallimento e applicato il fallback consentito dalla policy, senza delega fittizia.

## Verifiche

41/41 test Node PASS dopo adattamento al modello single-page: contenuti degli otto capitoli, dieci argomenti aggiuntivi, ID/link univoci, alias relativi, preservazione legale, dati/media reali, download stabile/fallback e regressioni Trainer. Validator e build PASS; HTTP su index/alias/anchor, MIME/HEAD/Range, esclusione file privati PASS. I test sono source/controller/HTTP, non certificazione WCAG o test iPhone.

Browser: quattro larghezze reali 375/768/1024/1440. In tutti gli otto capitoli, figure larghe come la Home (332/680/900/1180px rispettivamente), testi sotto, nessun overflow orizzontale o immagine visibile rotta. Un solo main/H1/footer. Verificati il vecchio URL Agenda che arriva a index#desktop-agenda, immagine reale caricata, zoom Enter, Escape e ritorno del focus. Menu mobile aperto → Download nello stesso index → menu chiuso; CTA installer reale risolta senza scaricare/eseguire file. Privacy via footer resta nello stesso documento; console error/warn vuota all’ultimo controllo.

Prove ignorate in .impeccable/review/onepage-*.png e onepage-layout-matrix.json; controllata visivamente la composizione immagine → testo. Detector layout eseguito prima/dopo: warning, non clean PASS. Segnala padding dei separatori usando proprietà logiche; controllo browser conferma padding-top28px dei blocchi (24px mobile). Le sezioni full-bleed hanno il contenitore interno con margini reali verificati: non sono testi contro il bordo. Non è una certificazione generale.

Lighthouse, Safari/iPhone fisico, VoiceOver, JS disabilitato e Reduce Motion del sistema NON ESEGUITI; fallback source e test controllati Trainer restano coperti. Ultimo giro:41/41test,validator/build40/HTTP/17sintassi/diff PASS; scansione39filetestuali modificati/nuovi, zero segreti riconoscibili ad alta affidabilità e zero percorsi personali di macchina. Scope website confermato, index Git vuoto/HEAD invariato. Handoff root e locale aggiornati; preview temporanea chiusa a fine verifica.

## Stato Git e pubblicazione

Nessun commit, push o deploy autorizzato/eseguito. Applicazioni e database non modificati. Precedenti modifiche locali conservate, incluso il video originale modificato dall’utente. Hosting/dominio e policy definitive restano fuori da questo intervento.
# Historical report — SUPERSEDED

The latest user architecture correction rejects the giant single Home. Current architecture: one project/build/deployment with seven real routes. See ARCHITECTURE_CORRECTION_REPORT.md and HOME_EXPERIENCE_PHASE2_REPORT.md. Prior evidence below retained, not current acceptance criteria.
