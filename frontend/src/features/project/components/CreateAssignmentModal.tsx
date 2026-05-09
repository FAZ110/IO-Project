import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { SimpleUserResponse } from "@/features/user-management"
import { useSearchUsers } from "@/features/user-management/user-management.hooks"
import { useCallback, useState } from "react"
import { useDebounce } from "use-debounce"
import type { ProjectResponse } from "../project.types"
import { useCreateEmployeeAssignment } from "../project.hooks"
import { useForm } from "react-hook-form"
import { SelectedUserRow } from "./SelectedUserRow.view"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreateAssignmentDetails } from "./CreateAssignmentDetails"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateAssignmentSchema, type CreateAssignmentFormData } from "../project.schema"
import { cn } from "@/lib/utils"
import { AvatarFallback, Avatar } from "@/components/ui/avatar"


interface CreateAssignmentModalProps {
  project: ProjectResponse;
}

const DEBOUNCE_TIME = 300;

const getInitials = (name: string, surname: string) => {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
};

export const CreateAssignmentModal = ({ project }: CreateAssignmentModalProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SimpleUserResponse | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [debouncedUserQuery] = useDebounce(userQuery, DEBOUNCE_TIME);
  const { users } = useSearchUsers(debouncedUserQuery);
  const { createAssignment, isCreatingAssignment } = useCreateEmployeeAssignment(project.id);

  const form = useForm<CreateAssignmentFormData>({
    resolver: zodResolver(CreateAssignmentSchema),
    defaultValues: {
      projectId: project.id,
      startDate: new Date(project.startDate),
      endDate: new Date(project.endDate),
      utilizationPercentage: 100,
      roleName: '',
    },
  });

  const { resetField, setValue } = form;

  const closeModal = useCallback(() => {
    setIsOpenModal(false);
    form.reset();
    setSelectedUser(null);
    setUserQuery('');
  }, [form, setSelectedUser, setUserQuery, setIsOpenModal]);

  const handleSelectUser = useCallback((user: SimpleUserResponse) => {
    setSelectedUser(user);
    setValue("userId", user.id, { shouldValidate: true });
  }, [setSelectedUser, setValue]);

  const handleUnsetUser = useCallback(() => {
    setSelectedUser(null);
    setUserQuery('');
    resetField("userId");
  }, [resetField, setSelectedUser, setUserQuery]);

  const onSubmit = useCallback((data: CreateAssignmentFormData) => {
    const payload = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    }

    createAssignment(payload, {
      onSuccess: () => {
        closeModal();
      }
    });
  }, [createAssignment, closeModal]);

  return (
    <Form {...form}>
      <Dialog open={isOpenModal} onOpenChange={open => open ? setIsOpenModal(true) : closeModal()}>
        <DialogTrigger asChild>
          <Button variant="outline">Stwórz wniosek</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto" data-project-id={project.id}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Stwórz wniosek</DialogTitle>
              <DialogDescription>
                Stwórz wniosek o przypisanie użytkownika do projektu.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="userId"
              render={({ fieldState }) => (
                <FormItem>
                  <FormLabel>Pracownik</FormLabel>
                  <FormControl>
                    <div className="mt-2">
                      {selectedUser ? (
                        <SelectedUserRow user={selectedUser} unsetUser={handleUnsetUser} />
                      ) : (
                        <Command
                          shouldFilter={false}
                          className={cn(
                            "border shadow-md rounded-lg overflow-hidden",
                            fieldState.error && "border-destructive ring-1 ring-destructive"
                          )}
                        >
                          <CommandInput
                            placeholder="Szukaj pracownika..."
                            onValueChange={setUserQuery}
                            className="h-12"
                          />
                          <CommandList className="max-h-[300px] min-h-[200px]">
                            <CommandEmpty>Nie znaleziono pracowników.</CommandEmpty>
                            <CommandGroup>
                              {users?.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  onSelect={() => handleSelectUser(user)}
                                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                                >
                                  <Avatar className="h-9 w-9 border">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                      {getInitials(user.name, user.surname)}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {user.name} {user.surname}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {user.id}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedUser && <CreateAssignmentDetails project={project} />}

            <DialogFooter>
              <Button type="submit" disabled={isCreatingAssignment}>
                Wyślij
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form >
  )
}