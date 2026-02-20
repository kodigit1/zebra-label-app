import React, { useState, useEffect } from 'react';
import {
  LabelFormData,
  ValidationErrors,
  validateLabelForm,
  hasValidationErrors,
  validateProductName,
  validateBatch,
  validateExpiryDate,
  validateQuantity,
  validateWeight
} from '../utils/validation';
import './LabelForm.css';

interface LabelFormProps {
  initialData?: Partial<LabelFormData>;
  onSubmit: (data: LabelFormData) => void;
  onPreview?: (data: LabelFormData) => void;
  submitLabel?: string;
}

const LabelForm: React.FC<LabelFormProps> = ({
  initialData,
  onSubmit,
  onPreview,
  submitLabel = 'Salva Etichetta'
}) => {
  const [formData, setFormData] = useState<LabelFormData>({
    productName: initialData?.productName || '',
    batch: initialData?.batch || '',
    expiryDate: initialData?.expiryDate || '',
    quantity: initialData?.quantity || '',
    weight: initialData?.weight || ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Aggiorna anteprima quando i dati cambiano
  useEffect(() => {
    if (onPreview && !hasValidationErrors(errors)) {
      onPreview(formData);
    }
  }, [formData, errors, onPreview]);

  const handleChange = (field: keyof LabelFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Valida il campo in tempo reale se è stato toccato
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof LabelFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof LabelFormData, value: string) => {
    let error: string | undefined;

    switch (field) {
      case 'productName':
        error = validateProductName(value);
        break;
      case 'batch':
        error = validateBatch(value);
        break;
      case 'expiryDate':
        error = validateExpiryDate(value);
        break;
      case 'quantity':
        error = validateQuantity(value);
        break;
      case 'weight':
        error = validateWeight(value);
        break;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Marca tutti i campi come toccati
    setTouched({
      productName: true,
      batch: true,
      expiryDate: true,
      quantity: true,
      weight: true
    });

    // Valida tutti i campi
    const validationErrors = validateLabelForm(formData);
    setErrors(validationErrors);

    // Se non ci sono errori, invia il form
    if (!hasValidationErrors(validationErrors)) {
      onSubmit(formData);
    }
  };

  return (
    <form className="label-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="productName">Nome Prodotto *</label>
        <input
          type="text"
          id="productName"
          value={formData.productName}
          onChange={(e) => handleChange('productName', e.target.value)}
          onBlur={() => handleBlur('productName')}
          className={errors.productName && touched.productName ? 'error' : ''}
          placeholder="Es: Pasta di Semola"
        />
        {errors.productName && touched.productName && (
          <span className="error-message">{errors.productName}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="batch">Lotto *</label>
          <input
            type="text"
            id="batch"
            value={formData.batch}
            onChange={(e) => handleChange('batch', e.target.value)}
            onBlur={() => handleBlur('batch')}
            className={errors.batch && touched.batch ? 'error' : ''}
            placeholder="Es: L-554433"
          />
          {errors.batch && touched.batch && (
            <span className="error-message">{errors.batch}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="expiryDate">Scadenza *</label>
          <input
            type="text"
            id="expiryDate"
            value={formData.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            onBlur={() => handleBlur('expiryDate')}
            className={errors.expiryDate && touched.expiryDate ? 'error' : ''}
            placeholder="gg/mm/aaaa"
          />
          {errors.expiryDate && touched.expiryDate && (
            <span className="error-message">{errors.expiryDate}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Quantità *</label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            onBlur={() => handleBlur('quantity')}
            className={errors.quantity && touched.quantity ? 'error' : ''}
            placeholder="Es: 100"
            min="1"
            step="1"
          />
          {errors.quantity && touched.quantity && (
            <span className="error-message">{errors.quantity}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="weight">Peso (kg) *</label>
          <input
            type="number"
            id="weight"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            onBlur={() => handleBlur('weight')}
            className={errors.weight && touched.weight ? 'error' : ''}
            placeholder="Es: 1.25"
            min="0.01"
            step="0.01"
          />
          {errors.weight && touched.weight && (
            <span className="error-message">{errors.weight}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={hasValidationErrors(errors)}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default LabelForm;
