/**
 * Modello per la configurazione della stampante
 */
export interface PrinterConfig {
  id: number;
  connectionType: 'network' | 'usb';
  ipAddress?: string;
  port?: number;
  usbDevice?: string;
  updatedAt: Date;
}

/**
 * Dati per aggiornare la configurazione stampante
 */
export interface UpdatePrinterConfigData {
  connectionType: 'network' | 'usb';
  ipAddress?: string;
  port?: number;
  usbDevice?: string;
}

/**
 * Rappresentazione database della configurazione (con date come stringhe ISO)
 */
export interface PrinterConfigRow {
  id: number;
  connection_type: 'network' | 'usb';
  ip_address: string | null;
  port: number | null;
  usb_device: string | null;
  updated_at: string;
}

/**
 * Converte una riga database in un oggetto PrinterConfig
 */
export function printerConfigFromRow(row: PrinterConfigRow): PrinterConfig {
  return {
    id: row.id,
    connectionType: row.connection_type,
    ipAddress: row.ip_address ?? undefined,
    port: row.port ?? undefined,
    usbDevice: row.usb_device ?? undefined,
    updatedAt: new Date(row.updated_at)
  };
}

/**
 * Converte un oggetto PrinterConfig in una riga database
 */
export function printerConfigToRow(config: PrinterConfig): PrinterConfigRow {
  return {
    id: config.id,
    connection_type: config.connectionType,
    ip_address: config.ipAddress ?? null,
    port: config.port ?? null,
    usb_device: config.usbDevice ?? null,
    updated_at: config.updatedAt.toISOString()
  };
}
