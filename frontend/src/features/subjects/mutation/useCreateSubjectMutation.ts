import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';


import { createSubject } from '@/features/subjects/api';
import { useMeQuery } from '@/features/accounts/queries/useMeQuery';


export const useCreateSubjectMutation = () => {
  const queryClient = useQueryClient();
  const me = useMeQuery().data

  return useMutation({
    mutationFn: (name: string) => createSubject(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects", "overview", me?.id] });
    },
    onError: (error: Error) => {
      console.error("Failed to create subject:", error);
    },
  })
};
