import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";

import { renameSubject } from "@/features/subjects/api";
import type { SubjectOverview, SubjectOption } from "@/features/subjects/types";

type RenameSubjectPayload = {
  subjectId: number;
  newName: string;
}

export const useRenameSubjectMutation = (
  options?: UseMutationOptions<SubjectOverview, Error, RenameSubjectPayload, unknown>
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...rest } = options ?? {};

  return useMutation<SubjectOverview, Error, RenameSubjectPayload, unknown>({
    ...rest,

    mutationFn: (payload) => renameSubject(payload.subjectId, payload.newName),

    onSuccess: async (data, variables, _context, _mutation) => {
      const { subjectId } = variables;

      queryClient.setQueryData<SubjectOverview[]>(
        ["subjects", "overview"],
        (old) => (old ? old.map((s) => (s.id === subjectId ? { ...s, ...data } : s)) : old)
      );

      queryClient.setQueryData<SubjectOption[]>(
        ["subjects", "options"],
        (old) => (old ? old.map((s) => (s.id === subjectId ? { ...s, name: data.name } : s)) : old)
      );

      await onSuccess?.(data, variables, _context, _mutation);
    },
  });
};