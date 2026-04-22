import { MoreVertical, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { UserResponse } from '../user-management.types';

interface UserActionsDropdownProps {
  user: UserResponse;
  onDelete: (userId: string) => void;
  onResend: (userId: string) => void;
  isDeleting: boolean;
  isResending: boolean;
}

export const UserActionsDropdown = ({
  user,
  onDelete,
  onResend,
  isDeleting,
  isResending,
}: UserActionsDropdownProps) => {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <span className="sr-only">Otwórz menu</span>
            <MoreVertical className="h-4 w-4 text-slate-500" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">

          {user.status === 'PENDING' && (
            <>
              <DropdownMenuItem
                onClick={() => onResend(user.id)}
                disabled={isResending}
                className="cursor-pointer text-slate-700 focus:bg-slate-50"
              >
                <Send className="mr-2 h-4 w-4 text-blue-500" />
                <span>{isResending ? 'Wysyłanie...' : 'Wyślij ponownie'}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={() => onDelete(user.id)}
            disabled={isDeleting}
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>{isDeleting ? 'Usuwanie...' : 'Usuń użytkownika'}</span>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};