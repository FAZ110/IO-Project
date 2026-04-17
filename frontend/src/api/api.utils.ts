import axios from 'axios';
import type { ApiErrorResponse } from './api.types';

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response) {
      return error.response.data?.message ?? `Błąd serwera (${error.response.status})`;
    }

    if (error.request) {
      return 'Serwer nie odpowiada. Spróbuj ponownie później.';
    }

    return error.message;
  }

  return 'Wystąpił nieoczekiwany błąd aplikacji';
};