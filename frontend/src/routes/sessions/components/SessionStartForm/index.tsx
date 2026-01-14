import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { startSession } from "@/features/sessions/api/sessions"
import type { StartSessionPayload, CroquisSession } from "@/features/sessions/types"
import styles from "./styles.module.css"

export const SessionStartForm = () => {
  const navigate = useNavigate();

  const [subjectValue, setSubjectValue] = useState("");
  const [intentionValue, setIntentionValue] = useState("");

  const {
    mutate,
    isPending,
  } = useMutation<
    CroquisSession, // TData
    AxiosError, // TError
    StartSessionPayload // TVariables
  >({
    mutationFn: startSession,
    onSuccess: (data) => {
      navigate(`/sessions/${data.id}`, { replace: true });
    },
    onError: (error) => {
      console.error("status", error.response?.status);
      console.error("data", error.response?.data);
      console.error("headers", error.response?.headers);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: StartSessionPayload = {
      subject_name: subjectValue,
      intention: intentionValue,
    }

    mutate(payload);
  };


  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="text" value={subjectValue} onChange={(e) => setSubjectValue(e.target.value)} />
      <input type="text" value={intentionValue} onChange={(e) => setIntentionValue(e.target.value)} />
      <button type="submit" disabled={isPending}>{isPending ? "送信中" : "開始"}</button>
    </form>
  )
}