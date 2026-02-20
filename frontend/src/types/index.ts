/**
 * Etichetta salvata
 */
export interface Label {
  id: string;
  productName: string;
  batch: string;
  expiryDate: string;
  quantity: number;
  weight: number;
  barcodeData: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Template prodotto
 */
export interface Template {
  id: string;
  name: string;
  productName: string;
  weight: number;
  defaultQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Configurazione stampante
 */
export interface PrinterConfig {
  connectionType: 'network' | 'usb';
  ipAddress?: string;
  port?: number;
  usbDevice?: string;
  updatedAt: string;
}

/**
 * Risposta API generica
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    timestamp: string;
  };
  message?: string;
}
