import api from './axios';
import { ApiResponse, Prediction } from '../types';

export const predictionsApi = {
  getAll: async (): Promise<ApiResponse<Prediction[]>> => {
    const res = await api.get('/predictions');
    return res.data;
  },
  getByResident: async (residentId: string): Promise<ApiResponse<Prediction[]>> => {
    const res = await api.get(`/predictions/resident/${residentId}`);
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Prediction>> => {
    const res = await api.get(`/predictions/${id}`);
    return res.data;
  },
  create: async (data: Partial<Prediction>): Promise<ApiResponse<Prediction>> => {
    const res = await api.post('/predictions', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Prediction>): Promise<ApiResponse<Prediction>> => {
    const res = await api.put(`/predictions/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<Prediction>> => {
    const res = await api.delete(`/predictions/${id}`);
    return res.data;
  },
};
