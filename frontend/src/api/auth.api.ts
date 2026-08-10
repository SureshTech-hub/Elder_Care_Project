import api from './axios';
import { ApiResponse, User } from '../types';

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<User>> => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
  }): Promise<ApiResponse<User>> => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
};
