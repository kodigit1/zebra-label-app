import axios from 'axios';
import { Label, Template, PrinterConfig, ApiResponse } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Labels API
export const labelsApi = {
  create: async (data: {
    productName: string;
    batch: string;
    expiryDate: string;
    quantity: number;
    weight: number;
  }): Promise<Label> => {
    const response = await api.post<ApiResponse<Label>>('/labels', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to create label');
    }
    return response.data.data;
  },

  getAll: async (): Promise<Label[]> => {
    const response = await api.get<ApiResponse<Label[]>>('/labels');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch labels');
    }
    return response.data.data;
  },

  getById: async (id: string): Promise<Label> => {
    const response = await api.get<ApiResponse<Label>>(`/labels/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch label');
    }
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/labels/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to delete label');
    }
  }
};

// Templates API
export const templatesApi = {
  create: async (data: {
    name: string;
    productName: string;
    weight: number;
    defaultQuantity?: number;
  }): Promise<Template> => {
    const response = await api.post<ApiResponse<Template>>('/templates', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to create template');
    }
    return response.data.data;
  },

  getAll: async (): Promise<Template[]> => {
    const response = await api.get<ApiResponse<Template[]>>('/templates');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch templates');
    }
    return response.data.data;
  },

  getById: async (id: string): Promise<Template> => {
    const response = await api.get<ApiResponse<Template>>(`/templates/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch template');
    }
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/templates/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to delete template');
    }
  }
};

// Barcode API
export const barcodeApi = {
  generate: async (data: {
    batch: string;
    expiryDate: string;
    quantity: number;
  }): Promise<{ barcodeData: string; humanReadable: string }> => {
    const response = await api.post<ApiResponse<{ barcodeData: string; humanReadable: string }>>(
      '/barcode/generate',
      data
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to generate barcode');
    }
    return response.data.data;
  }
};

// ZPL API
export const zplApi = {
  generate: async (data: {
    productName: string;
    batch: string;
    expiryDate: string;
    quantity: number;
    weight: number;
    barcodeData: string;
  }): Promise<string> => {
    const response = await api.post<ApiResponse<{ zpl: string }>>('/zpl/generate', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to generate ZPL');
    }
    return response.data.data.zpl;
  },

  download: async (data: {
    productName: string;
    batch: string;
    expiryDate: string;
    quantity: number;
    weight: number;
    barcodeData: string;
  }): Promise<Blob> => {
    const response = await api.post('/zpl/download', data, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Printer API
export const printerApi = {
  getConfig: async (): Promise<PrinterConfig> => {
    const response = await api.get<ApiResponse<PrinterConfig>>('/printer/config');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch printer config');
    }
    return response.data.data;
  },

  updateConfig: async (data: {
    connectionType: 'network' | 'usb';
    ipAddress?: string;
    port?: number;
    usbDevice?: string;
  }): Promise<PrinterConfig> => {
    const response = await api.post<ApiResponse<PrinterConfig>>('/printer/config', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to update printer config');
    }
    return response.data.data;
  },

  test: async (): Promise<string> => {
    const response = await api.post<ApiResponse<void>>('/printer/test');
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Printer connection test failed');
    }
    return response.data.message || 'Connection test successful';
  }
};

export default api;
