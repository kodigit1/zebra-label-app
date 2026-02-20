import { Router, Request, Response } from 'express';
import { generateGS1Barcode } from '../utils/barcodeGenerator';

const router = Router();

/**
 * POST /api/barcode/generate
 * Genera un codice a barre GS1
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { batch, expiryDate, quantity } = req.body;

    // Valida input
    if (!batch || batch.trim() === '') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Batch number is required',
          timestamp: new Date().toISOString()
        }
      });
    }

    if (!expiryDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(expiryDate)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid expiry date format. Expected gg/mm/aaaa',
          timestamp: new Date().toISOString()
        }
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Quantity must be a positive integer',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Genera barcode
    const result = generateGS1Barcode({ batch, expiryDate, quantity });

    res.json({
      success: true,
      data: {
        barcodeData: result.barcodeData,
        humanReadable: result.humanReadable
      }
    });
  } catch (error: any) {
    console.error('Error generating barcode:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to generate barcode',
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router;
