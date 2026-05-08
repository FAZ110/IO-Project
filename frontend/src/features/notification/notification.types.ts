import { PATHS } from '@/routes/paths';

export type NotificationType =
  | 'ASSIGNMENT_REQUESTED'
  | 'ASSIGNMENT_ACCEPTED'
  | 'ASSIGNMENT_REJECTED'
  | 'QUALIFICATION_REQUESTED'
  | 'QUALIFICATION_ACCEPTED'
  | 'QUALIFICATION_REJECTED'
  | 'SYSTEM_NEW_EMPLOYEE';

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  referenceId: string;
  createdAt: string;
}

// TODO: Do zmiany gdy już beda znane
export const getNotificationUrl = (type: NotificationType, referenceId: string): string => {
  switch (type) {
    case 'ASSIGNMENT_REQUESTED':
      return `/requests`;
    case 'ASSIGNMENT_ACCEPTED':
    case 'ASSIGNMENT_REJECTED':
      return `project/${referenceId}`
    case 'QUALIFICATION_REQUESTED':
      return `/requests`;
    case 'QUALIFICATION_ACCEPTED':
    case 'QUALIFICATION_REJECTED':
      return `/qualifications/${referenceId}`;
    case 'SYSTEM_NEW_EMPLOYEE':
      return `/profile`;
    default:
      return PATHS.ROOT;
  }
};