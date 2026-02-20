import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './database/schema'; // Inizializza il database
import labelsRouter from './routes/labels';
import templatesRouter from './routes/templates';
import barcodeRouter from './routes/barcode';
import zplRouter from './routes/zpl';
import printerRouter from './routes/printer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Zebra Label Manager API is running' });
});

// API Routes
app.use('/api/labels', labelsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/barcode', barcodeRouter);
app.use('/api/zpl', zplRouter);
app.use('/api/printer', printerRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred',
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;
