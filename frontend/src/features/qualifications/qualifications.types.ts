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
