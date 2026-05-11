import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Crown, ShieldCheck } from "lucide-react";
import type { BasicUserResponse } from "@/features/user-management/user-management.types";
import {useProjectMembers} from "@/features/project/project.hooks.ts";

interface ProjectMembersSideBarProps {
  projectId: string;
}

const MemberRow = ({ user }: { user: BasicUserResponse }) => {
  const initials = `${user.name?.charAt(0) || ''}${user.surname?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-900">
          {user.name} {user.surname}
        </span>
        <span className="text-xs text-slate-500 truncate max-w-[150px]">
          {user.email}
        </span>
      </div>
    </div>
  );
};

export const ProjectMembersSideBar = ({ projectId }: ProjectMembersSideBarProps) => {
  const { data: members, isLoading, isError } = useProjectMembers(projectId);

  if (isLoading) {
    return <div className="p-4 text-center text-slate-500 animate-pulse">Ładowanie zespołu...</div>;
  }

  if (isError || !members) {
    return <div className="p-4 text-center text-red-500">Nie udało się załadować członków zespołu.</div>;
  }

  return (
    <div className="space-y-6">
      {/* SPONSORZY */}
      {members.sponsors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2 text-slate-800">
              <Crown className="h-4 w-4 text-amber-500" />
              Sponsorzy Projektu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {members.sponsors.map(sponsor => (
              <MemberRow key={sponsor.id} user={sponsor} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* KOMITET STERUJĄCY */}
      {members.committees.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2 text-slate-800">
              <ShieldCheck className="h-4 w-4 text-blue-500" />
              Komitet Sterujący
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {members.committees.map(committee => (
              <MemberRow key={committee.id} user={committee} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* PRACOWNICY / ZESPÓŁ */}
      {members.employees.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2 text-slate-800">
              <Users className="h-4 w-4 text-emerald-500" />
              Zespół Projektowy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {members.employees.map(employee => (
              <MemberRow key={employee.id} user={employee} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};