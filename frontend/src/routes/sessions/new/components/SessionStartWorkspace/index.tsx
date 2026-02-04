import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { useQueryClient } from "@tanstack/react-query"

import { fetchSubjectsOverview } from "@/features/subjects/api"
import type { StartSessionPayload, IncompleteSessionResponse } from "@/features/sessions/types"
import styles from "./styles.module.css"
import { SubjectPickerPanel } from "@/routes/sessions/new/components/SessionStartWorkspace/SubjectPickerPanel";
import { SessionStartPreviewPanel } from "@/routes/sessions/new/components/SessionStartWorkspace/SessionStartPreviewPanel";
import { useStartSessionMutation } from "@/features/sessions/mutations/useStartSessionMutation";

export const SessionStartForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const startSessionMutation = useStartSessionMutation();

  const [subjectValue, setSubjectValue] = useState("");
  const [intentionValue, setIntentionValue] = useState("");

  const hasIncompleteSession = queryClient.getQueryData<IncompleteSessionResponse | null>(["incomplete-session"])
  const canStart = !hasIncompleteSession

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjectsOverview,
  });
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: StartSessionPayload = {
      subject_name: subjectValue,
      intention: intentionValue,
    };

    startSessionMutation.mutate(
      payload,
      {
        onError: (error) => {
          console.error("セッション開始エラー:", error);
        }
      }
    );
  };

  if (isLoading) return <div>Loading ...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const subjects = data ?? [];

  return (
    <section className={styles.workspace}>
      <div className={styles.left}>
        <SubjectPickerPanel
          subjects={subjects}
          subjectValue={subjectValue}
          setSubjectValue={setSubjectValue}
          setIntentionValue={setIntentionValue}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.right}>
        <SessionStartPreviewPanel
          subjectValue={subjectValue}
          intentionValue={intentionValue}
          setIntentionValue={setIntentionValue}
          isPending={startSessionMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/", { replace: true })}
          canStart={canStart}
        />
      </div>
    </section>
  );
};
