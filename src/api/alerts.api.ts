import api from './axios';
import { ApiResponse, Alert } from '../types';

export const alertsApi = {
  getAll: async (): Promise<ApiResponse<Alert[]>> => {
    const res = await api.get('/alerts');
    return res.data;
  },
  getByResident: async (residentId: string): Promise<ApiResponse<Alert[]>> => {
    const res = await api.get(`/alerts/resident/${residentId}`);
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Alert>> => {
    const res = await api.get(`/alerts/${id}`);
    return res.data;
  },
  create: async (data: Partial<Alert>): Promise<ApiResponse<Alert>> => {
    const res = await api.post('/alerts', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Alert>): Promise<ApiResponse<Alert>> => {
    const res = await api.put(`/alerts/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<Alert>> => {
    const res = await api.delete(`/alerts/${id}`);
    return res.data;
  },
};
