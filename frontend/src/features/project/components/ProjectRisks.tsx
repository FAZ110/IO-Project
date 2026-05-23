import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Activity } from "lucide-react";
import { useProjectRisks } from "@/features/project/project.hooks.ts";

interface ProjectRisksProps {
  projectId: string;
}

const getRiskDetails = (value: number) => {
  if (value >= 15) return {
    label: "Krytyczne",
    borderLine: "bg-rose-500",
    badge: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200",
    barColor: "bg-rose-500"
  };
  if (value >= 10) return {
    label: "Wysokie",
    borderLine: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
    barColor: "bg-orange-500"
  };
  if (value >= 5) return {
    label: "Średnie",
    borderLine: "bg-amber-400",
    badge: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
    barColor: "bg-amber-400"
  };
  return {
    label: "Niskie",
    borderLine: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
    barColor: "bg-emerald-500"
  };
};

const MetricBar = ({ label, value, activeColor }: { label: string; value: number; activeColor: string }) => (
  <div className="flex flex-col gap-1.5 w-full sm:w-32 shrink-0">
    <div className="flex justify-between text-[11px] uppercase tracking-wider font-semibold">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-700">{value}/5</span>
    </div>
    <div className="flex gap-0.5 h-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`flex-1 rounded-full transition-colors ${
            i <= value ? activeColor : "bg-slate-100"
          }`}
        />
      ))}
    </div>
  </div>
);

export const ProjectRisks = ({ projectId }: ProjectRisksProps) => {
  const { data: risks, isLoading, isError } = useProjectRisks(projectId);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Ryzyka projektowe
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="pt-6 text-center text-red-500 font-medium">
          Nie udało się pobrać ryzyk dla tego projektu.
        </CardContent>
      </Card>
    );
  }

  const sortedRisks = risks ? [...risks].sort((a, b) => b.value - a.value) : [];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <Activity className="h-5 w-5 text-rose-500" />
            Rejestr Ryzyk
          </CardTitle>
          <p className="text-sm text-slate-500">
            Zidentyfikowane zagrożenia (Prawdopodobieństwo × Wpływ).
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-5">
        {sortedRisks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
            <AlertTriangle className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm font-medium">Brak zarejestrowanych ryzyk w tym projekcie.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedRisks.map((risk) => {
              const { label, borderLine, badge, barColor } = getRiskDetails(risk.value);

              return (
                <div
                  key={risk.id}
                  className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${borderLine}`} />

                  <div className="flex-1 min-w-0 pl-2">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h4 className="font-semibold text-slate-900 truncate">{risk.name}</h4>
                      <Badge variant="outline" className={`shrink-0 border ${badge}`}>
                        {label} (Wartość: {risk.value})
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {risk.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pl-2 sm:pl-4 sm:border-l border-slate-100 mt-2 sm:mt-0">
                    <MetricBar label="Prawdopod." value={risk.probability} activeColor={barColor} />
                    <MetricBar label="Wpływ" value={risk.impact} activeColor={barColor} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};