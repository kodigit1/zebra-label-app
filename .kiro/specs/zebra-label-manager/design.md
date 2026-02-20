# Design Document

## Overview

Il sistema Zebra Label Manager è una web application full-stack composta da un frontend React e un backend Node.js. L'applicazione permette agli utenti di creare, gestire e stampare etichette per prodotti alimentari su stampanti Zebra ZT 230. Il sistema genera codici a barre GS1, salva etichette e template in un database, e produce file ZPL per la stampa diretta o il download.

## Architecture

### System Architecture

L'architettura segue il pattern client-server con separazione netta tra frontend e backend:

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           React Frontend (SPA)                        │  │
│  │  - Form Components                                    │  │
│  │  - Label Preview                                      │  │
│  │  - Template Management                                │  │
│  │  - Label History                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                    REST API (HTTP/JSON)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Node.js Backend                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Express.js Server                        │  │
│  │  - API Routes                                         │  │
│  │  - Business Logic                                     │  │
│  │  - ZPL Generator                                      │  │
│  │  - GS1 Barcode Generator                              │  │
│  │  - Zebra Printer Interface                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌────────────────────┐   │   ┌──────────────────────────┐  │
│  │   SQLite Database  │◄──┴──►│  Zebra Printer (Network) │  │
│  │  - Labels          │       │  ZT 230                  │  │
│  │  - Templates       │       └──────────────────────────┘  │
│  │  - Config          │                                     │
│  └────────────────────┘                                     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18+ (UI framework)
- React Router (routing)
- Axios (HTTP client)
- CSS Modules o Styled Components (styling)
- React Hook Form (form management)
- Barcode library (jsbarcode o react-barcode)

**Backend:**
- Node.js 18+ (runtime)
- Express.js (web framework)
- SQLite3 (database)
- node-zpl (ZPL generation)
- node-printer (printer communication)
- cors (CORS middleware)
- dotenv (environment configuration)

## Components and Interfaces

### Frontend Components

#### 1. App Component
Root component che gestisce routing e layout generale.

```typescript
interface AppProps {}

function App(): JSX.Element
```

#### 2. LabelForm Component
Form principale per inserimento dati etichetta.

```typescript
interface LabelFormData {
  productName: string;
  batch: string;
  expiryDate: string; // formato: gg/mm/aaaa
  quantity: number;
  weight: number;
}

interface LabelFormProps {
  initialData?: LabelFormData;
  onSubmit: (data: LabelFormData) => void;
  onPreview: (data: LabelFormData) => void;
}

function LabelForm(props: LabelFormProps): JSX.Element
```

#### 3. LabelPreview Component
Anteprima visuale dell'etichetta.

```typescript
interface LabelPreviewProps {
  data: LabelFormData;
  barcodeData: string;
}

function LabelPreview(props: LabelPreviewProps): JSX.Element
```

#### 4. LabelList Component
Lista delle etichette salvate.

```typescript
interface SavedLabel {
  id: string;
  productName: string;
  batch: string;
  expiryDate: string;
  quantity: number;
  weight: number;
  barcodeData: string;
  createdAt: string;
}

interface LabelListProps {
  labels: SavedLabel[];
  onSelect: (label: SavedLabel) => void;
  onDelete: (id: string) => void;
}

function LabelList(props: LabelListProps): JSX.Element
```

#### 5. TemplateManager Component
Gestione template prodotti.

```typescript
interface Template {
  id: string;
  name: string;
  productName: string;
  weight: number;
  defaultQuantity?: number;
}

interface TemplateManagerProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onSave: (template: Omit<Template, 'id'>) => void;
  onDelete: (id: string) => void;
}

function TemplateManager(props: TemplateManagerProps): JSX.Element
```

#### 6. PrinterConfig Component
Configurazione stampante.

```typescript
interface PrinterSettings {
  connectionType: 'network' | 'usb';
  ipAddress?: string;
  port?: number;
  usbDevice?: string;
}

interface PrinterConfigProps {
  settings: PrinterSettings;
  onSave: (settings: PrinterSettings) => void;
  onTest: () => void;
}

function PrinterConfig(props: PrinterConfigProps): JSX.Element
```

### Backend API Endpoints

#### Labels API

```typescript
// POST /api/labels - Crea e salva nuova etichetta
interface CreateLabelRequest {
  productName: string;
  batch: string;
  expiryDate: string;
  quantity: number;
  weight: number;
}

interface CreateLabelResponse {
  id: string;
  barcodeData: string;
  createdAt: string;
}

// GET /api/labels - Recupera tutte le etichette
interface GetLabelsResponse {
  labels: SavedLabel[];
}

// GET /api/labels/:id - Recupera etichetta specifica
interface GetLabelResponse {
  label: SavedLabel;
}

// DELETE /api/labels/:id - Elimina etichetta
interface DeleteLabelResponse {
  success: boolean;
}
```

#### Templates API

```typescript
// POST /api/templates - Crea template
interface CreateTemplateRequest {
  name: string;
  productName: string;
  weight: number;
  defaultQuantity?: number;
}

interface CreateTemplateResponse {
  id: string;
  createdAt: string;
}

// GET /api/templates - Recupera tutti i template
interface GetTemplatesResponse {
  templates: Template[];
}

// DELETE /api/templates/:id - Elimina template
interface DeleteTemplateResponse {
  success: boolean;
}
```

#### ZPL Generation API

```typescript
// POST /api/zpl/generate - Genera codice ZPL
interface GenerateZPLRequest {
  productName: string;
  batch: string;
  expiryDate: string;
  quantity: number;
  weight: number;
  barcodeData: string;
}

interface GenerateZPLResponse {
  zpl: string;
}

// POST /api/zpl/download - Download file ZPL
// Returns file stream with Content-Type: application/zpl
```

#### Printing API

```typescript
// POST /api/print - Stampa etichetta
interface PrintRequest {
  zpl: string;
}

interface PrintResponse {
  success: boolean;
  message: string;
  jobId?: string;
}

// GET /api/print/status/:jobId - Stato stampa
interface PrintStatusResponse {
  status: 'pending' | 'printing' | 'completed' | 'error';
  message?: string;
}
```

#### Printer Configuration API

```typescript
// GET /api/printer/config - Recupera configurazione
interface GetPrinterConfigResponse {
  settings: PrinterSettings;
}

// POST /api/printer/config - Salva configurazione
interface SavePrinterConfigRequest {
  settings: PrinterSettings;
}

interface SavePrinterConfigResponse {
  success: boolean;
}

// POST /api/printer/test - Test connessione
interface TestPrinterResponse {
  success: boolean;
  message: string;
}
```

#### Barcode Generation API

```typescript
// POST /api/barcode/generate - Genera codice a barre GS1
interface GenerateBarcodeRequest {
  batch: string;
  expiryDate: string;
  quantity: number;
}

interface GenerateBarcodeResponse {
  barcodeData: string; // Stringa GS1-128 formattata
  humanReadable: string; // Versione leggibile
}
```

## Data Models

### Database Schema

#### Labels Table

```sql
CREATE TABLE labels (
  id TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  batch TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  weight REAL NOT NULL,
  barcode_data TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_labels_created_at ON labels(created_at DESC);
CREATE INDEX idx_labels_product_name ON labels(product_name);
```

#### Templates Table

```sql
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  weight REAL NOT NULL,
  default_quantity INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_templates_name ON templates(name);
```

#### Printer Config Table

```sql
CREATE TABLE printer_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  connection_type TEXT NOT NULL CHECK (connection_type IN ('network', 'usb')),
  ip_address TEXT,
  port INTEGER,
  usb_device TEXT,
  updated_at TEXT NOT NULL
);
```

### TypeScript Models

```typescript
// Label Model
interface Label {
  id: string;
  productName: string;
  batch: string;
  expiryDate: string;
  quantity: number;
  weight: number;
  barcodeData: string;
  createdAt: Date;
  updatedAt: Date;
}

// Template Model
interface Template {
  id: string;
  name: string;
  productName: string;
  weight: number;
  defaultQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Printer Config Model
interface PrinterConfig {
  id: number;
  connectionType: 'network' | 'usb';
  ipAddress?: string;
  port?: number;
  usbDevice?: string;
  updatedAt: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Form Validation Completeness

*For any* label form data with invalid fields (empty product name, non-alphanumeric batch, invalid date format, non-positive quantity, or weight with more than 2 decimals), the validation function should reject the data and return specific error messages for each invalid field.

**Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6**

### Property 2: GS1 Barcode Format Compliance

*For any* valid label data (batch, expiry date, quantity), the generated GS1-128 barcode should include all required Application Identifiers ((01) for GTIN, (10) for batch, (17) for expiry date, (30) for quantity) and the data should be correctly encoded in the barcode string.

**Validates: Requirements 2.1, 2.2, 2.4**

### Property 3: Label Preview Completeness

*For any* valid label form data, the preview component should display all required fields (product name, batch, expiry date, quantity, weight, and barcode) and the displayed values should match the input data exactly.

**Validates: Requirements 3.2**

### Property 4: Label Persistence Round-Trip

*For any* valid label data, saving the label to the database and then retrieving it should return an equivalent label with all fields preserved, plus a unique ID and creation timestamp.

**Validates: Requirements 4.1, 4.2**

### Property 5: Label List Ordering

*For any* set of saved labels, retrieving the label list should return all labels ordered by creation date in descending order (newest first).

**Validates: Requirements 4.3**

### Property 6: Data Deletion Idempotence

*For any* saved label or template with a valid ID, deleting it should remove it from the database, and subsequent queries for that ID should return not found. Deleting an already deleted ID should not cause errors.

**Validates: Requirements 4.5, 5.6**

### Property 7: Template Persistence Round-Trip

*For any* valid template data (name, product name, weight, default quantity), saving the template and then retrieving it should return an equivalent template with all fields preserved.

**Validates: Requirements 5.2**

### Property 8: Template Pre-fill Correctness

*For any* saved template, loading it into the form should pre-fill the product name and weight fields with the template values, while leaving batch, expiry date, and quantity fields empty or with default values.

**Validates: Requirements 5.4**

### Property 9: ZPL Generation Completeness

*For any* valid label data with barcode, the generated ZPL code should be syntactically valid, include all label fields (product name, batch, expiry date, quantity, weight), contain the ^BC command for Code 128 barcode, and have proper label dimensions.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 10: ZPL Download Filename Convention

*For any* label with a product name, downloading the ZPL file should generate a filename that includes the product name (sanitized for filesystem compatibility) and the .zpl extension.

**Validates: Requirements 7.2**

### Property 11: ZPL File Content Validity

*For any* downloaded ZPL file, the file content should be identical to the generated ZPL code and should be syntactically valid ZPL that can be parsed by Zebra printers.

**Validates: Requirements 7.3**

### Property 12: Print Job Logging

*For any* print operation (successful or failed), the backend should create a log entry with timestamp, label data, print status, and any error messages.

**Validates: Requirements 8.5**

### Property 13: Validation Error Messaging

*For any* form submission with validation errors, each invalid field should have a corresponding error message displayed, and the form should not be submittable until all errors are resolved.

**Validates: Requirements 10.1, 10.5**

### Property 14: Database Error Handling

*For any* database operation that fails (save, update, delete), the backend should log the error with details and return an appropriate error response to the client with a user-friendly message.

**Validates: Requirements 10.4**

### Property 15: Data Persistence After Restart

*For any* set of labels and templates saved before a server restart, all data should be retrievable after the restart with no data loss or corruption.

**Validates: Requirements 11.2**

### Property 16: Database Consistency Invariant

*For any* sequence of database operations (create, update, delete), the database should maintain referential integrity and no orphaned records should exist (e.g., no labels referencing non-existent templates).

**Validates: Requirements 11.3**



## Error Handling

### Frontend Error Handling

**Validation Errors:**
- Display inline error messages below each form field
- Prevent form submission when validation errors exist
- Clear error messages when user corrects the input
- Use red color and icon to indicate errors

**Network Errors:**
- Display toast notifications for API failures
- Show retry button for failed operations
- Implement exponential backoff for retries
- Display user-friendly messages (avoid technical jargon)

**Printer Errors:**
- Show detailed error modal with diagnostic information
- Provide troubleshooting suggestions based on error type
- Allow user to test printer connection from error modal
- Log errors to browser console for debugging

**State Management Errors:**
- Implement error boundaries to catch React errors
- Display fallback UI when component crashes
- Log errors to monitoring service
- Provide "reload" option to recover

### Backend Error Handling

**Database Errors:**
- Wrap all database operations in try-catch blocks
- Log errors with stack traces and context
- Return appropriate HTTP status codes (500 for server errors)
- Implement transaction rollback for failed operations

**Printer Communication Errors:**
- Catch connection timeouts and network errors
- Retry failed print jobs with exponential backoff
- Log all printer communication attempts
- Return detailed error messages to client

**Validation Errors:**
- Validate all input data before processing
- Return 400 Bad Request with validation details
- Use consistent error response format
- Include field-level error information

**ZPL Generation Errors:**
- Validate ZPL syntax before returning
- Handle edge cases (very long product names, special characters)
- Log generation failures with input data
- Return fallback ZPL if generation fails

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string; // Error code (e.g., "VALIDATION_ERROR", "PRINTER_OFFLINE")
    message: string; // User-friendly message
    details?: any; // Additional error details
    timestamp: string; // ISO 8601 timestamp
  };
}
```

## Testing Strategy

### Unit Testing

**Frontend Unit Tests (Jest + React Testing Library):**
- Test each component in isolation
- Test form validation logic
- Test state management and hooks
- Test utility functions (date formatting, barcode generation)
- Mock API calls and external dependencies
- Test error handling and edge cases

**Backend Unit Tests (Jest):**
- Test API route handlers
- Test database operations (with in-memory SQLite)
- Test ZPL generation logic
- Test GS1 barcode generation
- Test validation functions
- Test error handling

**Example Unit Tests:**
```typescript
// Frontend: Test form validation
describe('LabelForm validation', () => {
  it('should reject empty product name', () => {
    const { getByLabelText, getByText } = render(<LabelForm />);
    const input = getByLabelText('Product Name');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(getByText('Product name is required')).toBeInTheDocument();
  });
  
  it('should accept valid date format', () => {
    const { getByLabelText, queryByText } = render(<LabelForm />);
    const input = getByLabelText('Expiry Date');
    fireEvent.change(input, { target: { value: '31/12/2025' } });
    fireEvent.blur(input);
    expect(queryByText(/invalid date/i)).not.toBeInTheDocument();
  });
});

// Backend: Test ZPL generation
describe('ZPL Generator', () => {
  it('should generate valid ZPL for label data', () => {
    const labelData = {
      productName: 'Test Product',
      batch: 'L-123456',
      expiryDate: '31/12/2025',
      quantity: 100,
      weight: 1.5,
      barcodeData: '01234567890123'
    };
    const zpl = generateZPL(labelData);
    expect(zpl).toContain('^XA'); // ZPL start
    expect(zpl).toContain('^XZ'); // ZPL end
    expect(zpl).toContain('^BC'); // Barcode command
    expect(zpl).toContain('Test Product');
  });
});
```

### Property-Based Testing

**Property-Based Testing Library:** fast-check (for TypeScript/JavaScript)

**Configuration:**
- Minimum 100 iterations per property test
- Use shrinking to find minimal failing examples
- Seed random generator for reproducibility
- Tag each test with feature name and property number

**Property Test Examples:**

```typescript
import fc from 'fast-check';

// Feature: zebra-label-manager, Property 1: Form Validation Completeness
describe('Property 1: Form Validation Completeness', () => {
  it('should reject invalid form data and provide specific errors', () => {
    fc.assert(
      fc.property(
        fc.record({
          productName: fc.string(),
          batch: fc.string(),
          expiryDate: fc.string(),
          quantity: fc.integer(),
          weight: fc.float()
        }),
        (formData) => {
          const errors = validateLabelForm(formData);
          
          // If product name is empty, should have error
          if (formData.productName.trim() === '') {
            expect(errors.productName).toBeDefined();
          }
          
          // If batch contains non-alphanumeric, should have error
          if (!/^[a-zA-Z0-9]+$/.test(formData.batch)) {
            expect(errors.batch).toBeDefined();
          }
          
          // If date is invalid format, should have error
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.expiryDate)) {
            expect(errors.expiryDate).toBeDefined();
          }
          
          // If quantity is not positive integer, should have error
          if (formData.quantity <= 0 || !Number.isInteger(formData.quantity)) {
            expect(errors.quantity).toBeDefined();
          }
          
          // If weight has more than 2 decimals, should have error
          const decimalPlaces = (formData.weight.toString().split('.')[1] || '').length;
          if (formData.weight <= 0 || decimalPlaces > 2) {
            expect(errors.weight).toBeDefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: zebra-label-manager, Property 2: GS1 Barcode Format Compliance
describe('Property 2: GS1 Barcode Format Compliance', () => {
  it('should generate GS1-128 barcode with correct AIs', () => {
    fc.assert(
      fc.property(
        fc.record({
          batch: fc.stringOf(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), { minLength: 1, maxLength: 20 }),
          expiryDate: fc.date({ min: new Date(), max: new Date('2030-12-31') }),
          quantity: fc.integer({ min: 1, max: 10000 })
        }),
        (data) => {
          const barcode = generateGS1Barcode(data);
          
          // Should contain AI (10) for batch
          expect(barcode).toContain('(10)');
          expect(barcode).toContain(data.batch);
          
          // Should contain AI (17) for expiry date
          expect(barcode).toContain('(17)');
          
          // Should contain AI (30) for quantity
          expect(barcode).toContain('(30)');
          expect(barcode).toContain(data.quantity.toString());
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: zebra-label-manager, Property 4: Label Persistence Round-Trip
describe('Property 4: Label Persistence Round-Trip', () => {
  it('should preserve all label data after save and retrieve', async () => {
    fc.assert(
      await fc.asyncProperty(
        fc.record({
          productName: fc.string({ minLength: 1, maxLength: 100 }),
          batch: fc.stringOf(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), { minLength: 1, maxLength: 20 }),
          expiryDate: fc.date({ min: new Date(), max: new Date('2030-12-31') }),
          quantity: fc.integer({ min: 1, max: 10000 }),
          weight: fc.float({ min: 0.01, max: 1000, noNaN: true })
        }),
        async (labelData) => {
          // Save label
          const savedLabel = await saveLabel(labelData);
          
          // Retrieve label
          const retrievedLabel = await getLabel(savedLabel.id);
          
          // All fields should match
          expect(retrievedLabel.productName).toBe(labelData.productName);
          expect(retrievedLabel.batch).toBe(labelData.batch);
          expect(retrievedLabel.quantity).toBe(labelData.quantity);
          expect(retrievedLabel.weight).toBeCloseTo(labelData.weight, 2);
          
          // Should have ID and timestamp
          expect(retrievedLabel.id).toBeDefined();
          expect(retrievedLabel.createdAt).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: zebra-label-manager, Property 9: ZPL Generation Completeness
describe('Property 9: ZPL Generation Completeness', () => {
  it('should generate valid ZPL with all fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          productName: fc.string({ minLength: 1, maxLength: 100 }),
          batch: fc.stringOf(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), { minLength: 1, maxLength: 20 }),
          expiryDate: fc.string({ minLength: 10, maxLength: 10 }), // dd/mm/yyyy
          quantity: fc.integer({ min: 1, max: 10000 }),
          weight: fc.float({ min: 0.01, max: 1000, noNaN: true }),
          barcodeData: fc.string({ minLength: 10, maxLength: 50 })
        }),
        (labelData) => {
          const zpl = generateZPL(labelData);
          
          // Should be valid ZPL
          expect(zpl).toMatch(/^\^XA/); // Start
          expect(zpl).toMatch(/\^XZ$/); // End
          
          // Should contain all fields
          expect(zpl).toContain(labelData.productName);
          expect(zpl).toContain(labelData.batch);
          expect(zpl).toContain(labelData.expiryDate);
          expect(zpl).toContain(labelData.quantity.toString());
          expect(zpl).toContain(labelData.weight.toFixed(2));
          
          // Should contain barcode command
          expect(zpl).toContain('^BC'); // Code 128
          expect(zpl).toContain(labelData.barcodeData);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**API Integration Tests:**
- Test complete API workflows (create → save → retrieve → delete)
- Test error scenarios (invalid data, missing fields)
- Test concurrent operations
- Use real database (SQLite in-memory for tests)

**End-to-End Tests (Playwright or Cypress):**
- Test complete user workflows
- Test form submission and validation
- Test label preview updates
- Test template creation and usage
- Test printer configuration
- Mock printer communication for E2E tests

### Test Coverage Goals

- Unit test coverage: minimum 80%
- Property test coverage: all critical business logic
- Integration test coverage: all API endpoints
- E2E test coverage: all major user workflows

### Testing Best Practices

1. **Write tests first** for critical functionality (TDD approach)
2. **Use property tests** for validation and data transformation logic
3. **Use unit tests** for specific examples and edge cases
4. **Mock external dependencies** (printer, file system) in unit tests
5. **Use real dependencies** in integration tests
6. **Keep tests fast** (< 5 seconds for unit tests, < 30 seconds for integration)
7. **Make tests deterministic** (no random failures)
8. **Test error paths** as thoroughly as happy paths

## Implementation Notes

### ZPL Generation Details

The ZPL code for Zebra ZT 230 should follow this structure:

```zpl
^XA
^FO50,50^A0N,40,40^FDEsempio Nome Prodotto^FS
^FO50,100^A0N,30,30^FDLotto: L-554433^FS
^FO50,140^A0N,30,30^FDScadenza: 251231^FS
^FO50,180^A0N,30,30^FDQuantità: 100^FS
^FO400,180^A0N,30,30^FDPeso: 001250^FS
^FO50,250^BCN,100,Y,N,N^FD18L5544331725123136100^FS
^XZ
```

**Key ZPL Commands:**
- `^XA` / `^XZ`: Start/end of label format
- `^FO`: Field origin (x, y coordinates)
- `^A0N`: Font selection (0 = default, N = normal)
- `^FD` / `^FS`: Field data start/end
- `^BC`: Code 128 barcode
- Coordinates are in dots (203 DPI for ZT 230)

### GS1-128 Barcode Format

The GS1-128 barcode should encode data using Application Identifiers:

```
(01)GTIN(10)BATCH(17)YYMMDD(30)QUANTITY
```

Example: `18L5544331725123136100`
- `18`: FNC1 + AI prefix
- `L554433`: Batch number
- `17251231`: Expiry date (YYMMDD format)
- `36100`: Quantity with AI (30)

### Database Initialization

On first run, the backend should:
1. Check if database file exists
2. If not, create database and tables
3. Insert default printer configuration
4. Create indexes for performance

### Printer Communication

**Network Printing:**
- Use raw TCP socket connection (port 9100 by default)
- Send ZPL as plain text
- Wait for acknowledgment or timeout
- Handle connection errors gracefully

**USB Printing:**
- Use node-printer or similar library
- Detect available USB printers
- Send ZPL to printer queue
- Monitor print job status

### Security Considerations

1. **Input Validation:** Sanitize all user inputs to prevent injection attacks
2. **SQL Injection:** Use parameterized queries for all database operations
3. **XSS Prevention:** Escape user data before rendering in HTML
4. **CORS:** Configure CORS to allow only trusted origins
5. **File Upload:** Validate file types and sizes if file upload is added
6. **Rate Limiting:** Implement rate limiting on API endpoints
7. **Authentication:** Consider adding user authentication for production use

### Performance Optimization

1. **Database Indexing:** Create indexes on frequently queried columns
2. **Caching:** Cache generated ZPL for identical labels
3. **Lazy Loading:** Load label list with pagination
4. **Debouncing:** Debounce form validation and preview updates
5. **Code Splitting:** Split React bundles for faster initial load
6. **Compression:** Enable gzip compression for API responses

### Deployment Considerations

**Frontend Deployment:**
- Build optimized production bundle
- Serve static files with CDN
- Configure environment variables for API URL

**Backend Deployment:**
- Use process manager (PM2) for Node.js
- Configure environment variables (database path, printer settings)
- Set up logging and monitoring
- Configure reverse proxy (nginx) for production
- Enable HTTPS with SSL certificate

**Database Backup:**
- Implement automated daily backups
- Store backups in separate location
- Test restore procedure regularly
