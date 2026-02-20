@echo off
REM Setup AWS Amplify per Zebra Label Manager (Windows)

echo.
echo ========================================
echo Setup AWS Amplify - Zebra Label Manager
echo ========================================
echo.

REM Verifica Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js non trovato. Installa da https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js trovato

REM Verifica npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm non trovato
    pause
    exit /b 1
)
echo [OK] npm trovato

REM Verifica Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git non trovato. Installa da https://git-scm.com
    pause
    exit /b 1
)
echo [OK] Git trovato

echo.
echo Installazione dipendenze...
echo.

REM Installa dipendenze root
if not exist "node_modules" (
    echo Installazione dipendenze root...
    call npm install
    echo [OK] Dipendenze root installate
) else (
    echo [OK] Dipendenze root gia installate
)

echo.
echo Build del progetto...
echo.

REM Build frontend
echo Build frontend...
cd frontend
call npm install
call npm run build
cd ..
echo [OK] Frontend buildato

REM Build backend
echo Build backend...
cd backend
call npm install
call npm run build
cd ..
echo [OK] Backend buildato

echo.
echo Verifica Amplify CLI...
echo.

REM Verifica Amplify CLI
where amplify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installazione Amplify CLI...
    call npm install -g @aws-amplify/cli
    echo [OK] Amplify CLI installato
) else (
    echo [OK] Amplify CLI gia installato
)

echo.
echo Verifica repository Git...
echo.

REM Inizializza Git se necessario
if not exist ".git" (
    echo Inizializzazione repository Git...
    git init
    git add .
    git commit -m "Initial commit - Zebra Label Manager"
    echo [OK] Repository Git inizializzato
) else (
    echo [OK] Repository Git gia inizializzato
)

echo.
echo ========================================
echo Setup completato!
echo ========================================
echo.
echo PROSSIMI PASSI:
echo.
echo OPZIONE 1: Deploy via Console Web
echo ----------------------------------
echo 1. Crea repository su GitHub
echo 2. Pusha il codice:
echo    git remote add origin https://github.com/TUO-USERNAME/zebra-label-manager.git
echo    git branch -M main
echo    git push -u origin main
echo 3. Vai su: https://console.aws.amazon.com/amplify/
echo 4. Click "New app" e segui le istruzioni
echo.
echo OPZIONE 2: Deploy via CLI
echo ----------------------------------
echo 1. amplify configure
echo 2. amplify init
echo 3. amplify add hosting
echo 4. amplify publish
echo.
echo Documentazione: AWS-AMPLIFY-SETUP.md
echo.
pause
