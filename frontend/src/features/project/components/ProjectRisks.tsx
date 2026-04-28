import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { useProjectRisks } from "@/features/project/project.hooks.ts";

interface ProjectRisksProps {
  projectId: string;
}

const getRiskColorClass = (probability: number) => {
  if (probability < 30) return "bg-green-100 text-green-800 hover:bg-green-200";
  if (probability < 70) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
  return "bg-red-100 text-red-800 hover:bg-red-200";
};

export const ProjectRisks = ({ projectId }: ProjectRisksProps) => {
  const { data: risks, isLoading, isError } = useProjectRisks(projectId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ryzyka projektowe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6 text-center text-red-500">
          Nie udało się pobrać ryzyk dla tego projektu.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Ryzyka projektowe
          </CardTitle>
          <CardDescription>
            Zidentyfikowane zagrożenia i prawdopodobieństwo ich wystąpienia.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {!risks || risks.length === 0 ? (
          <div className="text-center text-slate-500 py-6">
            Brak zarejestrowanych ryzyk w tym projekcie.
          </div>
        ) : (
          <div className="space-y-6">
            {risks.map((risk) => (
              <div key={risk.id} className="flex flex-col space-y-2 pb-4 border-b last:border-0 last:pb-0">

                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{risk.name}</h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {risk.description}
                    </p>
                  </div>
                  <Badge className={`ml-4 shrink-0 ${getRiskColorClass(risk.probability)}`} variant="secondary">
                    {risk.probability}%
                  </Badge>
                </div>

                <div className="w-full flex items-center gap-3 pt-2">
                  <span className="text-xs text-slate-400 w-8">0%</span>
                  <Progress
                    value={risk.probability}
                    className="h-2"
                  />
                  <span className="text-xs text-slate-400 w-10 text-right">100%</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};