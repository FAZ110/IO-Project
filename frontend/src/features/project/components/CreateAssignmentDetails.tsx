import { Input } from "@/components/ui/input";
import { EmployeeWorkloadChart } from "@/features/employee-assignments/components/EmployeeWorkloadChart";
import { useFormContext } from "react-hook-form";
import type { ProjectResponse } from "../project.types";
import { FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form";
import { useUserWorkload } from "@/features/user-management/user-management.hooks";
import { Slider } from "@/components/ui/slider"
import type { CreateAssignmentFormData } from "../project.schema";
import { DatePicker } from "@/components/ui/date-picker";
import { useMemo } from "react";

interface CreateAssignmentDetailsProps {
  project: ProjectResponse
}

export const CreateAssignmentDetails = ({ project }: CreateAssignmentDetailsProps) => {
  const { control, watch } = useFormContext<CreateAssignmentFormData>();

  const selectedUserId = watch("userId");
  const { userWorkload } = useUserWorkload(selectedUserId);

  const projectStart = new Date(project.startDate);
  const projectEnd = new Date(project.endDate);

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const utilizationPercentage = watch("utilizationPercentage");

  const requestedWorkload = useMemo(() => {
    if (!startDate || !endDate) return [];

    return [{
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      percentage: utilizationPercentage || 0,
    }];
  }, [startDate, endDate, utilizationPercentage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {userWorkload && (
        <div className="rounded-lg border bg-muted/20 p-4">
          <EmployeeWorkloadChart
            currentWorkload={userWorkload}
            requestedWorkload={requestedWorkload}
            startDate={projectStart}
            endDate={projectEnd}
          />
        </div>
      )}

      <div className="grid gap-4 py-4">
        <FormField
          control={control}
          name="roleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rola w projekcie</FormLabel>
              <FormControl>
                <Input placeholder="np. Senior React Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data rozpoczęcia</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  disabled={(date) => date < projectStart || date > endDate}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data zakończenia</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  disabled={(date) => date > projectEnd || date < startDate}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="utilizationPercentage"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Zaangażowanie</FormLabel>
                <span className="text-sm font-medium text-muted-foreground">
                  {field.value}%
                </span>
              </div>
              <FormControl>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};