import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";

import { renameSubject } from "@/features/subjects/api";
import type { SubjectOverview } from "@/features/subjects/types";
import { useMeQuery } from "@/features/accounts/queries/useMeQuery";

type RenameSubjectPayload = {
  subjectId: number;
  newName: string;
}

export const useRenameSubjectMutation = (
  options?: UseMutationOptions<SubjectOverview, Error, RenameSubjectPayload, unknown>
) => {
  const queryClient = useQueryClient();
  const me = useMeQuery().data

  const { onSuccess, ...rest } = options ?? {};

  return useMutation<SubjectOverview, Error, RenameSubjectPayload, unknown>({
    ...rest,
    mutationFn: (payload) => renameSubject(payload.subjectId, payload.newName),

    onSuccess: async (data, variables, context, mutation) => {
      let didPatch = false;

      queryClient.setQueryData<SubjectOverview[]>(
        ["subjects", "overview", me?.id],
        (old) => {
          if (!old) return old;

          return old.map((s) => {
            if (s.id !== data.id) return s;
            didPatch = true;
            return { ...s, ...data };
          });
        }
      );

      if (!didPatch) {
        await queryClient.invalidateQueries({ queryKey: ["subjects", "overview", me?.id] });
      }

      await onSuccess?.(data, variables, context, mutation);
    },
  });
};