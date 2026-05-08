import { Controller, useFormContext } from "react-hook-form";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateProjectFormData } from "../project.schema";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Import Twoich komponentów DropdownMenu
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StepBasicInformationViewProps {
    register: UseFormRegister<CreateProjectFormData>;
    errors: FieldErrors<CreateProjectFormData>;
    groups: { id: string; name: string }[];
}

export const StepBasicInformation = ({ 
    register, 
    errors, 
    groups 
}: StepBasicInformationViewProps) => {
    const { control, setValue } = useFormContext<CreateProjectFormData>();

    return (
        <div className="space-y-4">
            {/* --- NAZWA PROJEKTU --- */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa projektu *
                </label>
                <input
                    {...register("title")}
                    type="text"
                    placeholder="Wpisz nazwę projektu..."
                    className={cn(
                        "w-full border rounded p-2 outline-none transition-all focus:ring-2 focus:ring-blue-500",
                        errors.title ? "border-red-500" : "border-gray-300"
                    )}
                />
                {errors.title && (
                    <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>
                )}
            </div>

            {/* --- OPIS PROJEKTU --- */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opis *
                </label>
                <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Krótki opis celu projektu..."
                    className={cn(
                        "w-full border rounded p-2 outline-none transition-all focus:ring-2 focus:ring-blue-500",
                        errors.description ? "border-red-500" : "border-gray-300"
                    )}
                />
                {errors.description && (
                    <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>
                )}
            </div>

            {/* --- GRUPA PROJEKTOWA --- */}
            <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grupa Projektowa (portfel/program)
                </label>

                <Controller
                    control={control}
                    name="projectGroupId"
                    render={({ field }) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500",
                                        errors.projectGroupId ? "border-red-500" : "border-gray-300",
                                        !field.value && "text-gray-400"
                                    )}
                                >
                                    <span className="truncate">
                                        {field.value
                                            ? groups.find((g) => g.id === field.value)?.name
                                            : "Wybierz grupę..."}
                                    </span>
                                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent 
                                align="start" 
                                className="z-50 bg-white"
                            >
                                {groups.length > 0 ? (
                                    groups.map((group) => (
                                        <DropdownMenuItem
                                            key={group.id}
                                            onSelect={() => {
                                                // Aktualizujemy wartość w formularzu
                                                setValue("projectGroupId", group.id, { shouldValidate: true });
                                            }}
                                            className="flex items-center justify-between cursor-pointer"
                                        >
                                            {group.name}
                                            {field.value === group.id && (
                                                <CheckIcon className="h-4 w-4 text-blue-600" />
                                            )}
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-gray-400 italic text-center">
                                        Brak dostępnych grup
                                    </div>
                                )}

                                {field.value && (
                                    <>
                                        <div className="my-1 h-px bg-gray-100" />
                                        <DropdownMenuItem
                                            onSelect={() => setValue("projectGroupId", null, { shouldValidate: true })}
                                            className="text-red-600 focus:text-red-700 cursor-pointer"
                                        >
                                            Wyczyść wybór
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
                
                {errors.projectGroupId && (
                    <span className="text-red-500 text-xs mt-1">
                        {errors.projectGroupId.message}
                    </span>
                )}
            </div>
        </div>
    );
};