import { useEffect, useRef, useState } from 'react';
import { MoreVertical, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
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
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Button ref={buttonRef} variant="icon" onClick={handleOpen}>
        <MoreVertical size={16} />
      </Button>

      {open && (
        <div
          ref={dropdownRef}
          style={{ position: 'fixed', top: coords.top, right: coords.right }}
          className="z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1"
        >
          {user.status === 'PENDING' && (
            <button
              onClick={() => { onResend(user.id); setOpen(false); }}
              disabled={isResending}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Send size={14} className="text-blue-500" />
              {isResending ? 'Wysyłanie...' : 'Wyślij ponownie'}
            </button>
          )}
          <button
            onClick={() => { onDelete(user.id); setOpen(false); }}
            disabled={isDeleting}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={14} />
            {isDeleting ? 'Usuwanie...' : 'Usuń użytkownika'}
          </button>
        </div>
      )}
    </div>
  );
};
