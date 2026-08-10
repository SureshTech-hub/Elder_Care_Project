import api from './axios';
import { ApiResponse, Medication } from '../types';

export const medicationsApi = {
  getAll: async (): Promise<ApiResponse<Medication[]>> => {
    const res = await api.get('/medications');
    return res.data;
  },
  getByResident: async (residentId: string): Promise<ApiResponse<Medication[]>> => {
    const res = await api.get(`/medications/resident/${residentId}`);
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Medication>> => {
    const res = await api.get(`/medications/${id}`);
    return res.data;
  },
  create: async (data: Partial<Medication>): Promise<ApiResponse<Medication>> => {
    const res = await api.post('/medications', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Medication>): Promise<ApiResponse<Medication>> => {
    const res = await api.put(`/medications/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<Medication>> => {
    const res = await api.delete(`/medications/${id}`);
    return res.data;
  },
};
