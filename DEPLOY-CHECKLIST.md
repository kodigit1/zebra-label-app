# ✅ Checklist Deploy AWS Amplify

## 📋 Pre-Deploy

### Preparazione Codice
- [ ] Codice committato su Git
- [ ] Build locale funzionante (`npm run build`)
- [ ] Test locali passati
- [ ] File `amplify.yml` presente
- [ ] `.gitignore` configurato correttamente
- [ ] `package.json` con tutte le dipendenze

### Account e Credenziali
- [ ] Account AWS creato
- [ ] Credenziali AWS configurate
- [ ] Repository GitHub/GitLab creato
- [ ] Codice pushato su repository remoto

---

## 🚀 Deploy

### Opzione A: Console Web
- [ ] Login su https://console.aws.amazon.com/amplify/
- [ ] Click "New app" → "Host web app"
- [ ] Repository connesso
- [ ] Branch selezionato (main)
- [ ] Build settings verificati
- [ ] Variabili ambiente configurate:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3001`
- [ ] Deploy avviato
- [ ] Build completato con successo
- [ ] URL demo ottenuto

### Opzione B: CLI
- [ ] Amplify CLI installato (`npm install -g @aws-amplify/cli`)
- [ ] AWS configurato (`amplify configure`)
- [ ] Progetto inizializzato (`amplify init`)
- [ ] Hosting aggiunto (`amplify add hosting`)
- [ ] Deploy eseguito (`amplify publish`)
- [ ] URL demo ottenuto

---

## 🧪 Test Post-Deploy

### Funzionalità Base
- [ ] App accessibile via URL
- [ ] HTTPS funzionante (certificato SSL)
- [ ] Homepage carica correttamente
- [ ] Navigazione tra pagine funziona
- [ ] CSS e immagini caricano

### Funzionalità Etichette
- [ ] Form creazione etichetta visibile
- [ ] Validazione campi funziona
- [ ] Anteprima etichetta si aggiorna
- [ ] Salvataggio etichetta funziona
- [ ] Barcode GS1 generato correttamente
- [ ] Lista etichette mostra dati salvati
- [ ] Eliminazione etichetta funziona
- [ ] Download ZPL funziona

### Performance
- [ ] Tempo caricamento < 3 secondi
- [ ] Nessun errore in console browser (F12)
- [ ] API rispondono correttamente
- [ ] Nessun errore 404 o 500

### Responsive
- [ ] Desktop (1920x1080) ✓
- [ ] Tablet (768x1024) ✓
- [ ] Mobile (375x667) ✓

---

## 📱 Preparazione Demo Cliente

### Dati di Test
- [ ] Inserite 3-5 etichette di esempio
- [ ] Dati realistici (nomi prodotti italiani)
- [ ] Date di scadenza future
- [ ] Quantità e pesi vari

### Documentazione
- [ ] Screenshot homepage preparati
- [ ] Screenshot form compilato
- [ ] Screenshot anteprima etichetta
- [ ] Screenshot lista etichette
- [ ] Video demo (opzionale, 2-3 minuti)

### Email Cliente
- [ ] URL demo copiato
- [ ] Credenziali (se necessarie)
- [ ] Istruzioni d'uso preparate
- [ ] Email template compilata
- [ ] Contatti per supporto inclusi

---

## 🔧 Configurazioni Avanzate (Opzionali)

### Custom Domain
- [ ] Dominio acquistato
- [ ] Dominio aggiunto in Amplify Console
- [ ] Record DNS configurati
- [ ] Certificato SSL verificato
- [ ] Redirect HTTP → HTTPS attivo

### Database Persistente
- [ ] DynamoDB creato (se necessario)
- [ ] RDS PostgreSQL configurato (se necessario)
- [ ] Variabili ambiente database aggiunte
- [ ] Migrazioni database eseguite
- [ ] Backup automatici configurati

### Monitoraggio
- [ ] CloudWatch logs attivi
- [ ] Allarmi configurati (errori, latenza)
- [ ] Email notifiche configurate
- [ ] Dashboard monitoraggio verificato

### CI/CD
- [ ] Deploy automatico da Git attivo
- [ ] Branch environments configurati (main, develop)
- [ ] Notifiche deploy configurate
- [ ] Rollback testato

---

## 📊 Metriche da Monitorare

### Prima Settimana
- [ ] Numero visite
- [ ] Tempo medio sessione
- [ ] Etichette create
- [ ] Download ZPL
- [ ] Errori 4xx/5xx
- [ ] Tempo risposta API

### Feedback Cliente
- [ ] Usabilità interfaccia
- [ ] Velocità applicazione
- [ ] Funzionalità mancanti
- [ ] Bug riscontrati
- [ ] Richieste modifiche

---

## 🐛 Troubleshooting

### Build Fallisce
- [ ] Verificato logs build in Amplify Console
- [ ] Verificato `amplify.yml` corretto
- [ ] Verificato `package.json` completo
- [ ] Verificato path corretti (frontend/dist)
- [ ] Pulito cache e ribuildata

### App Non Carica
- [ ] Verificato URL corretto
- [ ] Verificato certificato SSL
- [ ] Verificato console browser per errori
- [ ] Verificato network tab per API failures
- [ ] Verificato variabili ambiente

### API Non Risponde
- [ ] Verificato backend deployato
- [ ] Verificato CORS configurato
- [ ] Verificato variabili ambiente backend
- [ ] Verificato logs CloudWatch
- [ ] Verificato timeout Lambda (se usato)

### Database Non Funziona
- [ ] Verificato connessione database
- [ ] Verificato credenziali database
- [ ] Verificato tabelle create
- [ ] Verificato permessi IAM
- [ ] Verificato logs errori

---

## 📧 Template Email Cliente

```
Oggetto: ✅ Demo Zebra Label Manager - Pronta per il Test

Gentile [Nome Cliente],

Sono lieto di informarvi che la demo dell'applicazione 
Zebra Label Manager è ora online e pronta per essere testata.

🔗 URL DEMO: [inserisci URL Amplify]

📋 CREDENZIALI (se necessarie):
Username: [username]
Password: [password]

🎯 FUNZIONALITÀ DISPONIBILI:
✓ Creazione etichette con validazione automatica
✓ Generazione codice a barre GS1-128
✓ Anteprima etichetta in tempo reale
✓ Salvataggio e gestione storico etichette
✓ Download file ZPL per stampante Zebra ZT 230
✓ Interfaccia responsive (desktop, tablet, mobile)

🧪 COME TESTARE:
1. Accedere all'URL sopra
2. Compilare il form con i dati del prodotto
3. Visualizzare l'anteprima dell'etichetta
4. Salvare l'etichetta
5. Scaricare il file ZPL

📱 L'applicazione è ottimizzata per tutti i dispositivi.

🔒 HOSTING: AWS Amplify (scalabile, sicuro, certificato SSL)

📊 PROSSIMI PASSI:
- Test dell'applicazione da parte vostra
- Raccolta feedback e richieste modifiche
- Implementazione modifiche (se necessarie)
- Deploy in produzione

Resto a completa disposizione per:
- Supporto tecnico
- Domande sull'utilizzo
- Richieste di modifiche
- Pianificazione deploy produzione

📞 CONTATTI:
Email: [tua email]
Tel: [tuo telefono]
Disponibilità: [orari]

Cordiali saluti,
[Tuo Nome]
```

---

## ✅ Checklist Finale

Prima di inviare al cliente:

- [ ] ✅ Tutti i test passati
- [ ] ✅ Dati di esempio inseriti
- [ ] ✅ Screenshot/video preparati
- [ ] ✅ Email compilata e revisionata
- [ ] ✅ URL verificato funzionante
- [ ] ✅ Documentazione pronta
- [ ] ✅ Piano supporto definito
- [ ] ✅ Backup codice effettuato

**🎉 PRONTO PER L'INVIO!**

---

## 📅 Timeline Suggerita

**Giorno 1:**
- Setup e deploy iniziale
- Test funzionalità base
- Inserimento dati esempio

**Giorno 2:**
- Test completo tutte funzionalità
- Preparazione documentazione
- Screenshot e video

**Giorno 3:**
- Invio demo al cliente
- Attesa feedback (3-5 giorni)

**Giorno 6-8:**
- Implementazione modifiche richieste
- Re-deploy e re-test

**Giorno 9-10:**
- Deploy produzione finale
- Formazione cliente (se richiesta)

---

## 🎯 Obiettivi Demo

- [ ] Cliente riesce ad usare l'app autonomamente
- [ ] Tutte le funzionalità core dimostrate
- [ ] Nessun bug critico riscontrato
- [ ] Feedback positivo ricevuto
- [ ] Approvazione per produzione ottenuta

**Buona demo! 🚀**
