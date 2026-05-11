import { useState } from 'react';
import { UserTable, InviteUserModal } from '@/features/user-management';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const AdminUsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Rejestr użytkowników systemu</h1>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer shadow-sm hover:shadow-md transition-all px-6 py-5"
          >
            <Plus className="mr-2 h-4 w-4" />
            Dodaj użytkownika
          </Button>

        </div>

        <UserTable />

        {isModalOpen && <InviteUserModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
};