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
  started_at: string;
  ended_at: string | null;
  subject: number;
  intention: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

// 完了したセッションの詳細情報
export type CroquisSessionDetails = {
  id: number;
  started_at: string;
  ended_at: string;
  intention: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  duration_seconds: number;
  reflection: string | null;
  next_action: string | null;
  note: string | null;
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

export type ActiveSessionResponse = {
  id: number;
  started_at: string;
  ended_at: string | null;
  subject: {
    id: number;
    name: string;
  };
  intention: string | null;
};

export type ListSessionsParams = {
  subject?: number;
  ordering?: "finalized_at" | "-finalized_at";
};