export type SubjectOverview = {
  id: number;
  name: string;
  total_duration_seconds: number;
  latest_session: {
    id: number;
    finalized_at: string;
    next_action: string | null;
  };
};

export type SubjectOption = {
  id: number;
  name: string;
};