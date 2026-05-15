import type { ProjectDetailsResponse } from "@/features/project";
import { CalendarIcon, Folder, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectHeaderProps {
    details: ProjectDetailsResponse;
}

export const ProjectHeader = ({ details }: ProjectHeaderProps) => {
    const groupName = details.group?.name;
    const isWallet = details.group?.groupType === 'WALLET';

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
    );
};