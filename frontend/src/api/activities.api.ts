import api from './axios';
import { ApiResponse, Activity } from '../types';

export const activitiesApi = {
  getAll: async (): Promise<ApiResponse<Activity[]>> => {
    const res = await api.get('/activities');
    return res.data;
  },
  getByResident: async (residentId: string): Promise<ApiResponse<Activity[]>> => {
    const res = await api.get(`/activities/resident/${residentId}`);
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Activity>> => {
    const res = await api.get(`/activities/${id}`);
    return res.data;
  },
  create: async (data: Partial<Activity>): Promise<ApiResponse<Activity>> => {
    const res = await api.post('/activities', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Activity>): Promise<ApiResponse<Activity>> => {
    const res = await api.put(`/activities/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<Activity>> => {
    const res = await api.delete(`/activities/${id}`);
    return res.data;
  },
};
