import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';

import { deleteSubject } from '@/features/subjects/api';
import type { SubjectOverview } from '../types';
import { useMeQuery } from '@/features/accounts/queries/useMeQuery';

export const useDeleteSubjectMutation = (
  options?: UseMutationOptions<{ delete_type: string }, Error, { subjectId: number }, unknown>
) => {
  const queryClient = useQueryClient();
  const me = useMeQuery().data
  
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<{ delete_type: string }, Error, { subjectId: number }, unknown>({
    ...rest,
    mutationFn: ({ subjectId }) => deleteSubject(subjectId),

    onSuccess: (data, variables, _context, _mutation) => {
      queryClient.setQueryData<SubjectOverview[]>(
        ["subjects", "overview", me?.id],
        (old) => (old ? old.filter((s) => s.id !== variables.subjectId) : old)
      );

      onSuccess?.(data, variables, _context, _mutation);
    },
  });
}