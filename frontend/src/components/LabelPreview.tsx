import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import './LabelPreview.css';

interface LabelPreviewProps {
  productName: string;
  batch: string;
  expiryDate: string;
  quantity: string;
  weight: string;
  barcodeData?: string;
}

const LabelPreview: React.FC<LabelPreviewProps> = ({
  productName,
  batch,
  expiryDate,
  quantity,
  weight,
  barcodeData
}) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  // Genera il barcode quando barcodeData cambia
  useEffect(() => {
    if (barcodeData && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, barcodeData, {
          format: 'CODE128',
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 14,
          margin: 10
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [barcodeData]);

  // Formatta il peso per la visualizzazione
  const formatWeight = (weightStr: string): string => {
    const weightNum = parseFloat(weightStr);
    if (isNaN(weightNum)) return weightStr;
    const grams = Math.round(weightNum * 1000);
    return grams.toString().padStart(6, '0');
  };

  // Formatta la data in formato compatto
  const formatDateCompact = (dateStr: string): string => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    return `${parts[0]}${parts[1]}${parts[2].slice(-2)}`;
  };

  return (
    <div className="label-preview">
      <div className="preview-header">
        <h3>Anteprima Etichetta</h3>
      </div>
      
      <div className="preview-content">
        <div className="preview-label">
          <div className="label-field product-name">
            {productName || 'Nome Prodotto'}
          </div>

          <div className="label-row">
            <div className="label-field">
              <span className="field-label">Lotto:</span>
              <span className="field-value">{batch || 'L-000000'}</span>
            </div>
          </div>

          <div className="label-row">
            <div className="label-field">
              <span className="field-label">Scadenza:</span>
              <span className="field-value">
                {expiryDate ? formatDateCompact(expiryDate) : '000000'}
              </span>
            </div>
          </div>

          <div className="label-row">
            <div className="label-field">
              <span className="field-label">Quantità:</span>
              <span className="field-value">{quantity || '0'}</span>
            </div>
            <div className="label-field">
              <span className="field-label">Peso:</span>
              <span className="field-value">
                {weight ? formatWeight(weight) : '000000'}
              </span>
            </div>
          </div>

          {barcodeData && (
            <div className="label-barcode">
              <svg ref={barcodeRef}></svg>
            </div>
          )}

          {!barcodeData && (
            <div className="label-barcode-placeholder">
              <p>Il codice a barre verrà generato al salvataggio</p>
            </div>
          )}
        </div>
      </div>

      <div className="preview-note">
        <p>Questa è un'anteprima approssimativa. L'etichetta stampata potrebbe variare leggermente.</p>
      </div>
    </div>
  );
};

export default LabelPreview;
