import api from './axios';
import { ApiResponse, AuditLog } from '../types';

export const auditsApi = {
  getAll: async (): Promise<ApiResponse<AuditLog[]>> => {
    const res = await api.get('/audits');
    return res.data;
  },
  getMy: async (): Promise<ApiResponse<AuditLog[]>> => {
    const res = await api.get('/audits/my');
    return res.data;
  },
};
