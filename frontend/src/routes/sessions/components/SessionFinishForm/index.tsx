import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { finishSession } from "@/features/sessions/api/sessions";

import type { FinishSessionPayload } from "@/features/sessions/types";
import styles from "./styles.module.css";

type Props = {
  sessionId: number;
};

export const SessionFinishForm = ({ sessionId }: Props) => {
  const navigate = useNavigate();

  const [reflectionValue, setReflectionValue] = useState("");
  const [nextActionValue, setNextActionValue] = useState("");
  const [noteValue, setNoteValue] = useState("");

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationFn: finishSession,
    onSuccess: () => {
      navigate(`/sessions/${sessionId}/finished`, { replace: true });
    },
    onError: (error: AxiosError) => {
      console.error(error);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: FinishSessionPayload = {
      reflection: reflectionValue,
      next_action: nextActionValue,
      note: noteValue,
    };
    mutate({ sessionId, payload });
  };
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="text" value={reflectionValue} onChange={(e) => setReflectionValue(e.target.value)} />
      <input type="text" value={nextActionValue} onChange={(e) => setNextActionValue(e.target.value)} />
      <input type="text" value={noteValue} onChange={(e) => setNoteValue(e.target.value)} />
      <button type="submit" disabled={isPending}>{isPending ? "送信中" : "終了"}</button>
    </form>
  )
};