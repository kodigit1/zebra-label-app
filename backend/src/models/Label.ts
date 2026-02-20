/**
 * Modello per un'etichetta
 */
export interface Label {
  id: string;
  productName: string;
  batch: string;
  expiryDate: string; // formato: gg/mm/aaaa
  quantity: number;
  weight: number;
  barcodeData: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dati per creare una nuova etichetta (senza id e timestamp)
 */
export interface CreateLabelData {
  productName: string;
  batch: string;
  expiryDate: string;
  quantity: number;
  weight: number;
  barcodeData: string;
}

/**
 * Rappresentazione database dell'etichetta (con date come stringhe ISO)
 */
export interface LabelRow {
  id: string;
  product_name: string;
  batch: string;
  expiry_date: string;
  quantity: number;
  weight: number;
  barcode_data: string;
  created_at: string;
  updated_at: string;
}

/**
 * Converte una riga database in un oggetto Label
 */
export function labelFromRow(row: LabelRow): Label {
  return {
    id: row.id,
    productName: row.product_name,
    batch: row.batch,
    expiryDate: row.expiry_date,
    quantity: row.quantity,
    weight: row.weight,
    barcodeData: row.barcode_data,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

/**
 * Converte un oggetto Label in una riga database
 */
export function labelToRow(label: Label): LabelRow {
  return {
    id: label.id,
    product_name: label.productName,
    batch: label.batch,
    expiry_date: label.expiryDate,
    quantity: label.quantity,
    weight: label.weight,
    barcode_data: label.barcodeData,
    created_at: label.createdAt.toISOString(),
    updated_at: label.updatedAt.toISOString()
  };
}
