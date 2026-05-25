import { Controller, useFormContext } from "react-hook-form";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StepBasicInformationViewProps {
    register: UseFormRegister<ProjectCreationRequest>;
    errors: FieldErrors<ProjectCreationRequest>;
    groups: { id: string; name: string }[];
}

export const StepBasicInformation = ({
    register,
    errors,
    groups,
}: StepBasicInformationViewProps) => {
    const { control, setValue } = useFormContext<ProjectCreationRequest>();

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="title">Nazwa projektu *</Label>
                <Input
                    id="title"
                    {...register("title")}
                    placeholder="Wpisz nazwę projektu..."
                    className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                    <p className="text-destructive text-xs">{errors.title.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="description">Opis *</Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    rows={3}
                    placeholder="Krótki opis celu projektu..."
                    className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                    <p className="text-destructive text-xs">{errors.description.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Grupa Projektowa <span className="text-muted-foreground font-normal">(opcjonalnie)</span></Label>
                <Controller
                    control={control}
                    name="projectGroupId"
                    render={({ field }) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-ring",
                                        errors.projectGroupId ? "border-destructive" : "border-input",
                                        !field.value && "text-muted-foreground"
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

                            <DropdownMenuContent align="start" className="z-50 bg-white">
                                {groups.length > 0 ? (
                                    groups.map((group) => (
                                        <DropdownMenuItem
                                            key={group.id}
                                            onSelect={() =>
                                                setValue("projectGroupId", group.id, { shouldValidate: true })
                                            }
                                            className="flex items-center justify-between cursor-pointer"
                                        >
                                            {group.name}
                                            {field.value === group.id && (
                                                <CheckIcon className="h-4 w-4 text-primary" />
                                            )}
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground italic text-center">
                                        Brak dostępnych grup
                                    </div>
                                )}

                                {field.value && (
                                    <>
                                        <div className="my-1 h-px bg-border" />
                                        <DropdownMenuItem
                                            onSelect={() =>
                                                setValue("projectGroupId", null, { shouldValidate: true })
                                            }
                                            className="text-destructive focus:text-destructive cursor-pointer"
                                        >
                                            Wyczyść wybór
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
            </div>
        </div>
    );
};
