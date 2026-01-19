import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import type { AxiosError, AxiosResponse } from "axios";

import { SessionStartForm } from "@/routes/sessions/components/SessionStartForm"
import { fetchActiveSession } from "@/features/sessions/api";
import type { ActiveSessionResponse } from "@/features/sessions/types";
import styles from "./styles.module.css"



export const NewSessionPage = () => {
  const navigate = useNavigate();



  const { mutate, isError, error } = useMutation<
    AxiosResponse<ActiveSessionResponse>, // TData
    AxiosError,                          // TError
    void                                 // TVariables
  >({
    mutationFn: fetchActiveSession,
    onSuccess: (data) => {
      if (data.status === 204) {
        return;
      }
      navigate(`/sessions/${data.data.id}`, { replace: true });
    },
  onError: (err) => {
    if (!err.response) return;          // network
    if (err.response.status === 409) {  // conflict
      return;
    }
  }
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className={styles.root}>
      <SessionStartForm />
    </div>
  )
}