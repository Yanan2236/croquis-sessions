import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import type { CroquisSession } from "@/features/sessions/types";
import { fetchSessionDetails } from "@/features/sessions/api/sessions";

type LoadState = "idle" | "loading" | "success" | "notfound" | "error";

export const SessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const sessionIdNum = useMemo(() => {
    if (!sessionId) return null;
    const n = Number(sessionId);
    return Number.isNaN(n) ? null : n;
  }, [sessionId]);

  const [session, setSession] = useState<CroquisSession | null>(null);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (sessionIdNum === null) return;

    let alive = true;

    const load = async () => {
      setState("loading");
      setMessage(null);

      try {
        const data = await fetchSessionDetails(sessionIdNum);
        if (!alive) return;

        setSession(data);
        setState("success");
      } catch (err) {
        if (!alive) return;

        if (axios.isAxiosError(err)) {
          const status = err.response?.status;

          if (status === 404) {
            setSession(null);
            setState("notfound");
            return;
          }

          setState("error");
          setMessage(`Request failed (${status ?? "no status"})`);
          console.log("status:", status);
          console.log("data:", err.response?.data);
          return;
        }

        setState("error");
        setMessage("Unknown error");
        console.log("unknown error:", err);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [sessionIdNum]);

  if (!sessionId) return <div>Session ID is missing</div>;
  if (sessionIdNum === null) return <div>Session ID is invalid</div>;

  if (state === "loading") return <div>Loading...</div>;
  if (state === "notfound") return <div>Session not found</div>;
  if (state === "error") return <div>{message ?? "Error"}</div>;

  if (!session) return <div>Session not found</div>;

  return <div>Session Detail Page</div>;
};
