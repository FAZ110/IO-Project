import axios from 'axios';
import type { ApiErrorResponse } from './api.types';

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? 'Błąd komunikacji z API. Spróbuj ponownie później.';
  }

  return 'Wystąpił nieoczekiwany błąd aplikacji';
};