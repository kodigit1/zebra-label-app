#!/bin/bash

# 🚀 Script di Setup Automatico per AWS Amplify
# Zebra Label Manager

echo "🚀 Setup AWS Amplify per Zebra Label Manager"
echo "=============================================="
echo ""

# Colori per output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funzione per stampare messaggi
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 1. Verifica prerequisiti
echo "📋 Verifica prerequisiti..."
echo ""

# Verifica Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js non trovato. Installa Node.js 18+ da https://nodejs.org"
    exit 1
fi
print_success "Node.js $(node --version) trovato"

# Verifica npm
if ! command -v npm &> /dev/null; then
    print_error "npm non trovato"
    exit 1
fi
print_success "npm $(npm --version) trovato"

# Verifica Git
if ! command -v git &> /dev/null; then
    print_error "Git non trovato. Installa Git da https://git-scm.com"
    exit 1
fi
print_success "Git $(git --version | cut -d' ' -f3) trovato"

echo ""

# 2. Installa dipendenze
echo "📦 Installazione dipendenze..."
echo ""

if [ ! -d "node_modules" ]; then
    print_info "Installazione dipendenze root..."
    npm install
    print_success "Dipendenze root installate"
else
    print_success "Dipendenze root già installate"
fi

echo ""

# 3. Build del progetto
echo "🔨 Build del progetto..."
echo ""

print_info "Build frontend..."
cd frontend
npm install
npm run build
cd ..
print_success "Frontend buildato"

print_info "Build backend..."
cd backend
npm install
npm run build
cd ..
print_success "Backend buildato"

echo ""

# 4. Verifica Amplify CLI
echo "🔧 Verifica Amplify CLI..."
echo ""

if ! command -v amplify &> /dev/null; then
    print_info "Amplify CLI non trovato. Installazione in corso..."
    npm install -g @aws-amplify/cli
    print_success "Amplify CLI installato"
else
    print_success "Amplify CLI già installato"
fi

echo ""

# 5. Inizializza Git (se necessario)
echo "📝 Verifica repository Git..."
echo ""

if [ ! -d ".git" ]; then
    print_info "Inizializzazione repository Git..."
    git init
    git add .
    git commit -m "Initial commit - Zebra Label Manager"
    print_success "Repository Git inizializzato"
else
    print_success "Repository Git già inizializzato"
fi

echo ""

# 6. Istruzioni finali
echo "✅ Setup completato!"
echo ""
echo "=============================================="
echo "🎯 PROSSIMI PASSI:"
echo "=============================================="
echo ""
echo "OPZIONE 1: Deploy via Console Web (Più Facile)"
echo "----------------------------------------------"
echo "1. Crea repository su GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Pusha il codice:"
echo "   git remote add origin https://github.com/TUO-USERNAME/zebra-label-manager.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Vai su AWS Amplify Console:"
echo "   https://console.aws.amazon.com/amplify/"
echo ""
echo "4. Click 'New app' → 'Host web app'"
echo "5. Connetti GitHub e seleziona il repository"
echo "6. Amplify rileverà automaticamente amplify.yml"
echo "7. Click 'Save and deploy'"
echo ""
echo "=============================================="
echo ""
echo "OPZIONE 2: Deploy via CLI (Più Controllo)"
echo "----------------------------------------------"
echo "1. Configura AWS:"
echo "   amplify configure"
echo ""
echo "2. Inizializza progetto:"
echo "   amplify init"
echo ""
echo "3. Aggiungi hosting:"
echo "   amplify add hosting"
echo ""
echo "4. Deploy:"
echo "   amplify publish"
echo ""
echo "=============================================="
echo ""
echo "📚 Documentazione completa: AWS-AMPLIFY-SETUP.md"
echo ""
echo "🎉 Buon deploy!"
