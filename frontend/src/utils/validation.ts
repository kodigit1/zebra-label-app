/**
 * Errori di validazione per il form etichetta
 */
export interface ValidationErrors {
  productName?: string;
  batch?: string;
  expiryDate?: string;
  quantity?: string;
  weight?: string;
}

/**
 * Dati del form etichetta
 */
export interface LabelFormData {
  productName: string;
  batch: string;
  expiryDate: string;
  quantity: string;
  weight: string;
}

/**
 * Valida che il nome prodotto non sia vuoto
 */
export function validateProductName(value: string): string | undefined {
  if (!value || value.trim() === '') {
    return 'Il nome del prodotto è obbligatorio';
  }
  if (value.length > 100) {
    return 'Il nome del prodotto non può superare 100 caratteri';
  }
  return undefined;
}

/**
 * Valida che il lotto sia alfanumerico
 */
export function validateBatch(value: string): string | undefined {
  if (!value || value.trim() === '') {
    return 'Il numero di lotto è obbligatorio';
  }
  
  // Verifica che sia alfanumerico (lettere, numeri, trattini)
  const alphanumericPattern = /^[a-zA-Z0-9\-]+$/;
  if (!alphanumericPattern.test(value)) {
    return 'Il lotto deve contenere solo lettere, numeri e trattini';
  }
  
  if (value.length > 20) {
    return 'Il lotto non può superare 20 caratteri';
  }
  
  return undefined;
}

/**
 * Valida che la data sia nel formato gg/mm/aaaa e sia valida
 */
export function validateExpiryDate(value: string): string | undefined {
  if (!value || value.trim() === '') {
    return 'La data di scadenza è obbligatoria';
  }
  
  // Verifica formato gg/mm/aaaa
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = value.match(datePattern);
  
  if (!match) {
    return 'Formato data non valido. Usa gg/mm/aaaa';
  }
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Verifica che i valori siano nel range corretto
  if (month < 1 || month > 12) {
    return 'Il mese deve essere tra 01 e 12';
  }
  
  if (day < 1 || day > 31) {
    return 'Il giorno deve essere tra 01 e 31';
  }
  
  // Verifica che la data sia valida (considera giorni per mese)
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return 'Data non valida';
  }
  
  // Verifica che la data non sia nel passato
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return 'La data di scadenza non può essere nel passato';
  }
  
  return undefined;
}

/**
 * Valida che la quantità sia un numero intero positivo
 */
export function validateQuantity(value: string): string | undefined {
  if (!value || value.trim() === '') {
    return 'La quantità è obbligatoria';
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return 'La quantità deve essere un numero';
  }
  
  if (!Number.isInteger(num)) {
    return 'La quantità deve essere un numero intero';
  }
  
  if (num <= 0) {
    return 'La quantità deve essere maggiore di zero';
  }
  
  if (num > 999999) {
    return 'La quantità non può superare 999999';
  }
  
  return undefined;
}

/**
 * Valida che il peso sia un numero positivo con massimo 2 decimali
 */
export function validateWeight(value: string): string | undefined {
  if (!value || value.trim() === '') {
    return 'Il peso è obbligatorio';
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return 'Il peso deve essere un numero';
  }
  
  if (num <= 0) {
    return 'Il peso deve essere maggiore di zero';
  }
  
  if (num > 9999) {
    return 'Il peso non può superare 9999 kg';
  }
  
  // Verifica massimo 2 decimali
  const decimalPart = value.split('.')[1];
  if (decimalPart && decimalPart.length > 2) {
    return 'Il peso può avere massimo 2 decimali';
  }
  
  return undefined;
}

/**
 * Valida tutti i campi del form
 */
export function validateLabelForm(data: LabelFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  
  const productNameError = validateProductName(data.productName);
  if (productNameError) errors.productName = productNameError;
  
  const batchError = validateBatch(data.batch);
  if (batchError) errors.batch = batchError;
  
  const expiryDateError = validateExpiryDate(data.expiryDate);
  if (expiryDateError) errors.expiryDate = expiryDateError;
  
  const quantityError = validateQuantity(data.quantity);
  if (quantityError) errors.quantity = quantityError;
  
  const weightError = validateWeight(data.weight);
  if (weightError) errors.weight = weightError;
  
  return errors;
}

/**
 * Verifica se ci sono errori di validazione
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Formatta una data da Date a stringa gg/mm/aaaa
 */
export function formatDateToString(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Parsea una data da stringa gg/mm/aaaa a Date
 */
export function parseDateFromString(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  return new Date(year, month - 1, day);
}
