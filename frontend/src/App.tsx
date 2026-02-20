import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LabelForm from './components/LabelForm';
import LabelPreview from './components/LabelPreview';
import LabelList from './components/LabelList';
import { labelsApi, barcodeApi, zplApi } from './services/api';
import { LabelFormData } from './utils/validation';
import { Label } from './types';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Zebra Label Manager</h1>
          <nav>
            <Link to="/">Crea Etichetta</Link>
            <Link to="/labels">Etichette</Link>
            <Link to="/templates">Template</Link>
            <Link to="/settings">Impostazioni</Link>
          </nav>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/labels" element={<LabelsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function HomePage() {
  const [previewData, setPreviewData] = useState<LabelFormData | null>(null);
  const [barcodeData, setBarcodeData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savedLabel, setSavedLabel] = useState<Label | null>(null);

  const handlePreview = (data: LabelFormData) => {
    setPreviewData(data);
  };

  const handleSubmit = async (data: LabelFormData) => {
    setLoading(true);
    setMessage(null);

    try {
      // Genera barcode
      const barcode = await barcodeApi.generate({
        batch: data.batch,
        expiryDate: data.expiryDate,
        quantity: parseInt(data.quantity)
      });

      // Salva etichetta
      const label = await labelsApi.create({
        productName: data.productName,
        batch: data.batch,
        expiryDate: data.expiryDate,
        quantity: parseInt(data.quantity),
        weight: parseFloat(data.weight)
      });

      setBarcodeData(barcode.humanReadable);
      setSavedLabel(label);
      setMessage({ type: 'success', text: 'Etichetta salvata con successo!' });
    } catch (error: any) {
      console.error('Error saving label:', error);
      setMessage({ type: 'error', text: error.message || 'Errore nel salvataggio dell\'etichetta' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZPL = async () => {
    if (!previewData || !barcodeData) {
      setMessage({ type: 'error', text: 'Salva prima l\'etichetta per scaricare il file ZPL' });
      return;
    }

    setDownloading(true);
    try {
      const blob = await zplApi.download({
        productName: previewData.productName,
        batch: previewData.batch,
        expiryDate: previewData.expiryDate,
        quantity: parseInt(previewData.quantity),
        weight: parseFloat(previewData.weight),
        barcodeData: barcodeData
      });

      // Crea URL per il blob e triggera il download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `label-${previewData.productName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.zpl`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'File ZPL scaricato con successo!' });
    } catch (error: any) {
      console.error('Error downloading ZPL:', error);
      setMessage({ type: 'error', text: 'Errore nel download del file ZPL' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="home-page">
      <h2>Crea Nuova Etichetta</h2>
      
      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-preview-container">
        <div className="form-section">
          <LabelForm
            onSubmit={handleSubmit}
            onPreview={handlePreview}
            submitLabel={loading ? 'Salvataggio...' : 'Salva Etichetta'}
          />

          {savedLabel && (
            <div className="actions-section">
              <button
                className="btn btn-download"
                onClick={handleDownloadZPL}
                disabled={downloading}
              >
                {downloading ? 'Download...' : 'Download ZPL'}
              </button>
            </div>
          )}
        </div>

        <div className="preview-section">
          {previewData && (
            <LabelPreview
              productName={previewData.productName}
              batch={previewData.batch}
              expiryDate={previewData.expiryDate}
              quantity={previewData.quantity}
              weight={previewData.weight}
              barcodeData={barcodeData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function LabelsPage() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      setLoading(true);
      const data = await labelsApi.getAll();
      setLabels(data);
    } catch (error: any) {
      console.error('Error loading labels:', error);
      setMessage({ type: 'error', text: 'Errore nel caricamento delle etichette' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await labelsApi.delete(id);
      setMessage({ type: 'success', text: 'Etichetta eliminata con successo' });
      loadLabels();
      if (selectedLabel?.id === id) {
        setSelectedLabel(null);
      }
    } catch (error: any) {
      console.error('Error deleting label:', error);
      setMessage({ type: 'error', text: 'Errore nell\'eliminazione dell\'etichetta' });
    }
  };

  const handleSelect = (label: Label) => {
    setSelectedLabel(label);
  };

  return (
    <div className="labels-page">
      <h2>Gestione Etichette</h2>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="labels-container">
        <div className="labels-list-section">
          <LabelList
            labels={labels}
            onSelect={handleSelect}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>

        {selectedLabel && (
          <div className="labels-preview-section">
            <LabelPreview
              productName={selectedLabel.productName}
              batch={selectedLabel.batch}
              expiryDate={selectedLabel.expiryDate}
              quantity={selectedLabel.quantity.toString()}
              weight={selectedLabel.weight.toString()}
              barcodeData={selectedLabel.barcodeData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function TemplatesPage() {
  return <div><h2>Gestione Template</h2><p>Funzionalità in arrivo...</p></div>;
}

function SettingsPage() {
  return <div><h2>Impostazioni Stampante</h2><p>Funzionalità in arrivo...</p></div>;
}

export default App;
