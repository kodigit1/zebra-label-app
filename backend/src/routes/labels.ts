import { Router, Request, Response } from 'express';
import { createLabel, getLabelById, getAllLabels, deleteLabel } from '../services/labelService';
import { generateGS1Barcode } from '../utils/barcodeGenerator';

const router = Router();

/**
 * POST /api/labels
 * Crea e salva una nuova etichetta
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { productName, batch, expiryDate, quantity, weight } = req.body;

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

    if (typeof weight !== 'number' || weight <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Weight must be a positive number',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Genera codice a barre GS1
    const barcodeResult = generateGS1Barcode({ batch, expiryDate, quantity });

    // Crea etichetta
    const label = createLabel({
      productName,
      batch,
      expiryDate,
      quantity,
      weight,
      barcodeData: barcodeResult.humanReadable
    });

    res.status(201).json({
      success: true,
      data: {
        id: label.id,
        productName: label.productName,
        batch: label.batch,
        expiryDate: label.expiryDate,
        quantity: label.quantity,
        weight: label.weight,
        barcodeData: label.barcodeData,
        createdAt: label.createdAt.toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error creating label:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to create label',
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * GET /api/labels
 * Recupera tutte le etichette
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const labels = getAllLabels();

    res.json({
      success: true,
      data: labels.map(label => ({
        id: label.id,
        productName: label.productName,
        batch: label.batch,
        expiryDate: label.expiryDate,
        quantity: label.quantity,
        weight: label.weight,
        barcodeData: label.barcodeData,
        createdAt: label.createdAt.toISOString(),
        updatedAt: label.updatedAt.toISOString()
      }))
    });
  } catch (error: any) {
    console.error('Error fetching labels:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch labels',
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * GET /api/labels/:id
 * Recupera un'etichetta specifica
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const label = getLabelById(id);

    if (!label) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Label not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      data: {
        id: label.id,
        productName: label.productName,
        batch: label.batch,
        expiryDate: label.expiryDate,
        quantity: label.quantity,
        weight: label.weight,
        barcodeData: label.barcodeData,
        createdAt: label.createdAt.toISOString(),
        updatedAt: label.updatedAt.toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error fetching label:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch label',
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * DELETE /api/labels/:id
 * Elimina un'etichetta
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = deleteLabel(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Label not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      message: 'Label deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting label:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete label',
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router;
