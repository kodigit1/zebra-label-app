# Zebra Label Manager

Web application per la creazione, gestione e stampa di etichette per stampante Zebra ZT 230.

## 🚀 Demo Rapida

**Deploy su AWS Amplify in 3 passi:**

```bash
# 1. Setup automatico
./setup-amplify.sh  # Mac/Linux
# oppure
setup-amplify.bat   # Windows

# 2. Configura AWS
amplify configure

# 3. Deploy!
amplify publish
```

📖 **Guida completa**: [AWS-AMPLIFY-SETUP.md](AWS-AMPLIFY-SETUP.md)

---

## Caratteristiche

- ✅ Form per inserimento dati prodotto (nome, lotto, scadenza, quantità, peso)
- ✅ Generazione automatica codice a barre GS1-128
- ✅ Anteprima etichetta in tempo reale
- ✅ Salvataggio etichette con storico
- ✅ Gestione template riutilizzabili
- ✅ Generazione file ZPL per stampante Zebra
- ✅ Download file ZPL
- ✅ Stampa diretta su stampante Zebra ZT 230
- ✅ Interfaccia responsive (desktop, tablet, mobile)

## Tecnologie

**Frontend:**
- React 18
- TypeScript
- React Router
- Axios
- jsbarcode

**Backend:**
- Node.js
- Express
- TypeScript
- SQLite3
- better-sqlite3

## Installazione

### Prerequisiti

- Node.js 18+ 
- npm o yarn

### Setup

1. Clona il repository
```bash
git clone <repository-url>
cd zebra-label-manager
```

2. Installa le dipendenze
```bash
npm install
```

3. Configura le variabili ambiente per il backend
```bash
cd backend
cp .env.example .env
# Modifica .env con le tue configurazioni
```

4. Avvia l'applicazione in modalità sviluppo
```bash
npm run dev
```

Questo avvierà:
- Frontend su http://localhost:3000
- Backend su http://localhost:3001

## Build per Produzione

```bash
npm run build
```

## Test

```bash
# Esegui tutti i test
npm test

# Test solo backend
npm run test:backend

# Test solo frontend
npm run test:frontend
```

## Struttura Progetto

```
zebra-label-manager/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Componenti React
│   │   ├── services/   # API client
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utility functions
│   └── package.json
├── backend/            # Node.js backend
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── models/     # Data models
│   │   ├── services/   # Business logic
│   │   └── utils/      # Utility functions
│   ├── data/           # SQLite database
│   └── package.json
└── package.json        # Root package.json
```

## Configurazione Stampante

1. Accedi alle Impostazioni nell'applicazione
2. Inserisci l'indirizzo IP della stampante Zebra (es. 192.168.1.100)
3. Inserisci la porta (default: 9100)
4. Clicca "Test Connessione" per verificare

## Licenza

MIT
