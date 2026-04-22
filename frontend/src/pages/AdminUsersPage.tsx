import { useState } from 'react';
import { UserTable, InviteUserModal } from '@/features/user-management';
import { Button } from '@/components/ui/button';

export const AdminUsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Rejestr użytkowników systemu</h1>
          <Button onClick={() => setIsModalOpen(true)}>Dodaj</Button>
        </div>

        <UserTable />

        {isModalOpen && <InviteUserModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </main>
  );
};
