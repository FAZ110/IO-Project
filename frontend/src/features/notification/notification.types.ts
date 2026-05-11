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

export interface UnreadCountResponse {
  count: number;
}