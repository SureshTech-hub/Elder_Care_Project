import api from './axios';
import { ApiResponse, Incident } from '../types';

export const incidentsApi = {
  getAll: async (): Promise<ApiResponse<Incident[]>> => {
    const res = await api.get('/incidents');
    return res.data;
  },
  getByResident: async (residentId: string): Promise<ApiResponse<Incident[]>> => {
    const res = await api.get(`/incidents/resident/${residentId}`);
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Incident>> => {
    const res = await api.get(`/incidents/${id}`);
    return res.data;
  },
  create: async (data: Partial<Incident>): Promise<ApiResponse<Incident>> => {
    const res = await api.post('/incidents', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Incident>): Promise<ApiResponse<Incident>> => {
    const res = await api.put(`/incidents/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<Incident>> => {
    const res = await api.delete(`/incidents/${id}`);
    return res.data;
  },
};
