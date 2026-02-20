# Implementation Plan: Zebra Label Manager

## Overview

Implementazione di una web application full-stack per la gestione e stampa di etichette su stampante Zebra ZT 230. L'applicazione sarà sviluppata con React (frontend) e Node.js/Express (backend), utilizzando SQLite per la persistenza dei dati. L'implementazione seguirà un approccio incrementale, costruendo prima le funzionalità core e poi aggiungendo features avanzate.

## Tasks

- [x] 1. Setup progetto e struttura base
  - Inizializzare progetto monorepo con frontend React e backend Node.js
  - Configurare TypeScript per entrambi i progetti
  - Installare dipendenze base (React, Express, SQLite3, cors, dotenv)
  - Creare struttura cartelle per componenti, API routes, database
  - Configurare script npm per sviluppo e build
  - _Requirements: 11.1_

- [x] 2. Setup database e modelli dati
  - [x] 2.1 Creare schema database SQLite
    - Implementare script di inizializzazione database
    - Creare tabelle: labels, templates, printer_config
    - Creare indici per performance (created_at, product_name, name)
    - _Requirements: 11.1, 11.2_

  - [ ]* 2.2 Scrivere property test per persistenza etichette
    - **Property 4: Label Persistence Round-Trip**
    - **Validates: Requirements 4.1, 4.2**

  - [x] 2.3 Implementare modelli TypeScript e funzioni database
    - Creare interfacce TypeScript per Label, Template, PrinterConfig
    - Implementare funzioni CRUD per labels (create, read, readAll, delete)
    - Implementare funzioni CRUD per templates
    - Implementare funzioni per printer_config
    - _Requirements: 4.1, 4.2, 4.5, 5.2, 5.6, 12.2_

  - [ ]* 2.4 Scrivere unit test per operazioni database
    - Test creazione etichetta con ID univoco e timestamp
    - Test recupero etichette ordinate per data
    - Test eliminazione etichetta
    - Test gestione errori database
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 3. Implementare generazione codice a barre GS1
  - [x] 3.1 Creare funzione di generazione GS1-128 barcode
    - Implementare encoding con Application Identifiers (AI)
    - Formattare lotto, scadenza (YYMMDD), quantità secondo standard GS1
    - Generare stringa barcode completa con FNC1
    - Generare versione human-readable del codice
    - _Requirements: 2.1, 2.2, 2.4_

  - [ ]* 3.2 Scrivere property test per formato GS1
    - **Property 2: GS1 Barcode Format Compliance**
    - **Validates: Requirements 2.1, 2.2, 2.4**

  - [ ]* 3.3 Scrivere unit test per casi specifici barcode
    - Test con lotto alfanumerico
    - Test con date diverse
    - Test con quantità varie
    - Test formato output human-readable
    - _Requirements: 2.1, 2.2, 2.4_

- [x] 4. Implementare generazione ZPL
  - [x] 4.1 Creare funzione di generazione codice ZPL
    - Implementare template ZPL per etichetta 4x6 pollici
    - Posizionare campi: nome prodotto, lotto, scadenza, quantità, peso
    - Implementare comando ^BC per barcode Code 128
    - Validare sintassi ZPL generato
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 4.2 Scrivere property test per completezza ZPL
    - **Property 9: ZPL Generation Completeness**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

  - [ ]* 4.3 Scrivere unit test per generazione ZPL
    - Test presenza tutti i campi nel ZPL
    - Test formato comandi ZPL (^XA, ^XZ, ^BC)
    - Test gestione caratteri speciali nel nome prodotto
    - Test dimensioni etichetta corrette
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 5. Checkpoint - Verifica funzionalità core backend
  - Assicurarsi che tutti i test passino
  - Verificare che database, barcode e ZPL funzionino correttamente
  - Chiedere all'utente se ci sono domande o problemi

- [x] 6. Implementare API REST backend
  - [x] 6.1 Creare server Express con middleware base
    - Configurare Express server
    - Aggiungere middleware: cors, express.json, error handler
    - Configurare variabili ambiente con dotenv
    - _Requirements: 10.2, 10.4_

  - [x] 6.2 Implementare endpoints per etichette
    - POST /api/labels - Crea e salva etichetta
    - GET /api/labels - Recupera tutte le etichette
    - GET /api/labels/:id - Recupera etichetta specifica
    - DELETE /api/labels/:id - Elimina etichetta
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [x] 6.3 Implementare endpoints per template
    - POST /api/templates - Crea template
    - GET /api/templates - Recupera tutti i template
    - DELETE /api/templates/:id - Elimina template
    - _Requirements: 5.2, 5.3, 5.6_

  - [x] 6.4 Implementare endpoints per generazione barcode e ZPL
    - POST /api/barcode/generate - Genera codice GS1
    - POST /api/zpl/generate - Genera codice ZPL
    - POST /api/zpl/download - Download file ZPL
    - _Requirements: 2.1, 6.1, 7.1, 7.2, 7.3_

  - [x] 6.5 Implementare endpoints per configurazione stampante
    - GET /api/printer/config - Recupera configurazione
    - POST /api/printer/config - Salva configurazione
    - POST /api/printer/test - Test connessione stampante
    - _Requirements: 12.1, 12.2, 12.5_

  - [ ]* 6.6 Scrivere integration test per API
    - Test workflow completo: crea → salva → recupera → elimina
    - Test gestione errori (dati invalidi, ID non esistente)
    - Test validazione input
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 10.4_

- [x] 7. Implementare validazione form frontend
  - [x] 7.1 Creare funzioni di validazione
    - Validazione nome prodotto (non vuoto)
    - Validazione lotto (alfanumerico)
    - Validazione data scadenza (formato gg/mm/aaaa)
    - Validazione quantità (intero positivo)
    - Validazione peso (numero positivo, max 2 decimali)
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 7.2 Scrivere property test per validazione form
    - **Property 1: Form Validation Completeness**
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6**

  - [ ]* 7.3 Scrivere unit test per validazione
    - Test casi validi e invalidi per ogni campo
    - Test messaggi di errore specifici
    - Test combinazioni di errori multipli
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 10.1_

- [x] 8. Implementare componenti React base
  - [x] 8.1 Creare componente App con routing
    - Configurare React Router
    - Creare layout principale con navigazione
    - Definire routes: /, /labels, /templates, /settings
    - _Requirements: 9.1, 9.2_

  - [x] 8.2 Creare componente LabelForm
    - Implementare form con campi: productName, batch, expiryDate, quantity, weight
    - Integrare validazione real-time
    - Mostrare messaggi di errore inline
    - Gestire submit e preview
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 10.1, 10.5_

  - [ ]* 8.3 Scrivere unit test per LabelForm
    - Test rendering campi form
    - Test validazione e messaggi errore
    - Test submit con dati validi
    - Test prevenzione submit con errori
    - _Requirements: 1.1, 10.1, 10.5_

- [x] 9. Implementare anteprima etichetta
  - [x] 9.1 Creare componente LabelPreview
    - Implementare layout simile all'etichetta finale
    - Mostrare tutti i campi: nome, lotto, scadenza, quantità, peso
    - Integrare libreria per rendering barcode (jsbarcode)
    - Aggiornare anteprima in tempo reale
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 9.2 Scrivere property test per completezza anteprima
    - **Property 3: Label Preview Completeness**
    - **Validates: Requirements 3.2**

  - [ ]* 9.3 Scrivere unit test per LabelPreview
    - Test rendering tutti i campi
    - Test rendering barcode
    - Test aggiornamento con nuovi dati
    - _Requirements: 3.2, 3.4_

- [ ] 10. Checkpoint - Verifica UI base
  - Assicurarsi che form e anteprima funzionino
  - Verificare validazione e feedback errori
  - Testare manualmente l'interfaccia
  - Chiedere all'utente se ci sono domande

- [x] 11. Implementare gestione etichette salvate
  - [x] 11.1 Creare componente LabelList
    - Implementare lista etichette con card/table
    - Mostrare: nome prodotto, lotto, scadenza, data creazione
    - Aggiungere pulsanti: visualizza, elimina
    - Implementare ordinamento per data (più recenti prima)
    - _Requirements: 4.3, 4.4, 4.5_

  - [x] 11.2 Integrare API per salvataggio e recupero
    - Implementare chiamata POST /api/labels per salvare
    - Implementare chiamata GET /api/labels per lista
    - Implementare chiamata DELETE /api/labels/:id per eliminare
    - Gestire stati loading ed errori
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [ ]* 11.3 Scrivere property test per ordinamento lista
    - **Property 5: Label List Ordering**
    - **Validates: Requirements 4.3**

  - [ ]* 11.4 Scrivere unit test per LabelList
    - Test rendering lista etichette
    - Test ordinamento per data
    - Test selezione etichetta
    - Test eliminazione etichetta
    - _Requirements: 4.3, 4.4, 4.5_

- [ ] 12. Implementare gestione template
  - [ ] 12.1 Creare componente TemplateManager
    - Implementare lista template
    - Aggiungere form per creare nuovo template
    - Implementare selezione template per pre-fill form
    - Aggiungere pulsante elimina template
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 12.2 Integrare API per template
    - Implementare chiamata POST /api/templates per salvare
    - Implementare chiamata GET /api/templates per lista
    - Implementare chiamata DELETE /api/templates/:id per eliminare
    - Gestire pre-fill form da template selezionato
    - _Requirements: 5.2, 5.3, 5.4, 5.6_

  - [ ]* 12.3 Scrivere property test per template round-trip
    - **Property 7: Template Persistence Round-Trip**
    - **Validates: Requirements 5.2**

  - [ ]* 12.4 Scrivere property test per pre-fill corretto
    - **Property 8: Template Pre-fill Correctness**
    - **Validates: Requirements 5.4**

  - [ ]* 12.5 Scrivere unit test per TemplateManager
    - Test creazione template
    - Test caricamento template in form
    - Test eliminazione template
    - _Requirements: 5.2, 5.4, 5.6_

- [x] 13. Implementare download file ZPL
  - [x] 13.1 Creare funzionalità download ZPL
    - Aggiungere pulsante "Download ZPL" in LabelForm
    - Implementare chiamata POST /api/zpl/download
    - Generare nome file con nome prodotto sanitizzato
    - Triggerare download file .zpl nel browser
    - Mostrare feedback durante download
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 13.2 Scrivere property test per nome file ZPL
    - **Property 10: ZPL Download Filename Convention**
    - **Validates: Requirements 7.2**

  - [ ]* 13.3 Scrivere property test per validità contenuto ZPL
    - **Property 11: ZPL File Content Validity**
    - **Validates: Requirements 7.3**

  - [ ]* 13.4 Scrivere unit test per download ZPL
    - Test generazione nome file corretto
    - Test contenuto file ZPL valido
    - Test gestione caratteri speciali nel nome
    - _Requirements: 7.2, 7.3_

- [ ] 14. Implementare comunicazione con stampante Zebra
  - [ ] 14.1 Creare modulo per comunicazione stampante
    - Implementare connessione TCP/IP per stampante di rete
    - Implementare invio ZPL via socket
    - Gestire timeout e retry
    - Implementare logging operazioni stampa
    - _Requirements: 8.1, 8.2, 8.5, 12.5_

  - [ ] 14.2 Implementare endpoint stampa
    - POST /api/print - Invia ZPL a stampante
    - GET /api/print/status/:jobId - Verifica stato stampa
    - Gestire errori connessione e timeout
    - _Requirements: 8.1, 8.2, 8.5_

  - [ ] 14.3 Integrare stampa nel frontend
    - Aggiungere pulsante "Stampa" in LabelForm
    - Implementare chiamata POST /api/print
    - Mostrare stato stampa (in corso, completata, errore)
    - Gestire errori stampante con messaggi chiari
    - _Requirements: 8.1, 8.3, 8.4_

  - [ ]* 14.4 Scrivere property test per logging stampa
    - **Property 12: Print Job Logging**
    - **Validates: Requirements 8.5**

  - [ ]* 14.5 Scrivere unit test per comunicazione stampante
    - Test invio ZPL via socket (con mock)
    - Test gestione timeout
    - Test logging operazioni
    - Test gestione errori connessione
    - _Requirements: 8.1, 8.2, 8.5_

- [ ] 15. Implementare configurazione stampante
  - [ ] 15.1 Creare componente PrinterConfig
    - Implementare form per configurazione stampante
    - Campi: tipo connessione (network/USB), IP, porta
    - Aggiungere pulsante "Test connessione"
    - Mostrare stato connessione (successo/errore)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 15.2 Integrare API configurazione
    - Implementare chiamata GET /api/printer/config
    - Implementare chiamata POST /api/printer/config
    - Implementare chiamata POST /api/printer/test
    - Gestire feedback test connessione
    - _Requirements: 12.2, 12.3, 12.4_

  - [ ]* 15.3 Scrivere unit test per PrinterConfig
    - Test salvataggio configurazione
    - Test validazione IP address
    - Test feedback test connessione
    - _Requirements: 12.2, 12.3, 12.4_

- [ ] 16. Checkpoint - Verifica funzionalità complete
  - Assicurarsi che tutte le features funzionino end-to-end
  - Testare workflow completo: crea etichetta → anteprima → salva → stampa
  - Testare template e configurazione stampante
  - Chiedere all'utente se ci sono problemi

- [ ] 17. Implementare design responsive
  - [ ] 17.1 Aggiungere CSS responsive
    - Implementare breakpoint per mobile, tablet, desktop
    - Adattare layout form per schermi piccoli
    - Rendere anteprima responsive
    - Ottimizzare lista etichette per mobile
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 17.2 Scrivere test responsive (opzionale)
    - Test rendering su diverse dimensioni schermo
    - Test usabilità su mobile
    - _Requirements: 9.1, 9.2_

- [ ] 18. Implementare gestione errori completa
  - [ ] 18.1 Aggiungere error boundaries React
    - Implementare ErrorBoundary component
    - Mostrare fallback UI per errori React
    - Loggare errori in console
    - _Requirements: 10.2_

  - [ ] 18.2 Migliorare feedback errori
    - Implementare toast notifications per errori API
    - Aggiungere messaggi di errore user-friendly
    - Implementare retry per operazioni fallite
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 18.3 Scrivere property test per messaggi errore validazione
    - **Property 13: Validation Error Messaging**
    - **Validates: Requirements 10.1, 10.5**

  - [ ]* 18.4 Scrivere property test per gestione errori database
    - **Property 14: Database Error Handling**
    - **Validates: Requirements 10.4**

  - [ ]* 18.5 Scrivere unit test per gestione errori
    - Test error boundary
    - Test toast notifications
    - Test retry logic
    - _Requirements: 10.2, 10.3_

- [ ] 19. Implementare test di persistenza e consistenza
  - [ ]* 19.1 Scrivere property test per persistenza dopo restart
    - **Property 15: Data Persistence After Restart**
    - **Validates: Requirements 11.2**

  - [ ]* 19.2 Scrivere property test per consistenza database
    - **Property 16: Database Consistency Invariant**
    - **Validates: Requirements 11.3**

  - [ ]* 19.3 Scrivere property test per idempotenza eliminazione
    - **Property 6: Data Deletion Idempotence**
    - **Validates: Requirements 4.5, 5.6**

- [ ] 20. Testing finale e ottimizzazioni
  - [ ]* 20.1 Eseguire tutti i test e verificare coverage
    - Eseguire unit tests
    - Eseguire property-based tests
    - Verificare coverage minimo 80%
    - Fixare eventuali test falliti

  - [ ] 20.2 Ottimizzazioni performance
    - Aggiungere debouncing su validazione form
    - Implementare caching ZPL per etichette identiche
    - Ottimizzare query database con indici
    - Abilitare compressione gzip per API

  - [ ] 20.3 Preparare per deployment
    - Creare script build per produzione
    - Configurare variabili ambiente
    - Documentare setup e deployment nel README
    - Testare build di produzione

- [ ] 21. Checkpoint finale
  - Eseguire test completo dell'applicazione
  - Verificare che tutti i requisiti siano soddisfatti
  - Testare stampa su stampante Zebra reale (se disponibile)
  - Chiedere all'utente feedback finale

## Notes

- I task marcati con `*` sono opzionali e possono essere saltati per un MVP più veloce
- Ogni task referenzia i requisiti specifici per tracciabilità
- I checkpoint assicurano validazione incrementale
- I property test validano proprietà di correttezza universali
- Gli unit test validano esempi specifici e casi edge
- L'implementazione segue un approccio bottom-up: backend core → API → frontend → integrazione
