import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { reportService } from './report.service';

export const useReportDownload = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadReport = useCallback(async (url: string, filename: string) => {
        setIsDownloading(true);
        try {
            const response = await reportService.getReportFile(url);

            const disposition = response.headers['content-disposition'] as string | undefined;
            let finalFilename = filename;

            if (disposition && typeof disposition === 'string' && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    finalFilename = matches[1].replace(/['"]/g, '');
                }
            }

            const contentType = (response.headers['content-type'] as string) || 'application/octet-stream';
            const blob = new Blob([response.data], { type: contentType });

            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', finalFilename);

            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            toast.success('Pobieranie pliku rozpoczęto.');
        } catch (error) {
            console.error('Błąd podczas pobierania raportu:', error);
            toast.error('Wystąpił błąd podczas generowania lub pobierania raportu.');
        } finally {
            setIsDownloading(false);
        }
    }, []);

    const downloadProjectCardPdf = useCallback((projectId: string) => {
        downloadReport(`/reports/${projectId}?type=PROJECT_CARD_PDF`, 'karta_projektu.pdf');
    }, [downloadReport]);

    const downloadProjectRisksCsv = useCallback((projectId: string) => {
        downloadReport(`/reports/${projectId}?type=PROJECT_RISKS_CSV`, 'ryzyka.csv');
    }, [downloadReport]);

    const downloadProjectRisksPdf = useCallback((projectId: string) => {
        downloadReport(`/reports/${projectId}?type=PROJECT_RISKS_PDF`, 'ryzyka.pdf');
    }, [downloadReport]);

    const downloadGroupProjectsCsv = useCallback((groupId: string, groupName: string) => {
        const filename = `zestawienie_${groupName.toLowerCase().replace(/\s+/g, '_')}.csv`;
        downloadReport(`/reports/${groupId}?type=GROUP_PROJECTS_CSV`, filename);
    }, [downloadReport]);

    return {
        isDownloading,
        downloadProjectCardPdf,
        downloadProjectRisksCsv,
        downloadProjectRisksPdf,
        downloadGroupProjectsCsv
    };
};