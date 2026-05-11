import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useNotificationStream } from '@/features/notification/notification.hooks';

export const MainLayout = () => {
  useNotificationStream();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};