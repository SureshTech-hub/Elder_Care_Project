import api from './axios';
import { ApiResponse, SummaryReport } from '../types';

export const reportsApi = {
  getSummary: async (): Promise<ApiResponse<SummaryReport>> => {
    const res = await api.get('/reports/summary');
    return res.data;
  },
};
