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
