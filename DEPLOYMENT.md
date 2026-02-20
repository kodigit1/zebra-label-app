# Guida al Deployment - Zebra Label Manager

## 📊 Confronto Piattaforme

| Piattaforma | Velocità Setup | Costo | Full-Stack | SSL | Database | Ideale Per |
|-------------|----------------|-------|------------|-----|----------|------------|
| **Vercel** | ⚡ 2 min | Gratis | ✅ | ✅ | ❌ | Demo veloci |
| **AWS Amplify** | 🔧 10 min | Gratis* | ✅ | ✅ | ✅ | Produzione AWS |
| **Netlify** | ⚡ 2 min | Gratis | ⚠️ Frontend | ✅ | ❌ | Frontend only |
| **Railway** | ⚡ 3 min | $5/mese | ✅ | ✅ | ✅ | Full-stack |
| **Render** | 🔧 5 min | Gratis | ✅ | ✅ | ✅ | Full-stack |
| **Heroku** | 🔧 5 min | $7/mese | ✅ | ✅ | ✅ | Classico |
| **DigitalOcean** | 🔧 15 min | $5/mese | ✅ | ✅ | ✅ | Controllo totale |

*AWS Amplify: gratis per 12 mesi, poi pay-as-you-go

---

## 🚀 Opzione 1: Vercel (Consigliata per Demo)

Vercel offre hosting gratuito con deploy automatico da Git.

### Passi:

1. **Crea account su Vercel**
   - Vai su https://vercel.com
   - Registrati gratuitamente con GitHub/GitLab/Bitbucket

2. **Inizializza Git (se non l'hai già fatto)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Pusha su GitHub/GitLab**
   ```bash
   # Crea un nuovo repository su GitHub
   git remote add origin https://github.com/tuo-username/zebra-label-manager.git
   git push -u origin main
   ```

4. **Deploy su Vercel**
   - Vai su https://vercel.com/new
   - Importa il tuo repository
   - Vercel rileverà automaticamente la configurazione
   - Clicca "Deploy"

5. **URL Demo**
   - Vercel ti fornirà un URL tipo: `https://zebra-label-manager.vercel.app`
   - Condividi questo URL con il cliente!

---

## ☁️ Opzione 2: AWS Amplify (Produzione Enterprise)

AWS Amplify è perfetto se il cliente usa già AWS o vuole scalabilità enterprise.

### Configurazione:

1. **Installa Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Inizializza Progetto**
   ```bash
   amplify init
   # Nome progetto: zebra-label-manager
   # Environment: prod
   # Editor: Visual Studio Code
   # App type: javascript
   # Framework: react
   # Source directory: frontend/src
   # Distribution directory: frontend/dist
   # Build command: npm run build
   # Start command: npm run dev
   ```

3. **Aggiungi Hosting**
   ```bash
   amplify add hosting
   # Seleziona: Hosting with Amplify Console
   # Tipo: Manual deployment
   ```

4. **Aggiungi API (Backend)**
   ```bash
   amplify add api
   # Seleziona: REST
   # Nome: zebraapi
   # Path: /api
   # Lambda function: Crea nuova
   ```

5. **Aggiungi Database**
   ```bash
   amplify add storage
   # Seleziona: NoSQL Database (DynamoDB)
   # Nome tabella: Labels
   ```

6. **Deploy**
   ```bash
   amplify push
   amplify publish
   ```

### Configurazione amplify.yml:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
backend:
  phases:
    preBuild:
      commands:
        - cd backend
        - npm install
    build:
      commands:
        - npm run build
```

### Vantaggi AWS Amplify:
- ✅ Integrazione completa AWS (S3, Lambda, DynamoDB, CloudFront)
- ✅ CI/CD automatico da Git
- ✅ Scalabilità automatica
- ✅ Monitoraggio e logs avanzati
- ✅ Custom domain gratuito
- ✅ Database persistente (DynamoDB)

### Costi:
- **Gratis**: 1000 build minutes/mese, 15GB storage, 15GB bandwidth
- **Dopo**: ~$0.01 per build minute, $0.023/GB storage

---

## 🐳 Opzione 3: Docker + Render/Railway

### Crea Dockerfile:

```dockerfile
# Backend
FROM node:18-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Frontend
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Production
FROM node:18-alpine
WORKDIR /app
COPY --from=backend /app/backend/dist ./backend/dist
COPY --from=backend /app/backend/node_modules ./backend/node_modules
COPY --from=frontend /app/frontend/dist ./frontend/dist
COPY backend/package.json ./backend/
EXPOSE 3001
CMD ["node", "backend/dist/index.js"]
```

### Deploy su Render.com:
1. Vai su https://render.com
2. Crea "New Web Service"
3. Connetti il repository
4. Render farà il deploy automatico

---

## ☁️ Opzione 4: Netlify + Netlify Functions

### Frontend su Netlify:
```bash
cd frontend
npm run build
# Trascina la cartella dist su https://app.netlify.com/drop
```

### Backend su Railway:
1. Vai su https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Seleziona il repository
4. Railway rileverà automaticamente Node.js

---

## 🚂 Opzione 5: Railway.app (Semplicissimo)

Railway è perfetto per full-stack con database incluso.

### Setup (2 minuti):

1. **Vai su https://railway.app**
2. **Login con GitHub**
3. **New Project → Deploy from GitHub**
4. **Seleziona il repository**
5. **Railway rileva automaticamente:**
   - Node.js backend
   - React frontend
   - Crea database PostgreSQL automaticamente

### Configurazione automatica:
Railway legge `package.json` e configura tutto automaticamente!

### Variabili Ambiente:
```
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=${{PORT}}
```

### Costi:
- **Gratis**: $5 credito/mese
- **Hobby**: $5/mese
- **Pro**: $20/mese

### URL Demo:
`https://zebra-label-manager.up.railway.app`

---

## 🎨 Opzione 6: Heroku (Classico)

Heroku è una piattaforma consolidata, ottima per produzione.

### Setup:

1. **Installa Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Crea App**
   ```bash
   heroku create zebra-label-manager
   ```

3. **Aggiungi Buildpack**
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```

4. **Configura Procfile**
   ```
   web: cd backend && npm start
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Aggiungi Database**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

### Costi:
- **Eco Dynos**: $5/mese (sostituisce il piano gratuito)
- **Basic**: $7/mese
- **Standard**: $25/mese

---

## 🌊 Opzione 7: DigitalOcean App Platform

DigitalOcean offre controllo e semplicità.

### Setup:

1. **Vai su https://cloud.digitalocean.com/apps**
2. **Create App → GitHub**
3. **Seleziona repository**
4. **Configura:**
   - **Web Service**: backend (Node.js)
   - **Static Site**: frontend (React)
   - **Database**: PostgreSQL

### Configurazione:
```yaml
name: zebra-label-manager
services:
  - name: backend
    github:
      repo: tuo-username/zebra-label-manager
      branch: main
    source_dir: /backend
    build_command: npm install && npm run build
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
  - name: frontend
    github:
      repo: tuo-username/zebra-label-manager
      branch: main
    source_dir: /frontend
    build_command: npm install && npm run build
    output_dir: /dist
databases:
  - name: labels-db
    engine: PG
    version: "14"
```

### Costi:
- **Basic**: $5/mese
- **Professional**: $12/mese
- **Database**: $15/mese

---

## 🔥 Opzione 8: Firebase Hosting + Cloud Functions

Google Firebase per chi usa già Google Cloud.

### Setup:

1. **Installa Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Inizializza**
   ```bash
   firebase init
   # Seleziona: Hosting, Functions
   # Public directory: frontend/dist
   # Functions directory: backend
   ```

3. **Configura firebase.json**
   ```json
   {
     "hosting": {
       "public": "frontend/dist",
       "rewrites": [
         {
           "source": "/api/**",
           "function": "api"
         },
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     },
     "functions": {
       "source": "backend"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Costi:
- **Spark (Gratis)**: 10GB storage, 360MB/day functions
- **Blaze (Pay-as-you-go)**: $0.026/GB storage

---

## 🖥️ Opzione 9: Deploy Locale per Demo

Se vuoi fare una demo dal tuo computer:

### 1. Build Production:
```bash
npm install
npm run build
```

### 2. Avvia in produzione:
```bash
# Backend
cd backend
npm start

# Frontend (in un altro terminale)
cd frontend
npm run preview
```

### 3. Usa ngrok per URL pubblico temporaneo:
```bash
# Installa ngrok: https://ngrok.com/download
ngrok http 3000
```

Ngrok ti darà un URL tipo: `https://abc123.ngrok.io`

---

## 📝 Note Importanti

### Variabili Ambiente per Produzione:

Crea `.env` nel backend:
```
PORT=3001
NODE_ENV=production
DATABASE_PATH=./data/zebra-labels.db
```

### CORS per Produzione:

Se frontend e backend sono su domini diversi, aggiorna `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: ['https://tuo-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

---

## 🎯 Raccomandazioni per Caso d'Uso

### 🚀 Demo Veloce al Cliente (oggi):
1. **ngrok** - 30 secondi, URL temporaneo
2. **Vercel** - 2 minuti, URL permanente

### 💼 Presentazione Professionale:
1. **AWS Amplify** - Integrazione AWS, scalabile
2. **Railway** - Setup veloce, database incluso
3. **Vercel** - Deploy automatico, performante

### 🏢 Produzione Enterprise:
1. **AWS Amplify** - Ecosistema AWS completo
2. **DigitalOcean** - Controllo totale, prezzo fisso
3. **Heroku** - Affidabile, supporto enterprise

### 💰 Budget Limitato:
1. **Vercel** - Gratis per sempre
2. **Netlify** - Gratis (solo frontend)
3. **Railway** - $5 credito gratis/mese

### 🔒 Massima Sicurezza:
1. **AWS Amplify** - Compliance AWS
2. **DigitalOcean** - VPC privato
3. **Heroku** - Certificazioni enterprise

---

## 📊 Tabella Decisionale Rapida

**Hai 5 minuti?** → Vercel o ngrok
**Hai 15 minuti?** → Railway o Render
**Hai 30 minuti?** → AWS Amplify o DigitalOcean
**Hai 1 ora?** → Heroku o Firebase

**Cliente usa AWS?** → AWS Amplify
**Cliente usa Google Cloud?** → Firebase
**Cliente vuole semplicità?** → Vercel o Railway
**Cliente vuole controllo?** → DigitalOcean

---

## 🎯 Raccomandazione per Demo Cliente

**Usa Railway o Vercel** - Sono le soluzioni più veloci:
- Deploy in 2 minuti
- URL permanente gratuito
- SSL automatico
- Aggiornamenti automatici da Git

**Comando rapido:**
```bash
npm install -g vercel
vercel
```

Segui le istruzioni e avrai il tuo URL demo in pochi secondi!

---

## 🔧 Troubleshooting

### Database SQLite in produzione:
- Vercel/Netlify non supportano filesystem persistente
- Per demo: va bene, i dati si resettano ad ogni deploy
- Per produzione: usa PostgreSQL o MongoDB

### Build errors:
```bash
# Pulisci e reinstalla
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📧 Supporto

Per problemi di deployment, controlla:
- Logs su Vercel/Render dashboard
- Console del browser (F12)
- Network tab per errori API
