# 🚀 Deploy Rapido - Comandi Pronti

## ⚡ Vercel (2 minuti)

```bash
npm install -g vercel
vercel
# Segui le istruzioni
# URL: https://zebra-label-manager.vercel.app
```

---

## ☁️ AWS Amplify (10 minuti)

```bash
# 1. Installa CLI
npm install -g @aws-amplify/cli

# 2. Configura AWS
amplify configure

# 3. Inizializza
amplify init

# 4. Aggiungi hosting
amplify add hosting

# 5. Deploy
amplify publish

# URL: https://main.xxxxx.amplifyapp.com
```

---

## 🚂 Railway (3 minuti)

```bash
# Opzione 1: Web UI (più facile)
# 1. Vai su https://railway.app
# 2. Login con GitHub
# 3. "New Project" → "Deploy from GitHub"
# 4. Seleziona repository
# 5. Deploy automatico!

# Opzione 2: CLI
npm install -g @railway/cli
railway login
railway init
railway up

# URL: https://zebra-label-manager.up.railway.app
```

---

## 🎨 Heroku (5 minuti)

```bash
# 1. Installa CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Crea app
heroku create zebra-label-manager

# 4. Deploy
git push heroku main

# 5. Apri
heroku open

# URL: https://zebra-label-manager.herokuapp.com
```

---

## 🌊 DigitalOcean (Web UI)

```bash
# 1. Vai su https://cloud.digitalocean.com/apps
# 2. "Create App"
# 3. Connetti GitHub
# 4. Seleziona repository
# 5. Configura:
#    - Service: backend (Node.js)
#    - Static Site: frontend (React)
# 6. Deploy!

# URL: https://zebra-label-manager-xxxxx.ondigitalocean.app
```

---

## 🔥 Firebase (10 minuti)

```bash
# 1. Installa CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inizializza
firebase init
# Seleziona: Hosting, Functions

# 4. Build
npm run build

# 5. Deploy
firebase deploy

# URL: https://zebra-label-manager.web.app
```

---

## 🌐 Netlify (2 minuti)

```bash
# Opzione 1: Drag & Drop (più veloce)
cd frontend
npm run build
# Vai su https://app.netlify.com/drop
# Trascina cartella dist/

# Opzione 2: CLI
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod

# URL: https://zebra-label-manager.netlify.app
```

---

## 🐳 Render (5 minuti)

```bash
# 1. Vai su https://render.com
# 2. "New" → "Web Service"
# 3. Connetti GitHub
# 4. Configura:
#    - Build Command: npm install && npm run build
#    - Start Command: npm start
# 5. Deploy!

# URL: https://zebra-label-manager.onrender.com
```

---

## 💻 ngrok (30 secondi - Demo locale)

```bash
# 1. Avvia app
npm run dev

# 2. In un altro terminale
ngrok http 3000

# URL temporaneo: https://abc123.ngrok.io
# ⚠️ URL cambia ad ogni riavvio
```

---

## 🎯 Quale Scegliere?

### Per Demo Immediata:
```bash
# Più veloce (30 sec)
ngrok http 3000

# Più professionale (2 min)
vercel
```

### Per Produzione:
```bash
# AWS ecosystem
amplify publish

# Semplicità
railway up

# Controllo
# → DigitalOcean (Web UI)
```

---

## 🔧 Troubleshooting Rapido

### Build fallisce?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port già in uso?
```bash
# Cambia porta in backend/.env
PORT=3002
```

### CORS errors?
```typescript
// backend/src/index.ts
app.use(cors({
  origin: ['https://tuo-frontend-url.com'],
  credentials: true
}));
```

### Database non funziona?
```bash
# Verifica path
DATABASE_PATH=./data/zebra-labels.db

# Crea directory
mkdir -p backend/data
```

---

## 📞 Link Utili

- **Vercel**: https://vercel.com/docs
- **AWS Amplify**: https://docs.amplify.aws
- **Railway**: https://docs.railway.app
- **Heroku**: https://devcenter.heroku.com
- **DigitalOcean**: https://docs.digitalocean.com/products/app-platform
- **Firebase**: https://firebase.google.com/docs/hosting
- **Netlify**: https://docs.netlify.com
- **Render**: https://render.com/docs
- **ngrok**: https://ngrok.com/docs
