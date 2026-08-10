import api from './axios';
import { ApiResponse, NotificationItem } from '../types';

export const notificationsApi = {
  getMyNotifications: async (): Promise<ApiResponse<NotificationItem[]>> => {
    const res = await api.get('/notifications/my');
    return res.data;
  },
  getAll: async (): Promise<ApiResponse<NotificationItem[]>> => {
    const res = await api.get('/notifications');
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<NotificationItem>> => {
    const res = await api.get(`/notifications/${id}`);
    return res.data;
  },
  create: async (data: Partial<NotificationItem>): Promise<ApiResponse<NotificationItem>> => {
    const res = await api.post('/notifications', data);
    return res.data;
  },
  markAsRead: async (id: string): Promise<ApiResponse<NotificationItem>> => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async (): Promise<ApiResponse<{ modifiedCount?: number }>> => {
    const res = await api.put('/notifications/my/read-all');
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<NotificationItem>> => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },
};
