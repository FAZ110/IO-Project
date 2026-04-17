import { useMutation } from '@tanstack/react-query';
import { authService } from './auth.service';

export const useRegister = () => {
    return useMutation({
        mutationFn: authService.register,

        onSuccess: (data) => {
            console.log('Zarejestrowano pomyślnie', data); // wyrzucic
        }
    });
};