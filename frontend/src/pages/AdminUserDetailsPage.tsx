import { useParams } from 'react-router-dom';
import { ROUTE_PARAMS } from '@/routes/paths';

export const AdminUserDetailsPage = () => {
  const { [ROUTE_PARAMS.USER_ID]: userId } = useParams();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Profil użytkownika</h1>
        <p className="mt-2 text-gray-500">TODO: szczegóły użytkownika {userId}</p>
      </div>
    </main>
  );
};
