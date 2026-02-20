/**
 * Dati necessari per generare un codice a barre GS1
 */
export interface BarcodeData {
  batch: string;
  expiryDate: string; // formato: gg/mm/aaaa
  quantity: number;
}

/**
 * Risultato della generazione del barcode
 */
export interface BarcodeResult {
  barcodeData: string; // Stringa GS1-128 formattata per il barcode
  humanReadable: string; // Versione leggibile per l'utente
}

/**
 * Converte una data dal formato gg/mm/aaaa al formato YYMMDD richiesto da GS1
 * @param dateStr Data in formato gg/mm/aaaa
 * @returns Data in formato YYMMDD
 */
function formatDateForGS1(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    throw new Error('Invalid date format. Expected gg/mm/aaaa');
  }

  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2].slice(-2); // Prendi solo le ultime 2 cifre dell'anno

  return `${year}${month}${day}`;
}

/**
 * Genera un GTIN-13 di esempio per testing
 * In produzione, questo dovrebbe essere fornito dal consorzio GS1
 * @returns GTIN-13 di esempio
 */
function generateExampleGTIN(): string {
  // GTIN di esempio: 8 cifre prefisso + 4 cifre prodotto + 1 check digit
  // Usiamo un prefisso fittizio 80000000
  const prefix = '80000000';
  const productCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  // Calcola check digit (algoritmo semplificato per esempio)
  const partial = prefix + productCode;
  let sum = 0;
  for (let i = 0; i < partial.length; i++) {
    const digit = parseInt(partial[i]);
    sum += (i % 2 === 0) ? digit * 1 : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return partial + checkDigit;
}

/**
 * Genera un codice a barre GS1-128 con Application Identifiers
 * 
 * Application Identifiers (AI) utilizzati:
 * - (01) GTIN - Global Trade Item Number
 * - (10) Batch/Lot Number
 * - (17) Expiry Date (YYMMDD)
 * - (30) Variable Count
 * 
 * @param data Dati per generare il barcode
 * @returns Oggetto con barcode data e versione human-readable
 */
export function generateGS1Barcode(data: BarcodeData): BarcodeResult {
  // Valida input
  if (!data.batch || data.batch.trim() === '') {
    throw new Error('Batch number is required');
  }
  
  if (!data.expiryDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(data.expiryDate)) {
    throw new Error('Invalid expiry date format. Expected gg/mm/aaaa');
  }
  
  if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
    throw new Error('Quantity must be a positive integer');
  }

  // Genera GTIN di esempio
  const gtin = generateExampleGTIN();
  
  // Formatta la data per GS1
  const expiryDateGS1 = formatDateForGS1(data.expiryDate);
  
  // Formatta la quantità (max 8 cifre)
  const quantityStr = data.quantity.toString().padStart(1, '0');
  
  // Costruisci il barcode data con AI
  // Nota: In un barcode reale GS1-128, FNC1 è rappresentato come carattere speciale
  // Per semplicità, usiamo il formato leggibile con parentesi
  const barcodeData = `01${gtin}10${data.batch}17${expiryDateGS1}30${quantityStr}`;
  
  // Costruisci la versione human-readable
  const humanReadable = `(01)${gtin}(10)${data.batch}(17)${expiryDateGS1}(30)${quantityStr}`;

  return {
    barcodeData,
    humanReadable
  };
}

/**
 * Valida un codice a barre GS1 per verificare che contenga tutti gli AI richiesti
 * @param barcodeData Stringa del barcode da validare
 * @returns true se il barcode è valido
 */
export function validateGS1Barcode(barcodeData: string): boolean {
  // Verifica presenza AI richiesti
  const hasGTIN = barcodeData.includes('01') || barcodeData.includes('(01)');
  const hasBatch = barcodeData.includes('10') || barcodeData.includes('(10)');
  const hasExpiry = barcodeData.includes('17') || barcodeData.includes('(17)');
  const hasQuantity = barcodeData.includes('30') || barcodeData.includes('(30)');
  
  return hasGTIN && hasBatch && hasExpiry && hasQuantity;
}

/**
 * Estrae i componenti da un barcode GS1 human-readable
 * @param humanReadable Stringa human-readable del barcode
 * @returns Oggetto con i componenti estratti
 */
export function parseGS1Barcode(humanReadable: string): {
  gtin?: string;
  batch?: string;
  expiryDate?: string;
  quantity?: string;
} {
  const result: any = {};
  
  // Estrai GTIN (01)
  const gtinMatch = humanReadable.match(/\(01\)(\d{13})/);
  if (gtinMatch) result.gtin = gtinMatch[1];
  
  // Estrai Batch (10)
  const batchMatch = humanReadable.match(/\(10\)([^\(]+)/);
  if (batchMatch) result.batch = batchMatch[1];
  
  // Estrai Expiry Date (17)
  const expiryMatch = humanReadable.match(/\(17\)(\d{6})/);
  if (expiryMatch) result.expiryDate = expiryMatch[1];
  
  // Estrai Quantity (30)
  const quantityMatch = humanReadable.match(/\(30\)(\d+)/);
  if (quantityMatch) result.quantity = quantityMatch[1];
  
  return result;
}
