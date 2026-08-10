import api from './axios';
import { ApiResponse, DashboardStats } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const res = await api.get('/dashboard');
    return res.data;
  },
};
