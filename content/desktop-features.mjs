// Product facts only. Both public overview and detail HTML use this one model.
// Evidence paths are development-only and are never included by the renderer.
const image = (file, width, height, alt, caption) => ({ src: `assets/screenshots/${file}.webp`, width, height, alt, caption });
const records = [
  {
    id: 'dashboard', slug: 'dashboard', title: 'Dashboard', label: 'Dashboard',
    subtitle: 'La giornata comincia con una visione d’insieme.',
    shortDescription: 'Check in studio, impegni, attività e scadenze: il punto da cui riconoscere le priorità e aprire l’area giusta.',
    longDescription: 'Prima di entrare nei singoli programmi, ritrova la situazione operativa del giorno. La Dashboard riunisce i riepiloghi abilitati per il Trainer e i collegamenti alle aree di lavoro: non devi ricostruire il contesto ogni volta che apri il gestionale.',
    purpose: 'Capire da dove iniziare. Distingui i controlli in studio dagli allenamenti, leggi le attività ancora aperte e individua le quote da verificare prima di passare al dettaglio.',
    heroImage: image('desktop-dashboard', 1600, 828, 'Dashboard reale GymManager del Trainer Demo con check del giorno, agenda personale e pagamenti da controllare', 'Dashboard registrata nell’account Trainer Demo. I riquadri dipendono dalla configurazione del Trainer.'),
    actions: ['Consultare il numero dei check in studio del giorno.', 'Aprire il calendario delle lezioni dai riepiloghi abilitati.', 'Ritrovare le attività aperte e aggiungere un promemoria personale.', 'Passare ai pagamenti per approfondire una scadenza.'],
    capabilities: [
      { title: 'Impegni con un contesto', text: 'Check in studio e lezioni mantengono la propria destinazione: il riepilogo ti porta al calendario pertinente.' },
      { title: 'Attività da seguire', text: 'L’agenda personale raccoglie le cose ancora aperte; le priorità aiutano a stabilire cosa viene prima.' },
      { title: 'Scadenze visibili', text: 'I riepiloghi economici distinguono quote scadute e prossime scadenze. Il registro completo rimane nella sezione Pagamenti.' }
    ],
    workflow: ['Apri la Dashboard e consulta i riepiloghi del giorno.', 'Individua un impegno, un’attività o una scadenza da seguire.', 'Apri l’area collegata per lavorare sul dettaglio.'],
    evidence: ['Desktop/src/features/dashboard/TrainerDashboardView.tsx', 'Prima registrazione.mp4 @0s'],
  },
  {
    id: 'clienti', slug: 'clienti', title: 'Clienti', label: 'Clienti',
    subtitle: 'Una persona, tutto il suo percorso.',
    shortDescription: 'Dall’elenco al profilo: informazioni, obiettivi e accesso ai programmi, alle rilevazioni e alla storia del rapporto.',
    longDescription: 'La scheda cliente è il punto di incontro tra le diverse aree del gestionale. Parti dalla persona, ritrova le informazioni raccolte e apri il lavoro che serve in quel momento, senza perdere il riferimento a chi stai seguendo.',
    purpose: 'Mantenere il percorso della persona riconoscibile. Anagrafica e obiettivi danno il contesto; questionario, programmi e storico permettono di continuare il lavoro nella sezione appropriata.',
    heroImage: image('12-client-demo', 1600, 828, 'Dettaglio del cliente sintetico Giulio Bianchi DEMO con informazioni personali, obiettivi e accesso alle aree del percorso', 'Profilo sintetico Giulio Bianchi DEMO: nessun dato di una persona reale.'),
    actions: ['Selezionare un cliente e consultare la panoramica.', 'Modificare i dati del profilo e ritrovare gli obiettivi.', 'Aprire questionario, allenamento, nutrizione e progressi.', 'Consultare foto, appuntamenti, pagamenti, note e documenti nell’area dedicata.'],
    capabilities: [
      { title: 'Informazioni e obiettivi', text: 'La panoramica conserva i dati del profilo e gli obiettivi attuali, prima di entrare nei programmi.' },
      { title: 'Programmi nel contesto giusto', text: 'Allenamento e nutrizione distinguono piani attivi, bozze e storico: il programma rimane associato alla persona.' },
      { title: 'Continuità del rapporto', text: 'Rilevazioni, appuntamenti e materiali del cliente sono raggiungibili dalla stessa scheda. Le note restano distinte dall’agenda personale del Trainer.' }
    ],
    workflow: ['Cerca e seleziona la persona dall’elenco clienti.', 'Leggi la panoramica e il punto del percorso.', 'Apri il programma, il documento o la rilevazione su cui vuoi lavorare.'],
    evidence: ['Desktop/src/pages/ClientDetailPage.tsx', 'Prima registrazione.mp4 @7s'],
  },
  {
    id: 'allenamenti', slug: 'allenamenti', title: 'Allenamenti / Lezioni', label: 'Lezioni',
    subtitle: 'Dai programmi agli impegni in calendario.',
    shortDescription: 'Organizza le sessioni dei clienti nel tempo. Giorno, settimana e mese aiutano a leggere gli appuntamenti, non a scrivere la scheda.',
    longDescription: 'Questa è l’area degli allenamenti pianificati: quando avviene la sessione, con quale cliente e in quale fascia oraria. È separata dalla creazione dei programmi, che rimane nella sezione Schede allenamento, e dai controlli professionali di Check Studio.',
    purpose: 'Dare un posto agli allenamenti nella giornata. Il calendario collega la pianificazione al cliente, così puoi consultare gli impegni o intervenire su una singola lezione.',
    heroImage: image('desktop-allenamenti', 1400, 726, 'Calendario settimanale reale Allenamenti e Lezioni con sessioni e orari dei clienti DEMO', 'Vista settimanale del calendario Allenamenti / Lezioni, con dati sintetici DEMO.'),
    actions: ['Cambiare vista tra giorno, settimana e mese.', 'Spostarsi tra le date e tornare al periodo corrente.', 'Creare una nuova lezione collegata a un cliente.', 'Aprire un appuntamento e aggiornarne i dettagli.'],
    capabilities: [
      { title: 'Tre modi di leggere il tempo', text: 'Le viste giorno, settimana e mese permettono di passare dal singolo impegno alla distribuzione del periodo.' },
      { title: 'Cliente e sessione insieme', text: 'Ogni appuntamento conserva il riferimento alla persona e le informazioni della lezione.' },
      { title: 'Calendari con ruoli distinti', text: 'Le lezioni vivono qui; i check professionali hanno la propria area. Le attività personali appartengono all’Agenda.' }
    ],
    workflow: ['Scegli il periodo e la vista del calendario.', 'Consulta una sessione o crea una nuova lezione.', 'Collega il cliente, verifica i dettagli e salva l’appuntamento.'],
    evidence: ['Desktop/src/pages/CalendarPage.tsx', 'Desktop/src/pages/TrainingCalendarPage.tsx', 'Prima registrazione.mp4 @86s'],
  },
  {
    id: 'agenda', slug: 'agenda', title: 'Agenda personale', label: 'Agenda',
    subtitle: 'Gli impegni tra un cliente e l’altro, senza perdere il filo.',
    shortDescription: 'Raccogli attività e promemoria, distingui le priorità e ritrova ciò che è ancora da fare, anche senza una scadenza.',
    longDescription: 'Non tutto il lavoro del Trainer è una lezione in calendario. L’Agenda personale è lo spazio delle attività operative: una verifica da completare, un promemoria o un impegno privato, con o senza collegamento a un cliente.',
    purpose: 'Tenere visibili le cose che altrimenti resterebbero fuori dai programmi. L’ordine per priorità aiuta a distinguere le urgenze dalle attività ordinarie; il completamento rende chiaro ciò che è già stato fatto.',
    heroImage: image('desktop-agenda', 1416, 881, 'Agenda personale reale del Trainer Demo con attività e promemoria dei clienti DEMO ordinati per priorità alta, media e bassa', 'Agenda personale: schermata fornita dall’utente, con sole attività e persone sintetiche DEMO.'),
    actions: ['Creare un’attività con titolo e descrizione.', 'Indicare priorità alta, media o bassa.', 'Aggiungere una data e un orario quando servono.', 'Cercare, modificare e segnare un’attività come completata.'],
    capabilities: [
      { title: 'Priorità prima del rumore', text: 'Le attività sono organizzate per priorità Alta, Media e Bassa: la distinzione è espressa anche con etichette, non soltanto con un colore.' },
      { title: 'Con data oppure senza', text: 'Un promemoria può avere una scadenza oppure rimanere senza data. Il riferimento a un cliente è facoltativo.' },
      { title: 'Stato leggibile', text: 'Il segno di completamento distingue il lavoro chiuso da quello aperto. La ricerca aiuta a ritrovare un’attività nel tempo.' }
    ],
    workflow: ['Aggiungi l’attività che vuoi tenere sotto controllo.', 'Scegli priorità ed eventuale scadenza o cliente.', 'Ritrovala nell’Agenda e segnala quando l’hai completata.'],
    evidence: ['Desktop/src/pages/AgendaPage.tsx', 'Desktop/src/features/agenda/AgendaList.tsx', 'Desktop/src/features/agenda/AgendaTaskModal.tsx'],
  },
  {
    id: 'schede-allenamento', slug: 'schede-allenamento', title: 'Schede allenamento', label: 'Schede',
    subtitle: 'Costruisci il programma. Adattalo alla persona.',
    shortDescription: 'Modelli, sessioni ed esercizi diventano programmi assegnabili: serie, ripetizioni, recuperi e settimane mantengono una struttura leggibile.',
    longDescription: 'Parti da un modello, organizza le sessioni e scegli gli esercizi dal catalogo pertinente. Imposta le indicazioni del lavoro e assegna una copia al cliente, mantenendo distinta la base riutilizzabile dal suo programma personale.',
    purpose: 'Dare una struttura alla programmazione, non soltanto un elenco di esercizi. Il modello raccoglie il metodo; la copia cliente lo rende utilizzabile nel percorso della persona.',
    heroImage: image('04-workout-plan', 1600, 820, 'Editor reale di una scheda GymManager con sessioni del modello DEMO ed esercizi programmati', 'Scheda di allenamento registrata nell’ambiente DEMO.'),
    screenshots: [image('05-body-focus', 1600, 820, 'Body Focus reale GymManager con mappa muscolare e analisi dei volumi del programma DEMO', 'Il riepilogo del programma mostra Body Focus, volumi e distribuzione del lavoro.')],
    actions: ['Creare un modello e organizzare le sessioni.', 'Selezionare gli esercizi secondo le linee di lavoro.', 'Definire serie, ripetizioni, recuperi, RIR e note operative.', 'Usare progressioni multi-settimana e consultare il riepilogo.', 'Assegnare il modello al cliente e distinguere bozze, piani attivi e storico.'],
    capabilities: [
      { title: 'Catalogo e linee di lavoro', text: 'La sessione usa le linee selezionate per organizzare la scelta degli esercizi. Il programma mantiene un ordine esplicito.' },
      { title: 'Indicazioni che seguono le settimane', text: 'Parametri fissi e progressioni consentono di distribuire prescrizioni e note lungo la durata della scheda.' },
      { title: 'Dalla costruzione alla lettura', text: 'Body Focus e analisi dei volumi affiancano il documento del programma. L’assegnazione crea una copia cliente distinta dal modello.' }
    ],
    workflow: ['Crea o apri un modello e organizza le sessioni.', 'Aggiungi gli esercizi e definisci le prescrizioni.', 'Controlla il riepilogo, poi assegna e personalizza la copia cliente.'],
    evidence: ['Desktop/src/pages/WorkoutsPage.tsx', 'Desktop/src/features/workouts/WorkoutAssignmentModal.tsx', 'Desktop/src/features/workouts/WorkoutAnalysisPanel.tsx', 'Seconda registrazione.mp4 @12s,@22.6s'],
  },
  {
    id: 'alimentazione', slug: 'alimentazione', title: 'Alimentazione', label: 'Alimentazione',
    subtitle: 'Dal modello ai pasti, un piano che si legge.',
    shortDescription: 'Organizza giornate, pasti, alimenti e quantità. Riusa i modelli e personalizza i piani dei clienti con un riepilogo energetico chiaro.',
    longDescription: 'L’area Alimentazione distingue i modelli riutilizzabili dai piani assegnati. La struttura scende dalla giornata al singolo alimento: i riepiloghi di calorie e macronutrienti rimangono collegati alle quantità effettivamente presenti nel piano.',
    purpose: 'Costruire e consultare piani ordinati, evitando di separare la struttura dei pasti dai numeri del riepilogo. I valori supportano il lavoro del professionista: non rappresentano una diagnosi o una prescrizione medica del software.',
    heroImage: image('07-nutrition-overview', 1600, 820, 'Piano nutrizionale reale GymManager con giornate, riepilogo energetico e macronutrienti del cliente DEMO', 'Piano alimentare del cliente sintetico DEMO.'),
    screenshots: [image('08-nutrition-client-plan', 1600, 820, 'Dettaglio reale di pasti, alimenti e quantità nel piano nutrizionale GymManager del cliente DEMO', 'Dalla giornata ai pasti: quantità e riepiloghi appartengono al piano demo.')],
    actions: ['Creare un modello o aprire un piano già assegnato.', 'Organizzare giornate Standard o ON/OFF e i relativi pasti.', 'Cercare gli alimenti e impostare le quantità.', 'Consultare calorie, proteine, carboidrati e grassi.', 'Copiare giornate, assegnare il modello e modificare la copia cliente.'],
    capabilities: [
      { title: 'Modello e piano, ruoli diversi', text: 'Il modello prepara una base riutilizzabile. L’assegnazione mantiene il piano personale distinto dalla struttura di partenza.' },
      { title: 'Giornata, pasto, alimento', text: 'La navigazione mantiene leggibili i diversi livelli, fino alle quantità di ciascun alimento.' },
      { title: 'Riepiloghi collegati al contenuto', text: 'Calorie e macronutrienti aiutano a leggere la distribuzione della giornata, accanto ai pasti realmente inseriti.' }
    ],
    workflow: ['Parti da un modello e organizza le giornate.', 'Costruisci i pasti, scegli gli alimenti e imposta le quantità.', 'Verifica il riepilogo e assegna o aggiorna il piano del cliente.'],
    evidence: ['Desktop/src/pages/NutritionPage.tsx', 'Desktop/src/features/nutrition/NutritionDocument.tsx', 'Seconda registrazione.mp4 @34s,@37s'],
  },
  {
    id: 'progressi', slug: 'progressi', title: 'Progressi', label: 'Progressi',
    subtitle: 'Leggi l’evoluzione, non soltanto l’ultima misura.',
    shortDescription: 'Peso, circonferenze e rilevazioni nel tempo: raccogli i dati del cliente e confrontali con il loro contesto.',
    longDescription: 'La pagina Progressi affianca alle rilevazioni salvate una lettura nel tempo delle misure disponibili. Puoi passare dal valore più recente allo storico e ai grafici, senza trasformare l’assenza di un dato in un risultato inventato.',
    purpose: 'Raccogliere, confrontare e comprendere l’andamento. Ogni rilevazione conserva la propria data; i grafici permettono di leggere le variazioni delle metriche effettivamente registrate.',
    heroImage: image('10-progress', 1600, 828, 'Progressi reali GymManager con peso, circonferenze e cronologia del cliente sintetico Giulio Bianchi DEMO', 'Rilevazioni e grafici del percorso sintetico DEMO: nessun risultato reale promesso.'),
    actions: ['Registrare peso e circonferenze con una data.', 'Aggiungere note alla rilevazione.', 'Consultare lo storico e confrontare le misure disponibili.', 'Visualizzare i grafici delle metriche registrate.', 'Usare i protocolli plicometrici presenti, quando i dati richiesti sono disponibili.'],
    capabilities: [
      { title: 'La data conta', text: 'Una rilevazione resta collegata al momento in cui è stata raccolta, insieme alle eventuali note.' },
      { title: 'Dati prima dei grafici', text: 'I grafici raccontano le misure disponibili. Non vengono aggiunte metriche come VO₂ o prestazioni non presenti.' },
      { title: 'Stime riconoscibili', text: 'I valori di composizione corporea dipendono dai dati e dal protocollo utilizzato. Sono stime, non una misura diagnostica garantita.' }
    ],
    workflow: ['Apri Progressi dalla scheda del cliente.', 'Registra una nuova rilevazione con i dati disponibili.', 'Confronta lo storico e consulta il grafico della misura che ti interessa.'],
    evidence: ['Desktop/src/features/clients/ClientProgressSection.tsx', 'Prima registrazione.mp4 @18s'],
  },
  {
    id: 'pagamenti', slug: 'pagamenti', title: 'Pagamenti', label: 'Pagamenti',
    subtitle: 'Scadenze e rinnovi, nel rapporto con il cliente.',
    shortDescription: 'Distingui quote in regola, in scadenza e scadute. Consulta rinnovi e movimenti senza perdere il riferimento al cliente.',
    longDescription: 'La sezione Pagamenti raccoglie abbonamenti, scadenze e storico delle quote. È un supporto all’organizzazione del rapporto economico con il cliente, non un sistema di contabilità fiscale o di fatturazione elettronica.',
    purpose: 'Capire cosa richiede attenzione e ritrovare ciò che è già stato registrato. I filtri aiutano a concentrarsi sulle scadenze; il registro mantiene leggibili periodo, importo, metodo e stato.',
    heroImage: image('desktop-pagamenti', 1600, 820, 'Pagamenti e abbonamenti reali GymManager con stati e scadenze di quattro clienti esplicitamente DEMO', 'Quote e date sintetiche dell’account Trainer Demo.'),
    actions: ['Cercare un cliente e filtrare gli abbonamenti per stato.', 'Controllare scadenza, quota e ultimo pagamento.', 'Registrare un rinnovo.', 'Consultare il registro con periodo, metodo, importo, stato e note.'],
    capabilities: [
      { title: 'Stati distinti', text: 'Le etichette In regola, In scadenza e Scaduto aiutano a distinguere cosa richiede una verifica.' },
      { title: 'Rinnovi nel contesto', text: 'Il rinnovo parte dall’abbonamento della persona, mantenendo insieme quota e periodo.' },
      { title: 'Uno storico consultabile', text: 'Il registro raccoglie i movimenti disponibili. Non vengono promessi incassi automatici, documenti fiscali o integrazioni bancarie.' }
    ],
    workflow: ['Apri Pagamenti e filtra lo stato che vuoi controllare.', 'Consulta l’abbonamento e la sua prossima scadenza.', 'Registra il rinnovo quando necessario e ritrovalo nello storico.'],
    evidence: ['Desktop/src/pages/PaymentsPage.tsx', 'Desktop/src/features/clients/ClientPaymentsSection.tsx', 'Seconda registrazione.mp4 @46s'],
  }
];

export const desktopFeatures = records.map((feature, index) => ({
  ...feature, order: index + 1, overviewImage: feature.overviewImage ?? feature.heroImage,
  screenshots: feature.screenshots || [],
  previousSlug: records[index - 1]?.slug || null,
  nextSlug: records[index + 1]?.slug || null,
}));
export const desktopRoutes = desktopFeatures.map(feature => `desktop/${feature.slug}/index.html`);
