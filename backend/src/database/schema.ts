import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || './data/zebra-labels.db';

// Assicurati che la directory esista
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Crea connessione database
export const db = new Database(DB_PATH);

// Abilita foreign keys
db.pragma('foreign_keys = ON');

/**
 * Inizializza il database creando le tabelle e gli indici
 */
export function initializeDatabase(): void {
  // Tabella labels
  db.exec(`
    CREATE TABLE IF NOT EXISTS labels (
      id TEXT PRIMARY KEY,
      product_name TEXT NOT NULL,
      batch TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      weight REAL NOT NULL,
      barcode_data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Indici per labels
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_labels_created_at 
    ON labels(created_at DESC)
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_labels_product_name 
    ON labels(product_name)
  `);

  // Tabella templates
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      product_name TEXT NOT NULL,
      weight REAL NOT NULL,
      default_quantity INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Indice per templates
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_templates_name 
    ON templates(name)
  `);

  // Tabella printer_config
  db.exec(`
    CREATE TABLE IF NOT EXISTS printer_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      connection_type TEXT NOT NULL CHECK (connection_type IN ('network', 'usb')),
      ip_address TEXT,
      port INTEGER,
      usb_device TEXT,
      updated_at TEXT NOT NULL
    )
  `);

  // Inserisci configurazione default se non esiste
  const configExists = db.prepare('SELECT COUNT(*) as count FROM printer_config WHERE id = 1').get() as { count: number };
  
  if (configExists.count === 0) {
    db.prepare(`
      INSERT INTO printer_config (id, connection_type, ip_address, port, updated_at)
      VALUES (1, 'network', '192.168.1.100', 9100, datetime('now'))
    `).run();
  }

  console.log('Database initialized successfully');
}

/**
 * Chiude la connessione al database
 */
export function closeDatabase(): void {
  db.close();
}

// Inizializza il database all'avvio
initializeDatabase();
