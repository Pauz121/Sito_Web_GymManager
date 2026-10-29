---
name: GymManager website
description: Presentazione pratica del prodotto nello stile caldo neutro, antracite e rosso esistente.
colors:
  accent: "#d9293f"
  accent-dark: "#ae1f31"
  accent-soft: "#fdebed"
  ink: "#18181b"
  ink-soft: "#5d5d65"
  paper: "#f7f5f2"
  paper-deep: "#ede9e4"
  white: "#ffffff"
  line: "rgba(24, 24, 27, .12)"
typography:
  display:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(3rem, 6.6vw, 5.9rem)"
    fontWeight: 700
    lineHeight: 0.99
    letterSpacing: "-.058em"
  headline:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(2rem, 4vw, 3.35rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-.045em"
  showcase-headline:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-.035em"
  desktop-display:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(2.6rem, 6vw, 5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-.035em"
  desktop-headline:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(1.6rem, 3vw, 2.3rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.025em"
  title:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1.28rem"
    fontWeight: 700
    lineHeight: 1.65
    letterSpacing: "-.025em"
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: ".75rem"
    fontWeight: 800
    lineHeight: 1.65
    letterSpacing: ".14em"
  button:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 800
    lineHeight: 1.2
  status:
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: ".67rem"
    fontWeight: 900
    lineHeight: 1.65
    letterSpacing: ".09em"
rounded:
  lg: "32px"
  md: "22px"
  sm: "14px"
  button: "15px"
  media: "12px"
  image: "20px"
  frame: "28px"
  lg-mobile: "25px"
  pill: "999px"
spacing:
  "8": "8px"
  "12": "12px"
  "20": "20px"
  "24": "24px"
  "30": "30px"
  "36": "36px"
  "42": "42px"
  "48": "48px"
  section: "104px"
  section-compact: "74px"
  section-mobile: "78px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 21px"
  button-primary-hover:
    backgroundColor: "{colors.accent-dark}"
  button-secondary:
    backgroundColor: "rgba(255,255,255,.66)"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 21px"
  button-disabled:
    backgroundColor: "#e6e3df"
    textColor: "#85858b"
  text-link:
    textColor: "{colors.accent-dark}"
  showcase-nav:
    textColor: "{colors.ink-soft}"
    padding: "6px 9px"
  showcase-nav-current:
    textColor: "{colors.accent-dark}"
  status:
    backgroundColor: "#e7e4df"
    textColor: "#606069"
    typography: "{typography.status}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
  status-primary:
    backgroundColor: "rgba(217,41,63,.2)"
    textColor: "#ffc2ca"
  ecosystem-card:
    backgroundColor: "rgba(255,255,255,.6)"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "34px"
  ecosystem-card-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "34px"
  image-zoom:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.media}"
    padding: "8px 14px"
  image-zoom-hover:
    textColor: "{colors.accent-dark}"
  desktop-frame:
    backgroundColor: "rgba(255,255,255,.58)"
    rounded: "{rounded.frame}"
    padding: "13px"
  desktop-pending:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.media}"
    padding: "36px"
---

# Design System: GymManager website

<!-- Extraction audit: GYM-WEBSITE-DESKTOP-DOC-20261026-001. Snapshot 2026-10-26. Sources: assets/css/styles.css, assets/css/desktop.css, assets/css/legal.css, index.html, download.html, scripts/desktop-render.mjs. Documentation only; no application, database or deployment change. -->

## Overview

**Creative North Star: "Presentazione pratica del prodotto, nello stile esistente"**

Questa è un'etichetta descrittiva della direzione confermata dall'utente, non un nuovo concept. GymManager presenta il lavoro concreto del Trainer attraverso schermate autentiche, testo italiano diretto e una cornice visiva calda: carta chiara, antracite e accenti rossi. Il logo Trainer esistente resta l'asset di identità.

La composizione alterna titoli ampi, testo leggibile, superfici arrotondate e immagini del prodotto. Le ombre morbide danno presenza alle cornici, mentre le pagine di approfondimento usano soprattutto spazio e divisori. Questo documento registra l'implementazione attuale; non certifica l'accessibilità né introduce una nuova identità.

**Key Characteristics:**

- Carta calda, antracite e un unico accento rosso.
- Titoli sans serif compatti, corpo arioso e testo italiano concreto.
- Cornici morbide intorno a schermate autentiche con dati DEMO.
- Scorrimento naturale e controlli HTML riconoscibili.
- Adattamento verticale quando spazio o preferenze riducono il movimento.

I valori nel frontmatter sono normativi per questo snapshot. Le scale numeriche di spaziatura catalogano valori letterali ricorrenti; il CSS non espone una scala di spacing condivisa. Le estensioni non rappresentabili nel frontmatter sono in [.impeccable/design.json](.impeccable/design.json). Le rampe OKLCH del pannello sono interpolazioni illustrative, non nuovi colori approvati o usati dal sito.

## Colors

La palette principale unisce il calore della carta a un contrasto antracite; il rosso segnala azione, orientamento e accenti di testo.

### Primary

- **Rosso GymManager** (`accent`): pulsanti primari, parole evidenziate e piccoli indicatori.
- **Rosso profondo** (`accent-dark`): link testuali, indici, stato corrente e hover del pulsante primario.
- **Rosa chiaro** (`accent-soft`): fondi di icone e note, senza diventare un secondo accento indipendente.

### Neutral

- **Antracite** (`ink`): testo principale e sezioni scure.
- **Grigio morbido** (`ink-soft`): descrizioni, didascalie e testo secondario su superfici chiare.
- **Carta calda** (`paper`): fondo della pagina e del dialogo immagini.
- **Carta profonda** (`paper-deep`): cambio di sezione e slot media in preparazione.
- **Bianco** (`white`): testo sulle azioni principali e superfici di controllo.
- **Linea traslucida** (`line`): divisori e bordi su fondo chiaro; conserva il formato RGBA della sorgente.

Il fondo principale aggiunge due gradienti radiali tenui alla carta. Le superfici usano anche bianchi traslucidi. I colori locali di footer, sezioni scure, release e avvisi legali sono adattamenti di contesto presenti nel codice, non nuove palette di marca.

**The Existing Palette Rule.** Riusa la palette osservata; non ricavare nuove superfici dai campioni interpolati del pannello.

## Typography

**Display Font / Body Font:** lo stesso stack sans serif del frontmatter. Inter è dichiarato nel CSS, ma non è distribuito né caricato dal sito: in sua assenza il browser usa il font di sistema disponibile, ad esempio Segoe UI su Windows. Non attribuire al sito un file o un servizio font che non esiste.

**Character:** titoli decisi con interlinea stretta e tracking negativo; paragrafi più aperti. Non c'è una seconda famiglia decorativa o monospaziata. I pesi dei titoli sono il bold HTML ereditato dal browser; il CSS non imposta esplicitamente quel peso.

### Hierarchy

- **Display:** titolo della home; su mobile usa il clamp specifico della home (`clamp(3rem, 15vw, 5rem)`).
- **Headline:** titoli delle sezioni generali. **Showcase headline** mantiene la propria scala per le panoramiche del prodotto.
- **Desktop display / Desktop headline:** titolo di ingresso e sottosezioni degli approfondimenti, con larghezze di lettura più contenute.
- **Title:** titolo delle card funzionali esistenti; non sostituisce automaticamente ogni titolo di card.
- **Body:** paragrafi correnti; le introduzioni hanno dimensioni maggiori già definite dai rispettivi selettori. Le descrizioni lunghe sono limitate, a seconda del contesto, tra 48ch e 72ch.
- **Label:** occhielli piccoli in maiuscolo e tracciati; lo status ha una scala più compatta. La variante button conserva il peso deciso senza trasformare il testo in maiuscolo.

La pagina funzionalità, il download e le pagine legali hanno scale di titolo contestuali già nel CSS. Questo snapshot non le uniforma né crea un rapporto matematico che la sorgente non possiede.

## Layout

Il contenitore condiviso è centrato: desktop (`min(1180px, calc(100% - 40px))`), fino a 1024px (`min(100% - 36px, 900px)`), fino a 768px (`min(100% - 28px, 680px)`). La spaziatura verticale delle sezioni usa le voci dedicate nel frontmatter; le pagine di lettura usano ritmi propri più serrati.

La navigazione principale è sticky, alta almeno (78px), con fondo carta traslucido e blur (18px); su mobile scende a (70px), con menu espandibile. Senza JavaScript i link mobili rimangono visibili e il header torna nel flusso normale. I controlli di navigazione hanno area minima di interazione (44px).

Le griglie esistenti si riducono da tre a due o una colonna, secondo il contenuto. I layout testo/immagine diventano verticali; non comprimere una schermata Desktop dentro una miniatura sticky su tablet. Lo showcase Desktop attivo usa colonne (`1.9fr / .9fr`) e gap (42px), con finestra a sinistra e descrizione a destra. Il suo percorso preciso e l'ordine delle aree appartengono alla [surface brief](.impeccable/surfaces/index-html.md), non a una regola per ogni futura pagina.

Il Desktop torna a schermata, testo e CTA nel flusso fino a (1024px), con viewport bassa fino a (600px), o con movimento ridotto. Gli approfondimenti hanno breadcrumb, immagine ampia e gruppi testuali separati da linee; il pager passa da tre colonne a una fino a (768px). Le pagine legali usano testo limitato e un indice laterale che rientra nel flusso su mobile.

**The Natural Flow Rule.** Lo scorrimento resta nativo; le ottimizzazioni sticky devono conservare una lettura completa nel flusso normale.

## Elevation & Depth

Il sistema combina separazioni tonali e ombre diffuse. La cornice dell'app e alcune card chiare usano l'ombra morbida a due direzioni (`clay-shadow`); le superfici scure, il dialogo e alcune card media usano l'ombra di profondità (`shadow`). Le sezioni testuali Desktop si separano invece con spazio e linee sottili. I valori completi sono nel sidecar, estratti dalle due custom properties; non costituiscono una nuova scala di livelli.

I pulsanti primari hanno un'ombra rossa locale; i secondari un rilievo chiaro. L'hover dei pulsanti solleva leggermente il controllo (`translateY(-2px)`), senza aggiungere un hover alle card puramente informative. Il cambio di schermata usa un crossfade (220ms); le reveal esistenti usano una transizione (.55s). Il movimento ridotto rende i contenuti immediatamente visibili e riduce animazioni e transizioni.

## Shapes

Il vocabolario è morbido e arrotondato: pannelli ampi, card medie, pulsanti con angoli più compatti e badge a pillola. La cornice dell'app lascia un bordo chiaro intorno al media; la schermata mantiene proporzioni reali e `object-fit: contain` dove presente. Il root dichiara anche il raggio `sm`, ma i componenti ispezionati non lo usano tramite quella custom property: non assegnargli nuovi consumatori per completare una scala.

Il raggio condiviso grande si riduce su mobile alla voce `lg-mobile`. La cornice Desktop inline scende ulteriormente a (20px) su mobile. Queste sono eccezioni implementate, non un invito a cambiare ogni raggio allo stesso breakpoint. Le linee sono sottili, i bordi spesso traslucidi; la nota privacy conserva la propria forma aperta sul lato sinistro.

## Components

### Buttons

Controlli solidi, leggibili e arrotondati. Le due varianti condividono allineamento inline, peso deciso e altezza minima (48px). La variante primaria usa rosso e bianco; quella secondaria una superficie bianca traslucida e il bordo sottile. Hover: piccolo sollevamento; il primario si scurisce. Lo stato disabilitato o `aria-disabled="true"` rimuove ombra e movimento e usa i colori locali registrati nel frontmatter. Non è definito uno stile `:active` autonomo.

Il focus da tastiera è un contorno (3px) con offset (4px) in rosso profondo, adattato al rosa chiaro sulle sezioni scure. La CTA del download resta disabilitata durante la verifica della release. I pulsanti delle singole aree Desktop riempiono la larghezza disponibile su mobile.

### Text links

Il link di approfondimento è rosso profondo, deciso, con una freccia finale; la freccia si sposta di (4px) all'hover. Breadcrumb, link legali e pager hanno trattamenti specifici di sottolineatura nel rispettivo contesto. Conservare il focus visibile anche quando il solo colore distingue il link.

### Navigation

La navigazione principale usa testo sans serif compatto e il colore di stato corrente. La navigazione dello showcase è una sequenza di anchor che va a capo: lo stato corrente usa `aria-current="step"`, colore rosso profondo, bordo inferiore e peso maggiore. Hover e stato corrente condividono l'indicatore; il focus resta distinto. Non si tratta di tab che nascondono il contenuto testuale.

### Status

Badge non interattivo, in maiuscolo, a pillola. La versione ordinaria è neutra; nella card Desktop scura passa alla tinta rossa traslucida e al testo rosa. Non aggiungere hover, focus o semantica di pulsante a un'etichetta statica.

### Cards / Containers

Le card dell'ecosistema distinguono il Desktop con fondo antracite e ombra; le due companion hanno superficie chiara traslucida e bordo sottile. Sono contenitori informativi, senza hover o comportamento di selezione. Le card funzionali preesistenti usano invece il rilievo morbido; non estendere automaticamente quella griglia alle narrazioni per schermate.

### Real-screen frame and pending media

La cornice Desktop riprende l'app frame esistente e ospita esclusivamente immagini autentiche. Lo stage sincronizza immagine, nome, testo breve, CTA e anchor corrente. Il controllo di ingrandimento apre il dialogo HTML esistente, con chiusura da tastiera e ritorno del focus gestiti dal controller. Il pulsante zoom chiaro ha un hover rosso e bordo accentato.

Quando una schermata reale manca, lo slot mostra il titolo dell'area e il messaggio di anteprima in preparazione, con didascalia esplicita. Nel corrispondente stage lo zoom è disabilitato; il collegamento all'approfondimento rimane disponibile. Il sidecar mostra questo vero stato di attesa, evitando di simulare un'interfaccia del gestionale.

Non risultano campi input o una libreria di form nel sito ispezionato: questo documento non ne inventa la forma.

## Do's and Don'ts

### Do:

- **Do** riusare carta calda, antracite e rosso con le assegnazioni osservate.
- **Do** mantenere lo stack font reale e il fallback di sistema senza dichiarare font distribuiti che non esistono.
- **Do** mostrare schermate autentiche con dati DEMO e didascalie comprensibili.
- **Do** preservare focus visibile, controlli nativi e lettura completa senza animazione.
- **Do** lasciare gli slot media mancanti esplicitamente in preparazione.

### Don't:

- **Don't** sostituire il logo Trainer o introdurre una nuova identità durante un'estensione dello stile esistente.
- **Don't** fabbricare schermate del prodotto o usare un'altra funzione per coprire un'immagine mancante.
- **Don't** trasformare le rampe illustrative del pannello in colori di produzione.
- **Don't** aggiungere interazioni alle card o ai badge che il sito tratta come contenuto statico.
- **Don't** trasformare il percorso di una singola surface in una composizione obbligatoria per tutto il sito.
