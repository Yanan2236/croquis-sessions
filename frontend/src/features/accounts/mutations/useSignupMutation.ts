import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

import { signup } from '@/features/accounts/api';

export const useSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      { username, email, password, password_confirm }: { username: string; email: string; password: string; password_confirm: string }
    ) => signup(
      username, email, password, password_confirm
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: AxiosError) => {
      const status = error.response?.status;
      const data = error.response?.data;
      console.error('Signup failed:', { status, data });
    }
  });
}
