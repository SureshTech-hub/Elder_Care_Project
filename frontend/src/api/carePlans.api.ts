import api from './axios';
import { ApiResponse, CarePlan } from '../types';

export const carePlansApi = {
  getAll: async (): Promise<ApiResponse<CarePlan[]>> => {
    const res = await api.get('/care-plans');
    return res.data;
  },
  getByResident: async (residentId: string): Promise<ApiResponse<CarePlan[]>> => {
    const res = await api.get(`/care-plans/resident/${residentId}`);
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<CarePlan>> => {
    const res = await api.get(`/care-plans/${id}`);
    return res.data;
  },
  create: async (data: Partial<CarePlan>): Promise<ApiResponse<CarePlan>> => {
    const res = await api.post('/care-plans', data);
    return res.data;
  },
  update: async (id: string, data: Partial<CarePlan>): Promise<ApiResponse<CarePlan>> => {
    const res = await api.put(`/care-plans/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<CarePlan>> => {
    const res = await api.delete(`/care-plans/${id}`);
    return res.data;
  },
};
