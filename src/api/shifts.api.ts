import api from './axios';
import { ApiResponse, Shift } from '../types';

export const shiftsApi = {
  getAll: async (): Promise<ApiResponse<Shift[]>> => {
    const res = await api.get('/shifts');
    return res.data;
  },
  getByCaregiver: async (caregiverId: string): Promise<ApiResponse<Shift[]>> => {
    const res = await api.get(`/shifts/caregiver/${caregiverId}`);
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Shift>> => {
    const res = await api.get(`/shifts/${id}`);
    return res.data;
  },
  create: async (data: Partial<Shift>): Promise<ApiResponse<Shift>> => {
    const res = await api.post('/shifts', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Shift>): Promise<ApiResponse<Shift>> => {
    const res = await api.put(`/shifts/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<Shift>> => {
    const res = await api.delete(`/shifts/${id}`);
    return res.data;
  },
};
