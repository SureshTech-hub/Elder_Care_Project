import api from './axios';
import { ApiResponse, AIReview, AICategory } from '../types';

export interface AIReviewPayload {
  resident: string;
  input: string;
  category?: AICategory;
}

export const aiApi = {
  generateReview: async (payload: AIReviewPayload): Promise<ApiResponse<AIReview> & { aiConfigured?: boolean }> => {
    const res = await api.post('/ai/review', payload);
    return res.data;
  },
  getReviews: async (): Promise<ApiResponse<AIReview[]>> => {
    const res = await api.get('/ai/reviews');
    return res.data;
  },
  getReviewById: async (id: string): Promise<ApiResponse<AIReview>> => {
    const res = await api.get(`/ai/reviews/${id}`);
    return res.data;
  },
};
