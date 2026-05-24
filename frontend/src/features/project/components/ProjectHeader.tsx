import type { ProjectDetailsResponse } from "@/features/project";
import { CalendarIcon, Folder, Briefcase, Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProjectGroupType } from "@/features/project_group/project_group.types.ts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReportDownload } from "@/features/report/report.hooks";

interface ProjectHeaderProps {
    details: ProjectDetailsResponse;
}

export const ProjectHeader = ({ details }: ProjectHeaderProps) => {
    const groupName = details.group?.name;
    const isWallet = details.group?.groupType === ProjectGroupType.WALLET;
    
    const { downloadReport, isDownloading } = useReportDownload();

    const handleDownloadCardPdf = () => {
        downloadReport(`/projects/${details.id}/reports/card/pdf`, 'karta_projektu.pdf');
    };

    const handleDownloadRisksCsv = () => {
        downloadReport(`/projects/${details.id}/reports/risks/csv`, 'ryzyka.csv');
    };

    const handleDownloadRisksPdf = () => {
        downloadReport(`/projects/${details.id}/reports/risks/pdf`, 'ryzyka.pdf');
    };

    return (
        <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-start md:justify-between">

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {details.title}
                    </h1>
                    <Badge variant={details.isActive ? "default" : "secondary"}>
                        {details.isActive ? "Aktywny" : "Zakończony"}
                    </Badge>
                </div>

                {groupName && (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 w-fit px-2.5 py-1 rounded-md border border-blue-100">
                        {isWallet ? <Briefcase className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                        {isWallet ? 'Portfel:' : 'Program:'} {groupName}
                    </div>
                )}

                <p className="max-w-2xl text-gray-500">
                    {details.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Start: {new Date(details.startDate).toLocaleDateString('pl-PL')}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 shrink-0" disabled={isDownloading}>
                            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            Eksportuj
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={handleDownloadCardPdf} className="cursor-pointer">
                            <FileText className="w-4 h-4 mr-2 text-red-500" />
                            Karta Projektu (PDF)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDownloadRisksCsv} className="cursor-pointer">
                            <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                            Rejestr Ryzyk (CSV)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDownloadRisksPdf} className="cursor-pointer">
                            <FileText className="w-4 h-4 mr-2 text-red-500" />
                            Rejestr Ryzyk (PDF)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm shrink-0">
                    <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                            {details.manager.name?.[0] || ''}{details.manager.surname?.[0] || ''}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                            {details.manager.name} {details.manager.surname}
                        </span>
                        <span className="text-xs text-gray-500">Kierownik Projektu</span>
                    </div>
                </div>
            </div>

        </div>
    );
};