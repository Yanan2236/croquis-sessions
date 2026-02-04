import type { Drawing } from "@/features/drawings/types";

export type StartSessionPayload = {
  subject_name: string;
  intention?: string | null;
};

export type FinishSessionPayload = {
  reflection?: string | null;
  next_action?: string | null;
  note?: string | null;
  is_public?: boolean | null;
};

export type FinishSessionVariables = {
  sessionId: number;
  payload: FinishSessionPayload;
};

export type CroquisSession = {
  id: number;
  user: number;
  started_at: string;
  ended_at: string | null;
  finalized_at: string | null;
  subject: number;
  intention: string | null;
  next_action: string | null;
  phase: "running" | "ended_unfinalized" | "finalized";
};

// 完了したセッションの詳細情報
export type CroquisSessionDetails = {
  id: number;
  started_at: string;
  ended_at: string;
  finalized_at: string | null;
  intention: string | null;
  duration_seconds: number;
  next_action: string | null;
  drawings: Drawing[];
  subject: {
    id: number; 
    name: string;
  };
  user: number;
};

export type FinishAllVariables = {
  sessionId: number;
  payload: FinishSessionPayload;
  files: File[];
};

export type IncompleteSessionResponse = {
  id: number;
  state: "running" | "needs_finalize";
  subject_name: string;
  started_at: string;
  ended_at: string | null;
  finalized_at: string | null;
};

export type ListSessionsParams = {
  subject?: number;
  ordering?: "finalized_at" | "-finalized_at";
};

export type SessionsListResponse = {
  id: number;
  thumb_image: string | null;
  subject: {
    id: number;
    name: string;
  };
  subject_name: string;
  finalized_at: string;
  duration_seconds: number | null;
}

export type GroupBucket = {
  subjectId: number;
  subjectName: string;
  items: SessionsListResponse[];
  latestTime: number;
}

export type SubjectSessionsGroup = {
  subject: string;
  items: SessionsListResponse[];
  latest: SessionsListResponse;
};

export type SessionState = {
  id: number;
  phase: "running" | "ended_unfinalized" | "finalized";
}