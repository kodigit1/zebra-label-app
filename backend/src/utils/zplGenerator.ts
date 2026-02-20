/**
 * Dati dell'etichetta per generare ZPL
 */
export interface LabelData {
  productName: string;
  batch: string;
  expiryDate: string; // formato: gg/mm/aaaa
  quantity: number;
  weight: number;
  barcodeData: string; // Codice a barre GS1
}

/**
 * Opzioni per la generazione ZPL
 */
export interface ZPLOptions {
  labelWidth?: number; // Larghezza in dots (default: 812 per 4 pollici a 203 DPI)
  labelHeight?: number; // Altezza in dots (default: 1218 per 6 pollici a 203 DPI)
  dpi?: number; // DPI della stampante (default: 203)
}

/**
 * Sanitizza una stringa per l'uso in ZPL
 * Rimuove o sostituisce caratteri che potrebbero causare problemi
 */
function sanitizeForZPL(text: string): string {
  // Rimuovi caratteri di controllo e caratteri speciali problematici
  return text
    .replace(/[\x00-\x1F\x7F]/g, '') // Rimuovi caratteri di controllo
    .replace(/[^\x20-\x7E]/g, '') // Mantieni solo caratteri ASCII stampabili
    .substring(0, 100); // Limita lunghezza per sicurezza
}

/**
 * Formatta il peso per la visualizzazione
 * Converte il peso in grammi con padding
 */
function formatWeight(weight: number): string {
  const grams = Math.round(weight * 1000);
  return grams.toString().padStart(6, '0');
}

/**
 * Formatta la data per la visualizzazione in formato compatto
 * Converte da gg/mm/aaaa a ggmmaa
 */
function formatDateCompact(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    return dateStr;
  }
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2].slice(-2);
  return `${day}${month}${year}`;
}

/**
 * Genera codice ZPL per stampante Zebra ZT 230
 * 
 * Comandi ZPL utilizzati:
 * - ^XA / ^XZ: Inizio/Fine formato etichetta
 * - ^FO: Field Origin (posizione x,y)
 * - ^A0: Font scalabile
 * - ^FD / ^FS: Field Data inizio/fine
 * - ^BC: Barcode Code 128
 * - ^BY: Barcode field default
 * 
 * Layout etichetta (4x6 pollici, 203 DPI):
 * - Nome prodotto: posizione (50, 50), font grande
 * - Lotto: posizione (50, 120)
 * - Scadenza: posizione (50, 180)
 * - Quantità: posizione (50, 240)
 * - Peso: posizione (450, 240)
 * - Barcode: posizione (50, 320), altezza 100 dots
 * 
 * @param data Dati dell'etichetta
 * @param options Opzioni di generazione (opzionale)
 * @returns Codice ZPL pronto per la stampa
 */
export function generateZPL(data: LabelData, options: ZPLOptions = {}): string {
  // Valida input
  if (!data.productName || data.productName.trim() === '') {
    throw new Error('Product name is required');
  }
  
  if (!data.batch || data.batch.trim() === '') {
    throw new Error('Batch number is required');
  }
  
  if (!data.barcodeData || data.barcodeData.trim() === '') {
    throw new Error('Barcode data is required');
  }

  // Sanitizza i dati
  const productName = sanitizeForZPL(data.productName);
  const batch = sanitizeForZPL(data.batch);
  const expiryDate = formatDateCompact(data.expiryDate);
  const quantity = data.quantity.toString();
  const weight = formatWeight(data.weight);
  const barcodeData = sanitizeForZPL(data.barcodeData);

  // Opzioni default
  const labelWidth = options.labelWidth || 812; // 4 pollici a 203 DPI
  const labelHeight = options.labelHeight || 1218; // 6 pollici a 203 DPI
  const dpi = options.dpi || 203;

  // Costruisci il codice ZPL
  const zpl = `^XA

^FO50,50^A0N,50,50^FD${productName}^FS

^FO50,120^A0N,35,35^FDLotto:^FS
^FO200,120^A0N,35,35^FD${batch}^FS

^FO50,180^A0N,35,35^FDScadenza:^FS
^FO250,180^A0N,35,35^FD${expiryDate}^FS

^FO50,240^A0N,35,35^FDQuantita:^FS
^FO250,240^A0N,35,35^FD${quantity}^FS

^FO450,240^A0N,35,35^FDPeso:^FS
^FO580,240^A0N,35,35^FD${weight}^FS

^BY3,3,100
^FO50,320^BCN,100,Y,N,N^FD${barcodeData}^FS

^XZ`;

  return zpl;
}

/**
 * Valida la sintassi di un codice ZPL
 * Verifica che contenga i comandi base necessari
 * 
 * @param zpl Codice ZPL da validare
 * @returns true se il ZPL è sintatticamente valido
 */
export function validateZPL(zpl: string): boolean {
  // Verifica presenza comandi obbligatori
  const hasStart = zpl.includes('^XA');
  const hasEnd = zpl.includes('^XZ');
  
  // Verifica che ^XA venga prima di ^XZ
  const startIndex = zpl.indexOf('^XA');
  const endIndex = zpl.indexOf('^XZ');
  const correctOrder = startIndex >= 0 && endIndex > startIndex;
  
  // Verifica presenza di almeno un campo
  const hasFields = zpl.includes('^FD') && zpl.includes('^FS');
  
  return hasStart && hasEnd && correctOrder && hasFields;
}

/**
 * Estrae informazioni da un codice ZPL
 * Utile per debugging e testing
 * 
 * @param zpl Codice ZPL da analizzare
 * @returns Oggetto con informazioni estratte
 */
export function parseZPL(zpl: string): {
  isValid: boolean;
  hasBarcode: boolean;
  fieldCount: number;
  commands: string[];
} {
  const isValid = validateZPL(zpl);
  const hasBarcode = zpl.includes('^BC');
  
  // Conta i campi
  const fieldMatches = zpl.match(/\^FD/g);
  const fieldCount = fieldMatches ? fieldMatches.length : 0;
  
  // Estrai comandi principali
  const commandPattern = /\^[A-Z]{1,2}/g;
  const commandMatches = zpl.match(commandPattern);
  const commands = commandMatches ? [...new Set(commandMatches)] : [];
  
  return {
    isValid,
    hasBarcode,
    fieldCount,
    commands
  };
}

/**
 * Genera un nome file sicuro per il download ZPL
 * Basato sul nome del prodotto
 * 
 * @param productName Nome del prodotto
 * @returns Nome file sanitizzato con estensione .zpl
 */
export function generateZPLFilename(productName: string): string {
  // Sanitizza il nome del prodotto per uso come filename
  const sanitized = productName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Sostituisci caratteri non alfanumerici con trattino
    .replace(/-+/g, '-') // Rimuovi trattini multipli
    .replace(/^-|-$/g, '') // Rimuovi trattini all'inizio e alla fine
    .substring(0, 50); // Limita lunghezza
  
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  return `label-${sanitized}-${timestamp}.zpl`;
}
