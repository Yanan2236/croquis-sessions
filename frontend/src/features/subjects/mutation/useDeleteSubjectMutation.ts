import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';

import { deleteSubject } from '@/features/subjects/api';
import type { SubjectOverview } from '../types';

export const useDeleteSubjectMutation = (
  options?: UseMutationOptions<{ delete_type: string }, Error, { subjectId: number }, unknown>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...rest } = options ?? {};

  return useMutation<{ delete_type: string }, Error, { subjectId: number }, unknown>({
    ...rest,
    mutationFn: ({ subjectId }) => deleteSubject(subjectId),

    onSuccess: (data, variables, _context, _mutation) => {
      queryClient.setQueryData<SubjectOverview[]>(
        ["subjects", "overview"],
        (old) => (old ? old.filter((s) => s.id !== variables.subjectId) : old)
      );

      onSuccess?.(data, variables, _context, _mutation);
    },
  });
}