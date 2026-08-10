import api from './axios';
import { ApiResponse, Task } from '../types';

export const tasksApi = {
  getAll: async (): Promise<ApiResponse<Task[]>> => {
    const res = await api.get('/tasks');
    return res.data;
  },
  getByResident: async (residentId: string): Promise<ApiResponse<Task[]>> => {
    const res = await api.get(`/tasks/resident/${residentId}`);
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Task>> => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },
  create: async (data: Partial<Task>): Promise<ApiResponse<Task>> => {
    const res = await api.post('/tasks', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Task>): Promise<ApiResponse<Task>> => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<Task>> => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};
