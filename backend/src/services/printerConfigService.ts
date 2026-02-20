import { db } from '../database/schema';
import { PrinterConfig, PrinterConfigRow, UpdatePrinterConfigData, printerConfigFromRow } from '../models/PrinterConfig';

/**
 * Recupera la configurazione della stampante
 */
export function getPrinterConfig(): PrinterConfig {
  const stmt = db.prepare('SELECT * FROM printer_config WHERE id = 1');
  const row = stmt.get() as PrinterConfigRow;
  
  return printerConfigFromRow(row);
}

/**
 * Aggiorna la configurazione della stampante
 */
export function updatePrinterConfig(data: UpdatePrinterConfigData): PrinterConfig {
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    UPDATE printer_config 
    SET connection_type = ?,
        ip_address = ?,
        port = ?,
        usb_device = ?,
        updated_at = ?
    WHERE id = 1
  `);

  stmt.run(
    data.connectionType,
    data.ipAddress ?? null,
    data.port ?? null,
    data.usbDevice ?? null,
    now
  );

  return getPrinterConfig();
}
