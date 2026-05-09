export const QualificationStatus = {
  WAITING: 'WAITING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

export type QualificationStatus = typeof QualificationStatus[keyof typeof QualificationStatus];

export interface QualificationResponse {
  id: string;
  name: string;
  status: QualificationStatus;
}

export interface AddQualificationRequest {
  skillNames: string[];
  skillIds: string[];
}

export interface SkillSuggestion {
  id: string;
  name: string;
}

export interface PendingSkill {
  name: string;
  id?: string;
}

export const QualificationUpdateAction = {
  ACCEPT: 'ACCEPT',
  REJECT: 'REJECT',
  EMPTY: 'EMPTY',
} as const;

export type QualificationUpdateAction = typeof QualificationUpdateAction[keyof typeof QualificationUpdateAction];

export interface QualificationUpdateRequest {
  qualificationId: string;
  action: QualificationUpdateAction;
}

export interface QualificationRequestResponse {
  userId: string;
  employeeName: string;
  employeeSurname: string;
  qualificationsCount: number;
}

export interface QualificationDetailsResponse {
  qualificationId: string;
  qualificationName: string;
}