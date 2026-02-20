import { Router, Request, Response } from 'express';
import { createTemplate, getTemplateById, getAllTemplates, deleteTemplate, getTemplateByName } from '../services/templateService';

const router = Router();

/**
 * POST /api/templates
 * Crea un nuovo template
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, productName, weight, defaultQuantity } = req.body;

    // Valida input
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Template name is required',
          timestamp: new Date().toISOString()
        }
      });
    }

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

    // Verifica che il nome non esista già
    const existing = getTemplateByName(name);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ERROR',
          message: 'A template with this name already exists',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Crea template
    const template = createTemplate({
      name,
      productName,
      weight,
      defaultQuantity: defaultQuantity || undefined
    });

    res.status(201).json({
      success: true,
      data: {
        id: template.id,
        name: template.name,
        productName: template.productName,
        weight: template.weight,
        defaultQuantity: template.defaultQuantity,
        createdAt: template.createdAt.toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to create template',
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * GET /api/templates
 * Recupera tutti i template
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const templates = getAllTemplates();

    res.json({
      success: true,
      data: templates.map(template => ({
        id: template.id,
        name: template.name,
        productName: template.productName,
        weight: template.weight,
        defaultQuantity: template.defaultQuantity,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString()
      }))
    });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch templates',
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * GET /api/templates/:id
 * Recupera un template specifico
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = getTemplateById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Template not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      data: {
        id: template.id,
        name: template.name,
        productName: template.productName,
        weight: template.weight,
        defaultQuantity: template.defaultQuantity,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch template',
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * DELETE /api/templates/:id
 * Elimina un template
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = deleteTemplate(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Template not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete template',
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router;
