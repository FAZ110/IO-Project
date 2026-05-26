import {
  Controller,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  type UseFormRegister,
  type Control,
} from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types";
import { getNextDateFromToday } from "../project.utils.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface StepMilestonesAndRisksProps {
  register: UseFormRegister<ProjectCreationRequest>;
  control: Control<ProjectCreationRequest>;
  errors: FieldErrors<ProjectCreationRequest>;

  milestonesFields: FieldArrayWithId<ProjectCreationRequest, "milestones", "id">[];
  appendMilestone: UseFieldArrayAppend<ProjectCreationRequest, "milestones">;
  removeMilestone: UseFieldArrayRemove;

  riskFields: FieldArrayWithId<ProjectCreationRequest, "risks", "id">[];
  appendRisk: UseFieldArrayAppend<ProjectCreationRequest, "risks">;
  removeRisk: UseFieldArrayRemove;

  projectStartDate?: string;
  projectEndDate?: string;
}

export const StepMilestonesAndRisks = ({
                                         register,
                                         control,
                                         errors,
                                         milestonesFields,
                                         appendMilestone,
                                         removeMilestone,
                                         riskFields,
                                         appendRisk,
                                         removeRisk,
                                         projectStartDate,
                                         projectEndDate,
                                       }: StepMilestonesAndRisksProps) => {

  const minAllowedDate = projectStartDate || getNextDateFromToday(0);

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-semibold">Kamienie Milowe</h3>
            <p className="text-sm text-muted-foreground">Dodaj kluczowe etapy realizacji w ramach dat projektu.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendMilestone({ date: "", name: "", description: "" })}
          >
            <Plus className="size-4 mr-1" /> Dodaj
          </Button>
        </div>

        <div className="space-y-3">
          {milestonesFields.map((field, index) => {
            return (
              <div key={field.id} className="p-4 border border-border rounded-lg bg-muted/30 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMilestone(index)}
                  className="absolute top-2 right-2 size-7 text-muted-foreground hover:text-destructive"
                  aria-label="Usuń kamień milowy"
                >
                  <X className="size-4" />
                </Button>

                <div className="grid grid-cols-2 gap-4 mb-3 pr-8">
                  <div className="space-y-1">
                    <Label className="text-xs">Nazwa kamienia milowego</Label>
                    <Input
                      {...register(`milestones.${index}.name`, {
                        required: "Nazwa jest wymagana",
                      })}
                      placeholder="np. Analiza wymagań"
                      className={`h-8 text-sm ${errors.milestones?.[index]?.name ? "border-destructive" : ""}`}
                    />
                    {errors.milestones?.[index]?.name && (
                      <p className="text-destructive text-xs">{errors.milestones[index].name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Data realizacji</Label>
                    <Input
                      {...register(`milestones.${index}.date`, {
                        required: "Data jest wymagana",
                        validate: (value) => {
                          if (value < minAllowedDate) {
                            return "Nie może być przed rozpoczęciem projektu";
                          }
                          if (projectEndDate && value > projectEndDate) {
                            return "Nie może być po zakończeniu projektu";
                          }
                          return true;
                        },
                      })}
                      type="date"
                      min={minAllowedDate}
                      max={projectEndDate}
                      className={`h-8 text-sm ${errors.milestones?.[index]?.date ? "border-destructive" : ""}`}
                    />
                    {errors.milestones?.[index]?.date && (
                      <p className="text-destructive text-xs">{errors.milestones[index].date.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Opis <span className="text-muted-foreground font-normal">(opcjonalnie)</span></Label>
                  <Textarea
                    {...register(`milestones.${index}.description`)}
                    rows={2}
                    placeholder="Krótki opis celu tego etapu..."
                    className="text-sm"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-semibold">Ryzyka Projektu</h3>
            <p className="text-sm text-muted-foreground">Dodaj ryzyka na skali 1–5 (prawdopodobieństwo × wpływ).</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendRisk({ name: "", description: "", probability: 1, impact: 1 })}
          >
            <Plus className="size-4 mr-1" /> Dodaj
          </Button>
        </div>

        <div className="space-y-3">
          {riskFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-border rounded-lg bg-muted/30 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRisk(index)}
                className="absolute top-2 right-2 size-7 text-muted-foreground hover:text-destructive"
                aria-label="Usuń ryzyko"
              >
                <X className="size-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 pr-8">
                <div className="space-y-1">
                  <Label className="text-xs">Nazwa ryzyka</Label>
                  <Input
                    {...register(`risks.${index}.name`, { required: "Nazwa jest wymagana" })}
                    className={`h-8 text-sm ${errors.risks?.[index]?.name ? "border-destructive" : ""}`}
                  />
                  {errors.risks?.[index]?.name && (
                    <p className="text-destructive text-xs">{errors.risks[index].name.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Prawdopodobieństwo (1–5)</Label>
                  <Controller
                    control={control}
                    name={`risks.${index}.probability`}
                    render={({ field: f }) => (
                      <Select
                        value={String(f.value)}
                        onValueChange={(val) => f.onChange(Number(val))}
                      >
                        <SelectTrigger className="h-8 w-full text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((v) => (
                            <SelectItem key={v} value={String(v)}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Wpływ (1–5)</Label>
                  <Controller
                    control={control}
                    name={`risks.${index}.impact`}
                    render={({ field: f }) => (
                      <Select
                        value={String(f.value)}
                        onValueChange={(val) => f.onChange(Number(val))}
                      >
                        <SelectTrigger className="h-8 w-full text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((v) => (
                            <SelectItem key={v} value={String(v)}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Opis ryzyka</Label>
                <Textarea
                  {...register(`risks.${index}.description`, { required: "Opis jest wymagany" })}
                  rows={2}
                  className={`text-sm ${errors.risks?.[index]?.description ? "border-destructive" : ""}`}
                />
                {errors.risks?.[index]?.description && (
                  <p className="text-destructive text-xs">{errors.risks[index].description.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};