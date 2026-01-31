import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';


import { createSubject } from '@/features/subjects/api';

export const useCreateSubjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createSubject(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects", "overview"] });
    },
    onError: (error: Error) => {
      console.error("Failed to create subject:", error);
    },
  })
};
