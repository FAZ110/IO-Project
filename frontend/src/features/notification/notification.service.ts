import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { NotificationResponse } from './notification.types';
import type { PagedResponse } from '@/api/api.types';

export const notificationService = {
  getNotifications: async (unreadOnly: boolean = true, page: number = 0, size: number = 20): Promise<PagedResponse<NotificationResponse>> => {
    const { data } = await api.get<PagedResponse<NotificationResponse>>(ENDPOINTS.NOTIFICATIONS.BASE, {
      params: { unreadOnly, page, size }
    });
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  }
};