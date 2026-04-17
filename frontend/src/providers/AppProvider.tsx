import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { toast, Toaster } from 'sonner';
import { extractErrorMessage } from '../api/api.utils';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      toast.error('Błąd', { description: extractErrorMessage(error) });
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TOAST_DURATION = Number(import.meta.env.VITE_TOAST_DURATION) || 5000;

export const AppProvider = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {children}
      <Toaster position="top-right" richColors theme="dark" expand={true} duration={TOAST_DURATION} />
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);