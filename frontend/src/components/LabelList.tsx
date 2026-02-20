import React from 'react';
import { Label } from '../types';
import './LabelList.css';

interface LabelListProps {
  labels: Label[];
  onSelect: (label: Label) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const LabelList: React.FC<LabelListProps> = ({ labels, onSelect, onDelete, loading }) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="label-list">
        <div className="loading">Caricamento etichette...</div>
      </div>
    );
  }

  if (labels.length === 0) {
    return (
      <div className="label-list">
        <div className="empty-state">
          <p>Nessuna etichetta salvata</p>
          <p className="empty-hint">Crea la tua prima etichetta dalla pagina principale</p>
        </div>
      </div>
    );
  }

  return (
    <div className="label-list">
      <div className="list-header">
        <h3>Etichette Salvate ({labels.length})</h3>
      </div>

      <div className="labels-grid">
        {labels.map((label) => (
          <div key={label.id} className="label-card">
            <div className="label-card-header">
              <h4>{label.productName}</h4>
              <span className="label-date">{formatDate(label.createdAt)}</span>
            </div>

            <div className="label-card-body">
              <div className="label-info">
                <span className="info-label">Lotto:</span>
                <span className="info-value">{label.batch}</span>
              </div>
              <div className="label-info">
                <span className="info-label">Scadenza:</span>
                <span className="info-value">{label.expiryDate}</span>
              </div>
              <div className="label-info">
                <span className="info-label">Quantità:</span>
                <span className="info-value">{label.quantity}</span>
              </div>
              <div className="label-info">
                <span className="info-label">Peso:</span>
                <span className="info-value">{label.weight} kg</span>
              </div>
            </div>

            <div className="label-card-actions">
              <button
                className="btn btn-secondary"
                onClick={() => onSelect(label)}
              >
                Visualizza
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm('Sei sicuro di voler eliminare questa etichetta?')) {
                    onDelete(label.id);
                  }
                }}
              >
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelList;
