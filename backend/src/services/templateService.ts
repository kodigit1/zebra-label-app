import { db } from '../database/schema';
import { Template, TemplateRow, CreateTemplateData, templateFromRow } from '../models/Template';
import { v4 as uuidv4 } from 'uuid';

/**
 * Crea un nuovo template nel database
 */
export function createTemplate(data: CreateTemplateData): Template {
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO templates (id, name, product_name, weight, default_quantity, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.name,
    data.productName,
    data.weight,
    data.defaultQuantity ?? null,
    now,
    now
  );

  return {
    id,
    name: data.name,
    productName: data.productName,
    weight: data.weight,
    defaultQuantity: data.defaultQuantity,
    createdAt: new Date(now),
    updatedAt: new Date(now)
  };
}

/**
 * Recupera un template per ID
 */
export function getTemplateById(id: string): Template | null {
  const stmt = db.prepare('SELECT * FROM templates WHERE id = ?');
  const row = stmt.get(id) as TemplateRow | undefined;
  
  return row ? templateFromRow(row) : null;
}

/**
 * Recupera un template per nome
 */
export function getTemplateByName(name: string): Template | null {
  const stmt = db.prepare('SELECT * FROM templates WHERE name = ?');
  const row = stmt.get(name) as TemplateRow | undefined;
  
  return row ? templateFromRow(row) : null;
}

/**
 * Recupera tutti i template
 */
export function getAllTemplates(): Template[] {
  const stmt = db.prepare('SELECT * FROM templates ORDER BY name ASC');
  const rows = stmt.all() as TemplateRow[];
  
  return rows.map(templateFromRow);
}

/**
 * Elimina un template per ID
 */
export function deleteTemplate(id: string): boolean {
  const stmt = db.prepare('DELETE FROM templates WHERE id = ?');
  const result = stmt.run(id);
  
  return result.changes > 0;
}

/**
 * Conta il numero totale di template
 */
export function countTemplates(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM templates');
  const result = stmt.get() as { count: number };
  
  return result.count;
}
