# 🚀 Guida Completa AWS Amplify - Zebra Label Manager

## 📋 Prerequisiti

- Account AWS (gratis per 12 mesi)
- Node.js 18+ installato
- Git installato
- Repository GitHub/GitLab/Bitbucket

---

## 🎯 Opzione 1: Deploy via Console Web (Più Facile)

### Passo 1: Prepara il Repository

```bash
# 1. Inizializza Git (se non l'hai già fatto)
git init
git add .
git commit -m "Initial commit - Zebra Label Manager"

# 2. Crea repository su GitHub
# Vai su https://github.com/new
# Nome: zebra-label-manager

# 3. Pusha il codice
git remote add origin https://github.com/TUO-USERNAME/zebra-label-manager.git
git branch -M main
git push -u origin main
```

### Passo 2: Crea App su AWS Amplify

1. **Vai su AWS Console**
   - https://console.aws.amazon.com/amplify/
   - Login con il tuo account AWS

2. **Crea Nuova App**
   - Click su "New app" → "Host web app"
   - Seleziona "GitHub" (o il tuo provider Git)
   - Autorizza AWS Amplify ad accedere ai tuoi repository

3. **Seleziona Repository**
   - Repository: `zebra-label-manager`
   - Branch: `main`
   - Click "Next"

4. **Configura Build Settings**
   
   AWS Amplify rileverà automaticamente il file `amplify.yml` che abbiamo creato!
   
   Verifica che la configurazione sia:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/dist
       files:
         - '**/*'
   ```

5. **Configura Variabili Ambiente**
   
   Click su "Advanced settings" e aggiungi:
   ```
   NODE_ENV=production
   PORT=3001
   ```

6. **Review e Deploy**
   - Review delle impostazioni
   - Click "Save and deploy"
   - ⏳ Attendi 5-10 minuti per il primo deploy

### Passo 3: Ottieni URL Demo

Dopo il deploy, troverai l'URL tipo:
```
https://main.d1234abcd.amplifyapp.com
```

**Condividi questo URL con il cliente!**

---

## 🔧 Opzione 2: Deploy via CLI (Più Controllo)

### Passo 1: Installa Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

### Passo 2: Configura AWS Credentials

```bash
amplify configure
```

Questo aprirà il browser per:
1. Login su AWS Console
2. Crea un nuovo IAM user
3. Scarica le credenziali (Access Key ID e Secret Access Key)
4. Inseriscile nel terminale

### Passo 3: Inizializza Progetto

```bash
cd zebra-label-manager
amplify init
```

Rispondi alle domande:
```
? Enter a name for the project: zebralabelmanager
? Initialize the project with the above configuration? No
? Enter a name for the environment: prod
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building: javascript
? What javascript framework are you using: react
? Source Directory Path: frontend/src
? Distribution Directory Path: frontend/dist
? Build Command: npm run build
? Start Command: npm run dev
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use: default
```

### Passo 4: Aggiungi Hosting

```bash
amplify add hosting
```

Seleziona:
```
? Select the plugin module to execute: Hosting with Amplify Console
? Choose a type: Manual deployment
```

### Passo 5: Deploy!

```bash
amplify publish
```

Questo farà:
- ✅ Build del frontend
- ✅ Build del backend
- ✅ Upload su AWS
- ✅ Configurazione CloudFront CDN
- ✅ Certificato SSL automatico

**Output:**
```
✔ Deployment complete!
https://prod.d1234abcd.amplifyapp.com
```

---

## 🗄️ Aggiungere Database Persistente (Opzionale)

### Opzione A: DynamoDB (NoSQL)

```bash
amplify add storage
```

Seleziona:
```
? Select from one of the below mentioned services: NoSQL Database
? Provide a friendly name: LabelsTable
? Provide table name: Labels
? What would you like to name this column: id
? Choose the data type: string
? Would you like to add another column? Yes
? What would you like to name this column: productName
? Choose the data type: string
? Would you like to add another column? No
? Choose partition key: id
? Do you want to add a sort key? No
? Do you want to add global secondary indexes? No
? Do you want to add a Lambda Trigger? No
```

Deploy:
```bash
amplify push
```

### Opzione B: RDS PostgreSQL (SQL)

Per database SQL, usa AWS RDS:

1. **Vai su AWS RDS Console**
   - https://console.aws.amazon.com/rds/

2. **Crea Database**
   - Engine: PostgreSQL
   - Template: Free tier
   - DB instance identifier: zebra-labels-db
   - Master username: postgres
   - Master password: [scegli password sicura]

3. **Configura Variabili Ambiente in Amplify**
   ```
   DATABASE_URL=postgresql://postgres:password@endpoint:5432/zebra_labels
   ```

---

## 🔐 Configurare Custom Domain (Opzionale)

### Se hai un dominio:

1. **Vai su Amplify Console**
   - Seleziona la tua app
   - Click su "Domain management"

2. **Aggiungi Dominio**
   - Click "Add domain"
   - Inserisci: `demo.tuodominio.com`
   - Amplify configurerà automaticamente:
     - Certificato SSL
     - DNS records
     - HTTPS redirect

3. **Aggiorna DNS**
   - Copia i record DNS forniti da Amplify
   - Aggiungili al tuo provider DNS (GoDaddy, Namecheap, etc.)

---

## 📊 Monitoraggio e Logs

### Visualizza Logs:

```bash
amplify console
```

Oppure vai su:
- https://console.aws.amazon.com/amplify/
- Seleziona la tua app
- Tab "Monitoring"

### Metriche Disponibili:
- ✅ Traffico (requests/min)
- ✅ Errori 4xx/5xx
- ✅ Latenza
- ✅ Build history
- ✅ Deploy history

---

## 🔄 Aggiornamenti Automatici

### Deploy Automatico da Git:

Ogni volta che fai push su GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Amplify farà automaticamente:
1. ✅ Pull del codice
2. ✅ Build
3. ✅ Test (se configurati)
4. ✅ Deploy
5. ✅ Notifica via email

### Configurare Branch Environments:

```bash
# Crea branch develop
git checkout -b develop
git push origin develop

# Su Amplify Console:
# 1. Vai su "App settings" → "Branch settings"
# 2. Click "Connect branch"
# 3. Seleziona "develop"
```

Ora avrai:
- `main` → https://main.d1234.amplifyapp.com (produzione)
- `develop` → https://develop.d1234.amplifyapp.com (staging)

---

## 💰 Costi AWS Amplify

### Free Tier (12 mesi):
- ✅ 1,000 build minutes/mese
- ✅ 15 GB storage
- ✅ 15 GB bandwidth/mese
- ✅ Certificato SSL gratuito

### Dopo Free Tier:
- **Build**: $0.01 per build minute
- **Storage**: $0.023 per GB/mese
- **Bandwidth**: $0.15 per GB
- **Hosting**: $0.01 per GB servito

### Stima per Demo:
- **Costo mensile**: ~$0-5 (molto basso per demo)
- **Costo per 1000 visite**: ~$0.50

---

## 🐛 Troubleshooting

### Build Fallisce?

1. **Controlla logs:**
   ```bash
   amplify console
   # Vai su "Build history" → Click sull'ultimo build
   ```

2. **Errori comuni:**
   
   **"npm ci failed"**
   ```bash
   # Soluzione: Aggiorna package-lock.json
   rm package-lock.json
   npm install
   git add package-lock.json
   git commit -m "Update package-lock"
   git push
   ```

   **"Build command failed"**
   ```yaml
   # Verifica amplify.yml
   # Assicurati che i path siano corretti:
   baseDirectory: frontend/dist  # Non frontend/build
   ```

   **"Module not found"**
   ```bash
   # Verifica che tutte le dipendenze siano in package.json
   npm install --save [missing-package]
   ```

### Backend Non Risponde?

1. **Verifica variabili ambiente:**
   - Amplify Console → Environment variables
   - Aggiungi: `NODE_ENV=production`

2. **Verifica CORS:**
   ```typescript
   // backend/src/index.ts
   app.use(cors({
     origin: ['https://main.d1234.amplifyapp.com'],
     credentials: true
   }));
   ```

### Database SQLite Non Funziona?

⚠️ **Importante**: Amplify non supporta filesystem persistente!

**Soluzioni:**
1. Usa DynamoDB (consigliato per Amplify)
2. Usa RDS PostgreSQL
3. Usa S3 per storage file

---

## 📱 Testare l'App

### Test Locale Prima del Deploy:

```bash
# 1. Build production
npm run build

# 2. Test backend
cd backend
npm start

# 3. Test frontend (in altro terminale)
cd frontend
npm run preview
```

### Test su Amplify:

1. Vai all'URL fornito da Amplify
2. Testa tutte le funzionalità:
   - ✅ Crea etichetta
   - ✅ Salva etichetta
   - ✅ Visualizza lista
   - ✅ Download ZPL
   - ✅ Elimina etichetta

---

## 🎯 Checklist Pre-Demo Cliente

- [ ] App deployata su Amplify
- [ ] URL funzionante e accessibile
- [ ] Certificato SSL attivo (https://)
- [ ] Tutte le funzionalità testate
- [ ] Dati di esempio inseriti
- [ ] Screenshot/video demo preparati
- [ ] Credenziali di accesso (se necessarie)
- [ ] Documentazione pronta

---

## 📧 Inviare Demo al Cliente

### Email Template:

```
Oggetto: Demo Zebra Label Manager - Pronto per il Test

Gentile Cliente,

Sono lieto di presentarvi la demo dell'applicazione Zebra Label Manager.

🔗 URL Demo: https://main.d1234.amplifyapp.com

📋 Funzionalità Disponibili:
- Creazione etichette con validazione campi
- Generazione automatica codice a barre GS1-128
- Anteprima etichetta in tempo reale
- Salvataggio etichette nel database
- Gestione storico etichette
- Download file ZPL per stampante Zebra ZT 230

🧪 Per Testare:
1. Accedere all'URL sopra
2. Compilare il form con i dati del prodotto
3. Visualizzare l'anteprima
4. Salvare l'etichetta
5. Scaricare il file ZPL

📱 L'applicazione è responsive e funziona su desktop, tablet e mobile.

🔒 Hosting: AWS Amplify (scalabile e sicuro)

Resto a disposizione per qualsiasi domanda o modifica.

Cordiali saluti
```

---

## 🚀 Comandi Rapidi

```bash
# Deploy iniziale
amplify init
amplify add hosting
amplify publish

# Aggiornamenti
git add .
git commit -m "Update"
git push origin main
# Amplify fa deploy automatico!

# Visualizza app
amplify console

# Elimina tutto (se necessario)
amplify delete
```

---

## 📚 Risorse Utili

- **Documentazione Amplify**: https://docs.amplify.aws
- **Console AWS**: https://console.aws.amazon.com/amplify/
- **Pricing Calculator**: https://calculator.aws
- **Support**: https://aws.amazon.com/support/

---

## ✅ Prossimi Passi

1. ✅ Deploy su Amplify
2. ✅ Testa l'applicazione
3. ✅ Invia URL al cliente
4. ⏳ Raccogli feedback
5. ⏳ Implementa modifiche richieste
6. ⏳ Deploy in produzione

**Buona demo! 🎉**
