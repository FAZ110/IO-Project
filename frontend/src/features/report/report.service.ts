import api from '@/api/client';
import type { AxiosResponse } from 'axios';

export const reportService = {
    getReportFile: async (url: string): Promise<AxiosResponse<Blob>> => {
        return await api.get(url, {
            responseType: 'blob',
        });
    }
};