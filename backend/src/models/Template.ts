/**
 * Modello per un template di prodotto
 */
export interface Template {
  id: string;
  name: string;
  productName: string;
  weight: number;
  defaultQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dati per creare un nuovo template (senza id e timestamp)
 */
export interface CreateTemplateData {
  name: string;
  productName: string;
  weight: number;
  defaultQuantity?: number;
}

/**
 * Rappresentazione database del template (con date come stringhe ISO)
 */
export interface TemplateRow {
  id: string;
  name: string;
  product_name: string;
  weight: number;
  default_quantity: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Converte una riga database in un oggetto Template
 */
export function templateFromRow(row: TemplateRow): Template {
  return {
    id: row.id,
    name: row.name,
    productName: row.product_name,
    weight: row.weight,
    defaultQuantity: row.default_quantity ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

/**
 * Converte un oggetto Template in una riga database
 */
export function templateToRow(template: Template): TemplateRow {
  return {
    id: template.id,
    name: template.name,
    product_name: template.productName,
    weight: template.weight,
    default_quantity: template.defaultQuantity ?? null,
    created_at: template.createdAt.toISOString(),
    updated_at: template.updatedAt.toISOString()
  };
}
