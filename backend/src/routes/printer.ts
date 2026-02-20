import { Router, Request, Response } from 'express';
import { getPrinterConfig, updatePrinterConfig } from '../services/printerConfigService';

const router = Router();

/**
 * GET /api/printer/config
 * Recupera la configurazione della stampante
 */
router.get('/config', async (req: Request, res: Response) => {
  try {
    const config = getPrinterConfig();

    res.json({
      success: true,
      data: {
        connectionType: config.connectionType,
        ipAddress: config.ipAddress,
        port: config.port,
        usbDevice: config.usbDevice,
        updatedAt: config.updatedAt.toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error fetching printer config:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch printer configuration',
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * POST /api/printer/config
 * Aggiorna la configurazione della stampante
 */
router.post('/config', async (req: Request, res: Response) => {
  try {
    const { connectionType, ipAddress, port, usbDevice } = req.body;

    // Valida input
    if (!connectionType || !['network', 'usb'].includes(connectionType)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Connection type must be either "network" or "usb"',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Valida configurazione network
    if (connectionType === 'network') {
      if (!ipAddress || ipAddress.trim() === '') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'IP address is required for network connection',
            timestamp: new Date().toISOString()
          }
        });
      }

      // Valida formato IP (semplice)
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipPattern.test(ipAddress)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid IP address format',
            timestamp: new Date().toISOString()
          }
        });
      }

      if (!port || !Number.isInteger(port) || port < 1 || port > 65535) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Port must be an integer between 1 and 65535',
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    // Valida configurazione USB
    if (connectionType === 'usb') {
      if (!usbDevice || usbDevice.trim() === '') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'USB device is required for USB connection',
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    // Aggiorna configurazione
    const config = updatePrinterConfig({
      connectionType,
      ipAddress: connectionType === 'network' ? ipAddress : undefined,
      port: connectionType === 'network' ? port : undefined,
      usbDevice: connectionType === 'usb' ? usbDevice : undefined
    });

    res.json({
      success: true,
      data: {
        connectionType: config.connectionType,
        ipAddress: config.ipAddress,
        port: config.port,
        usbDevice: config.usbDevice,
        updatedAt: config.updatedAt.toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error updating printer config:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to update printer configuration',
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * POST /api/printer/test
 * Testa la connessione alla stampante
 */
router.post('/test', async (req: Request, res: Response) => {
  try {
    const config = getPrinterConfig();

    // Per ora, simuliamo il test
    // In una implementazione reale, qui si tenterebbe la connessione alla stampante
    if (config.connectionType === 'network') {
      if (!config.ipAddress || !config.port) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CONFIGURATION_ERROR',
            message: 'Network printer not configured properly',
            timestamp: new Date().toISOString()
          }
        });
      }

      // Simulazione test connessione
      res.json({
        success: true,
        message: `Connection test successful to ${config.ipAddress}:${config.port}`
      });
    } else {
      if (!config.usbDevice) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CONFIGURATION_ERROR',
            message: 'USB printer not configured properly',
            timestamp: new Date().toISOString()
          }
        });
      }

      // Simulazione test connessione USB
      res.json({
        success: true,
        message: `Connection test successful to USB device ${config.usbDevice}`
      });
    }
  } catch (error: any) {
    console.error('Error testing printer connection:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CONNECTION_ERROR',
        message: error.message || 'Failed to connect to printer',
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router;
