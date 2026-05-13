import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { AddQualificationRequest, QualificationDetailsResponse, QualificationRequestResponse, QualificationResponse, QualificationUpdateRequest, SkillSuggestion } from './qualifications.types';

export const qualificationsService = {
  getMyQualifications: async (): Promise<QualificationResponse[]> => {
    const res = await api.get<QualificationResponse[]>(ENDPOINTS.ME.QUALIFICATIONS);
    return res.data;
  },

  addQualifications: async (data: AddQualificationRequest): Promise<QualificationResponse[]> => {
    const res = await api.post<QualificationResponse[]>(ENDPOINTS.ME.QUALIFICATIONS, data);
    return res.data;
  },

  deleteQualification: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.ME.QUALIFICATION(id));
  },

  searchSkills: async (query: string): Promise<SkillSuggestion[]> => {
    const res = await api.get<SkillSuggestion[]>(ENDPOINTS.SKILLS, { params: { query } });
    return res.data;
  },

  getUsersWithWaitingQualifications: async (): Promise<QualificationRequestResponse[]> => {
    const res = await api.get<QualificationRequestResponse[]>(ENDPOINTS.APPROVALS.QUALIFICATIONS);
    return res.data;
  },

  getQualificationRequestDetails: async (userId: string): Promise<QualificationDetailsResponse[]> => {
    const res = await api.get<QualificationDetailsResponse[]>(ENDPOINTS.APPROVALS.QUALIFICATION_DETAILS, {
      params: { userId }
    });
    return res.data;
  },

  updateQualificationRequests: async (requests: QualificationUpdateRequest[]): Promise<void> => {
    await api.post(ENDPOINTS.APPROVALS.QUALIFICATIONS_BULK_UPDATE, requests);
  }
};
