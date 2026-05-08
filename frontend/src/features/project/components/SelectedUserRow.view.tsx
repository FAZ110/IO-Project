import { Button } from "@/components/ui/button";
import type { SimpleUserResponse } from "@/features/user-management";
import { UserIcon, X } from "lucide-react";

interface SelectedUserRowProps {
  user: SimpleUserResponse;
  unsetUser: () => void;
}

export const SelectedUserRow = ({ user, unsetUser }: SelectedUserRowProps) => {
  return (
    (
      <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-muted-foreground">
            Wybrany pracownik
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={unsetUser}
            className="h-7 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Zmień
          </Button>
        </div>

        <div className="flex items-center rounded-lg border bg-muted/30 px-3 py-3 shadow-sm">
          <div className="flex w-full items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border shadow-sm">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-semibold leading-none">
                {user.name} {user.surname}
              </span>
              <span className="mt-1 truncate text-xs text-muted-foreground">
                ID: {user.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  )
}