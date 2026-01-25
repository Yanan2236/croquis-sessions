import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useQueryClient } from "@tanstack/react-query"

import { startSession } from "@/features/sessions/api"
import { fetchSubjectsOverview } from "@/features/subjects/api"
import { routes } from "@/lib/routes"
import type { StartSessionPayload, CroquisSession, IncompleteSessionResponse } from "@/features/sessions/types"
import styles from "./styles.module.css"
import { SubjectPickerPanel } from "@/routes/sessions/components/SessionStartForm/SubjectPickerPanel";
import { SessionStartPreviewPanel } from "@/routes/sessions/components/SessionStartForm/SessionStartPreviewPanel";

export const SessionStartForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [subjectValue, setSubjectValue] = useState("");
  const [intentionValue, setIntentionValue] = useState("");

  const hasIncompleteSession = queryClient.getQueryData<IncompleteSessionResponse | null>(["incomplete-session"])
  const canStart = !hasIncompleteSession

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjectsOverview,
  });

  const { mutate, isPending } = useMutation<
    CroquisSession,     // TData
    AxiosError,         // TError
    StartSessionPayload // TVariables
  >({
    mutationFn: startSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["incomplete-session"] }); // 未完成セッションキャッシュを更新
      navigate(routes.sessionRun(data.id), { replace: true });
    },
    onError: (error) => {
      console.error("status", error.response?.status);
      console.error("data", error.response?.data);
      console.error("headers", error.response?.headers);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: StartSessionPayload = {
      subject_name: subjectValue,
      intention: intentionValue,
    };

    mutate(payload);
  };

  if (isLoading) return <div>Loading ...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const subjects = data ?? [];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>新規セッション作成</h1>

      <div className={styles.layout}>
        <SubjectPickerPanel
          subjects={subjects}
          subjectValue={subjectValue}
          setSubjectValue={setSubjectValue}
          setIntentionValue={setIntentionValue}
        />

        <SessionStartPreviewPanel
          subjectValue={subjectValue}
          intentionValue={intentionValue}
          setIntentionValue={setIntentionValue}
          isPending={isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/sessions")}
          canStart={canStart}
        />
      </div>
    </div>
  );

};
