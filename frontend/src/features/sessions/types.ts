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

export type CroquisSessionDetails = {
  id: number;
  started_at: string;
  ended_at: string | null;
  intention: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  duration_seconds: number | null;
  reflection: string | null;
  next_action: string | null;
  note: string | null;
  drawings: number[];
  subject: {
    id: number; 
    name: string;
  };
  user: number;
};

export type FileWithPreview = {
  file: File;
  previewUrl: string;
};

export type Drawing = {
  id: number;
  order:number;
  image_url: string;
  session: number;
  created_at: string;
  updated_at: string;
};

export type FinishAllVariables = {
  sessionId: number;
  payload: FinishSessionPayload;
  files: File[];
};

