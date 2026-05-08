import { useQuery } from '@tanstack/react-query';
import type { NotificationResponse } from './notification.types';
import {NOTIFICATION_KEYS} from "@/features/notification/notification.keys.ts";

const MOCK_NOTIFICATIONS: NotificationResponse[] = [
  {
    id: '1',
    type: 'ASSIGNMENT_REQUESTED',
    message: 'Jan Kowalski prosi o przypisanie do projektu "Apollo".',
    isRead: false,
    referenceId: 'proj-123',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'QUALIFICATION_ACCEPTED',
    message: 'Twoja kwalifikacja "React" została zaakceptowana.',
    isRead: true,
    referenceId: 'qual-456',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const useNotifications = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.feed(),
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_NOTIFICATIONS;
    },
  });
};