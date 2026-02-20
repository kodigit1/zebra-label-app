import { db } from '../database/schema';
import { Label, LabelRow, CreateLabelData, labelFromRow } from '../models/Label';
import { v4 as uuidv4 } from 'uuid';

/**
 * Crea una nuova etichetta nel database
 */
export function createLabel(data: CreateLabelData): Label {
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO labels (id, product_name, batch, expiry_date, quantity, weight, barcode_data, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.productName,
    data.batch,
    data.expiryDate,
    data.quantity,
    data.weight,
    data.barcodeData,
    now,
    now
  );

  return {
    id,
    productName: data.productName,
    batch: data.batch,
    expiryDate: data.expiryDate,
    quantity: data.quantity,
    weight: data.weight,
    barcodeData: data.barcodeData,
    createdAt: new Date(now),
    updatedAt: new Date(now)
  };
}

/**
 * Recupera un'etichetta per ID
 */
export function getLabelById(id: string): Label | null {
  const stmt = db.prepare('SELECT * FROM labels WHERE id = ?');
  const row = stmt.get(id) as LabelRow | undefined;
  
  return row ? labelFromRow(row) : null;
}

/**
 * Recupera tutte le etichette ordinate per data di creazione (più recenti prima)
 */
export function getAllLabels(): Label[] {
  const stmt = db.prepare('SELECT * FROM labels ORDER BY created_at DESC');
  const rows = stmt.all() as LabelRow[];
  
  return rows.map(labelFromRow);
}

/**
 * Elimina un'etichetta per ID
 */
export function deleteLabel(id: string): boolean {
  const stmt = db.prepare('DELETE FROM labels WHERE id = ?');
  const result = stmt.run(id);
  
  return result.changes > 0;
}

/**
 * Conta il numero totale di etichette
 */
export function countLabels(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM labels');
  const result = stmt.get() as { count: number };
  
  return result.count;
}
