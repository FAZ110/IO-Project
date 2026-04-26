import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { AddQualificationRequest, QualificationResponse } from './qualifications.types';

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
};
