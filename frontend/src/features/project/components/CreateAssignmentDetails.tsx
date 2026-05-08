import { Input } from "@/components/ui/input";
import { EmployeeWorkloadChart } from "@/features/employee-assignments/components/EmployeeWorkloadChart";
import { useFormContext } from "react-hook-form";
import type { ProjectResponse } from "../project.types";
import { FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form";
import { useUserWorkload } from "@/features/user-management/user-management.hooks";
import { Slider } from "@/components/ui/slider"
import type { CreateAssignmentFormData } from "../project.schema";
import { DatePicker } from "@/components/ui/date-picker";

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {userWorkload && (
        <div className="rounded-lg border bg-muted/20 p-4">
          <EmployeeWorkloadChart
            currentWorkload={userWorkload}
            requestedWorkload={(startDate && endDate) ? [{
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              percentage: utilizationPercentage || 0,
            }] : []}
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



//       {/* <CreateAssignmentDetails project={project} /> */}

//       {/* <div className="grid gap-3">
//           <div className="mt-3">
//             {userWorkload && <EmployeeWorkloadChart currentWorkload={userWorkload} requestedWorkload={requestedWorkload} />}
//           </div>


//             <div className="space-y-2">
//               <div className="flex items-center justify-between gap-3">
//                 <label className="block text-sm font-medium">Percentage</label>
//                 <span className="text-sm text-muted-foreground">{utilizationPercentage}%</span>
//               </div>
//               <Controller
//                 name="utilizationPercentage"
//                 control={control}
//                 render={({ field }) => (
//                   <Slider
//                     value={[field.value]}
//                     min={0}
//                     max={100}
//                     step={1}
//                     onValueChange={([value]) => field.onChange(value)}
//                     className="w-full py-2"
//                   />
//                 )}
//               />
//             </div>
//           </div>
//           {errors.startDate && (
//             <div className="pt-2 text-sm text-destructive">{errors.startDate.message}</div>
//           )}
//           {errors.endDate && (
//             <div className="pt-2 text-sm text-destructive">{errors.endDate.message}</div>
//           )}
//         </div> */}


//   )
// }
// const formatDate = (date: Date) => date.toISOString().slice(0, 10);

// const getDefaultDates = (projectStart?: string, projectEnd?: string) => {
//   const now = new Date();
//   const projStart = projectStart ? new Date(projectStart) : null;
//   const projEnd = projectEnd ? new Date(projectEnd) : null;

//   const startDate = projStart && projStart > now ? projStart : now;
//   const endDate = new Date(startDate);
//   endDate.setMonth(endDate.getMonth() + 1);

//   if (projEnd && endDate > projEnd) endDate.setTime(projEnd.getTime());
//   if (projEnd && startDate > projEnd) startDate.setTime(projEnd.getTime());

//   return {
//     startDate: formatDate(startDate),
//     endDate: formatDate(endDate),
//   };
// };



// const requestedWorkload = useMemo(() => [{
//   startDate,
//   endDate,
//   percentage: utilizationPercentage,
// }], [endDate, utilizationPercentage, startDate]);

// const visibleUsers = useMemo(() => {
//   const list = users ?? [];
//   if (!selectedUser) return list;

//   const next = list.filter((user) => user.id !== selectedUser.id);
//   return [selectedUser, ...next];
// }, [users, selectedUser]);

// const defaultDates = getDefaultDates(project.startDate, project.endDate);
// reset(defaultDates);
// const defaultDates = getDefaultDates(project.startDate, project.endDate);