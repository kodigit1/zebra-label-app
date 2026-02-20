import { Router, Request, Response } from 'express';
import { generateZPL, generateZPLFilename } from '../utils/zplGenerator';

const router = Router();

/**
 * POST /api/zpl/generate
 * Genera codice ZPL per un'etichetta
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { productName, batch, expiryDate, quantity, weight, barcodeData } = req.body;

    // Valida input
    if (!productName || productName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product name is required',
          timestamp: new Date().toISOString()
        }
      });
    }

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

    if (!barcodeData || barcodeData.trim() === '') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Barcode data is required',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Genera ZPL
    const zpl = generateZPL({
      productName,
      batch,
      expiryDate,
      quantity,
      weight,
      barcodeData
    });

    res.json({
      success: true,
      data: {
        zpl
      }
    });
  } catch (error: any) {
    console.error('Error generating ZPL:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to generate ZPL',
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * POST /api/zpl/download
 * Genera e scarica file ZPL
 */
router.post('/download', async (req: Request, res: Response) => {
  try {
    const { productName, batch, expiryDate, quantity, weight, barcodeData } = req.body;

    // Valida input (stesso del generate)
    if (!productName || productName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product name is required',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Genera ZPL
    const zpl = generateZPL({
      productName,
      batch,
      expiryDate,
      quantity,
      weight,
      barcodeData
    });

    // Genera nome file
    const filename = generateZPLFilename(productName);

    // Imposta headers per download
    res.setHeader('Content-Type', 'application/zpl');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(zpl);
  } catch (error: any) {
    console.error('Error downloading ZPL:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to download ZPL',
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router;
