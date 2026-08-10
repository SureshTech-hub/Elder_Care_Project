import api from './axios';
import { ApiResponse, User } from '../types';

export const usersApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const res = await api.get('/users/profile');
    return res.data;
  },
};
