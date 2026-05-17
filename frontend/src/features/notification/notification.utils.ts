import type { NotificationType } from "@/features/notification/notification.types.ts";
import {PATHS, QUERY_PARAMS} from "@/routes/paths.ts";

export const getNotificationUrl = (type: NotificationType, referenceId: string): string => {
  switch (type) {
    case 'ASSIGNMENT_REQUESTED':
      return `${PATHS.PROJECT_REQUESTS}?${QUERY_PARAMS.REQUEST_ID}=${referenceId}`;

    case 'ASSIGNMENT_ACCEPTED':
      return PATHS.PROJECT(referenceId);
    case 'ASSIGNMENT_REJECTED':
      return PATHS.PROJECT(referenceId);

    case 'QUALIFICATION_REQUESTED':
      return `${PATHS.QUALIFICATION_REQUESTS}?${QUERY_PARAMS.USER_ID}=${referenceId}`;

    case 'QUALIFICATION_ACCEPTED':
    case 'QUALIFICATION_REJECTED':
      return PATHS.PROFILE;

    case 'SYSTEM_NEW_EMPLOYEE':
      return PATHS.PROFILE; // TODO: Powinno przenosic na profil pracownika, ale nie ma obecnie takiej mozliwosci

    default:
      return PATHS.ROOT;
  }
};