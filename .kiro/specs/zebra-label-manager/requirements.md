# Requirements Document

## Introduction

Sistema web per la creazione, gestione e stampa di etichette per stampante Zebra ZT 230. L'applicazione permette di inserire dati di prodotto, generare codici a barre GS1, salvare template riutilizzabili e stampare etichette direttamente sulla stampante o scaricare file ZPL.

## Glossary

- **Label_Manager**: Il sistema web completo per la gestione delle etichette
- **Zebra_Printer**: Stampante per etichette Zebra ZT 230
- **ZPL**: Zebra Programming Language, linguaggio di programmazione per stampanti Zebra
- **GS1_Barcode**: Codice a barre standard GS1 per identificazione prodotti
- **Template**: Modello di etichetta salvato con dati predefiniti riutilizzabile
- **Label_Data**: Insieme dei dati di un'etichetta (nome prodotto, lotto, scadenza, quantità, peso, codice a barre)
- **Frontend**: Applicazione React per l'interfaccia utente
- **Backend**: Server Node.js per la gestione dati e generazione ZPL
- **Database**: Sistema di persistenza per etichette e template

## Requirements

### Requirement 1: Gestione Dati Etichetta

**User Story:** Come utente, voglio inserire i dati del prodotto in un form, così da poter creare un'etichetta completa con tutte le informazioni necessarie.

#### Acceptance Criteria

1. WHEN un utente accede al form di creazione etichetta, THEN THE Frontend SHALL display campi per nome prodotto, lotto, scadenza, quantità e peso
2. WHEN un utente inserisce il nome prodotto, THEN THE Frontend SHALL validate che il campo non sia vuoto
3. WHEN un utente inserisce il lotto, THEN THE Frontend SHALL accept formato alfanumerico
4. WHEN un utente inserisce la scadenza, THEN THE Frontend SHALL validate che sia una data valida in formato gg/mm/aaaa
5. WHEN un utente inserisce la quantità, THEN THE Frontend SHALL validate che sia un numero intero positivo
6. WHEN un utente inserisce il peso, THEN THE Frontend SHALL validate che sia un numero positivo con massimo 2 decimali

### Requirement 2: Generazione Codice a Barre GS1

**User Story:** Come utente, voglio che il sistema generi automaticamente un codice a barre GS1 di esempio, così da poter testare le etichette in attesa delle credenziali ufficiali.

#### Acceptance Criteria

1. WHEN un utente completa i dati dell'etichetta, THEN THE Backend SHALL generate un codice a barre GS1 di esempio basato sui dati inseriti
2. WHEN il codice a barre viene generato, THEN THE Backend SHALL include lotto, scadenza e quantità nel formato GS1-128
3. WHEN il codice a barre viene visualizzato, THEN THE Frontend SHALL display il codice in formato leggibile sotto il barcode
4. THE Backend SHALL use Application Identifier (AI) standard GS1: (01) per GTIN, (10) per lotto, (17) per scadenza, (30) per quantità

### Requirement 3: Anteprima Etichetta

**User Story:** Come utente, voglio vedere un'anteprima dell'etichetta prima di stamparla, così da verificare che tutti i dati siano corretti.

#### Acceptance Criteria

1. WHEN un utente completa il form, THEN THE Frontend SHALL display un'anteprima dell'etichetta con layout simile all'output finale
2. WHEN l'anteprima viene mostrata, THEN THE Frontend SHALL display tutti i campi: nome prodotto, lotto, scadenza, quantità, peso e codice a barre
3. WHEN i dati vengono modificati, THEN THE Frontend SHALL update l'anteprima in tempo reale
4. THE Frontend SHALL display il codice a barre come immagine renderizzata nell'anteprima

### Requirement 4: Salvataggio Etichette

**User Story:** Come utente, voglio salvare le etichette create, così da poter consultare lo storico e ristampare etichette precedenti.

#### Acceptance Criteria

1. WHEN un utente clicca sul pulsante salva, THEN THE Backend SHALL store i dati dell'etichetta nel Database
2. WHEN un'etichetta viene salvata, THEN THE Backend SHALL assign un ID univoco e timestamp di creazione
3. WHEN un utente accede alla lista etichette, THEN THE Frontend SHALL display tutte le etichette salvate ordinate per data di creazione
4. WHEN un utente seleziona un'etichetta salvata, THEN THE Frontend SHALL load i dati e display l'anteprima
5. WHEN un utente vuole eliminare un'etichetta, THEN THE Backend SHALL remove l'etichetta dal Database

### Requirement 5: Gestione Template

**User Story:** Come utente, voglio salvare template di prodotti ricorrenti, così da non dover reinserire gli stessi dati ogni volta.

#### Acceptance Criteria

1. WHEN un utente crea un'etichetta, THEN THE Frontend SHALL provide un'opzione per salvare come template
2. WHEN un template viene salvato, THEN THE Backend SHALL store nome prodotto, peso e altri dati predefiniti nel Database
3. WHEN un utente accede alla lista template, THEN THE Frontend SHALL display tutti i template salvati
4. WHEN un utente seleziona un template, THEN THE Frontend SHALL pre-fill il form con i dati del template
5. WHEN un utente carica un template, THEN THE Frontend SHALL allow modifica di lotto, scadenza e quantità
6. WHEN un utente vuole eliminare un template, THEN THE Backend SHALL remove il template dal Database

### Requirement 6: Generazione File ZPL

**User Story:** Come utente, voglio generare il codice ZPL dell'etichetta, così da poter stampare sulla stampante Zebra ZT 230.

#### Acceptance Criteria

1. WHEN un utente richiede la stampa, THEN THE Backend SHALL generate codice ZPL conforme alle specifiche Zebra ZT 230
2. WHEN il codice ZPL viene generato, THEN THE Backend SHALL include tutti i campi dell'etichetta posizionati correttamente
3. WHEN il codice ZPL include il barcode, THEN THE Backend SHALL use il comando ^BC per Code 128 con encoding GS1
4. THE Backend SHALL format il codice ZPL con dimensioni appropriate per etichette standard (4x6 pollici o personalizzabile)
5. WHEN il codice ZPL viene generato, THEN THE Backend SHALL validate la sintassi prima di inviarlo

### Requirement 7: Download File ZPL

**User Story:** Come utente, voglio scaricare il file ZPL sul mio computer, così da poterlo stampare manualmente o conservarlo.

#### Acceptance Criteria

1. WHEN un utente clicca sul pulsante download ZPL, THEN THE Frontend SHALL trigger il download di un file .zpl
2. WHEN il file viene scaricato, THEN THE Backend SHALL include il nome del prodotto nel nome del file
3. WHEN il file viene aperto, THEN THE file SHALL contain codice ZPL valido e leggibile
4. THE Frontend SHALL provide feedback visivo durante il download

### Requirement 8: Stampa Diretta su Zebra

**User Story:** Come utente, voglio stampare direttamente sulla stampante Zebra collegata, così da ottenere l'etichetta immediatamente senza passaggi manuali.

#### Acceptance Criteria

1. WHEN un utente clicca sul pulsante stampa, THEN THE Backend SHALL send il codice ZPL alla Zebra_Printer
2. WHEN la stampante è disponibile, THEN THE Backend SHALL establish connessione con la Zebra_Printer sulla rete locale o USB
3. WHEN la stampa viene inviata, THEN THE Frontend SHALL display lo stato della stampa (in corso, completata, errore)
4. IF la stampante non è disponibile, THEN THE Frontend SHALL display un messaggio di errore chiaro
5. WHEN la stampa è completata, THEN THE Backend SHALL log l'operazione con timestamp

### Requirement 9: Interfaccia Utente Responsive

**User Story:** Come utente, voglio utilizzare l'applicazione da diversi dispositivi, così da poter creare etichette anche da tablet o smartphone.

#### Acceptance Criteria

1. WHEN un utente accede da desktop, THEN THE Frontend SHALL display layout ottimizzato per schermi grandi
2. WHEN un utente accede da tablet o smartphone, THEN THE Frontend SHALL adapt il layout per schermi piccoli
3. WHEN l'interfaccia viene ridimensionata, THEN THE Frontend SHALL maintain usabilità e leggibilità
4. THE Frontend SHALL use design responsive con breakpoint appropriati

### Requirement 10: Validazione e Gestione Errori

**User Story:** Come utente, voglio ricevere messaggi chiari quando inserisco dati non validi, così da correggere gli errori facilmente.

#### Acceptance Criteria

1. WHEN un utente inserisce dati non validi, THEN THE Frontend SHALL display messaggi di errore specifici per ogni campo
2. WHEN si verifica un errore di connessione al backend, THEN THE Frontend SHALL display un messaggio di errore user-friendly
3. WHEN si verifica un errore di stampa, THEN THE Frontend SHALL display dettagli dell'errore e suggerimenti
4. WHEN si verifica un errore di salvataggio, THEN THE Backend SHALL log l'errore e return un messaggio appropriato
5. THE Frontend SHALL prevent invio del form se ci sono errori di validazione

### Requirement 11: Persistenza Dati

**User Story:** Come amministratore di sistema, voglio che i dati siano salvati in modo persistente, così da non perdere etichette e template in caso di riavvio del server.

#### Acceptance Criteria

1. THE Backend SHALL use un Database per memorizzare etichette e template
2. WHEN il server viene riavviato, THEN THE Backend SHALL maintain tutti i dati salvati
3. WHEN vengono effettuate operazioni di scrittura, THEN THE Backend SHALL ensure consistenza dei dati
4. THE Backend SHALL implement backup automatico dei dati periodicamente

### Requirement 12: Configurazione Stampante

**User Story:** Come utente, voglio configurare i parametri di connessione alla stampante, così da poter utilizzare diverse stampanti Zebra sulla rete.

#### Acceptance Criteria

1. WHEN un utente accede alle impostazioni, THEN THE Frontend SHALL display opzioni per configurare indirizzo IP o porta USB della stampante
2. WHEN la configurazione viene salvata, THEN THE Backend SHALL validate la connessione alla Zebra_Printer
3. WHEN la connessione è valida, THEN THE Frontend SHALL display conferma di connessione riuscita
4. IF la connessione fallisce, THEN THE Frontend SHALL display messaggio di errore con dettagli diagnostici
5. THE Backend SHALL allow configurazione di timeout e retry per la connessione
