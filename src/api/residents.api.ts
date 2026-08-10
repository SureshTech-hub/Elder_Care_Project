import api from './axios';
import { ApiResponse, Resident } from '../types';

export const residentsApi = {
  getAll: async (): Promise<ApiResponse<Resident[]>> => {
    const res = await api.get('/residents');
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Resident>> => {
    const res = await api.get(`/residents/${id}`);
    return res.data;
  },
  create: async (data: Partial<Resident>): Promise<ApiResponse<Resident>> => {
    const res = await api.post('/residents', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Resident>): Promise<ApiResponse<Resident>> => {
    const res = await api.put(`/residents/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<Resident>> => {
    const res = await api.delete(`/residents/${id}`);
    return res.data;
  },
};
