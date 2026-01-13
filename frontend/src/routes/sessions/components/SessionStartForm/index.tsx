import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { startSession } from "@/features/sessions/api/sessions"
import type { StartSessionPayload } from "@/features/sessions/types"
import styles from "./styles.module.css"

export const SessionStartForm = () => {
  const navigate = useNavigate();

  const [subjectValue, setSubjectValue] = useState("");
  const [intentionValue, setIntentionValue] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: StartSessionPayload = {
      subject_name: subjectValue,
      intention: intentionValue,
    }
    try {
      const session = await startSession(payload);
      navigate(`/sessions/${session.id}`, { replace: true });
    } catch (error) {
      console.error("Failed to start session", error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="text" value={subjectValue} onChange={(e) => setSubjectValue(e.target.value)} />
      <input type="text" value={intentionValue} onChange={(e) => setIntentionValue(e.target.value)} />
      <button type="submit">Create Session</button>
    </form>
  )
}