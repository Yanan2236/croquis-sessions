import { api } from "@/lib/api";
import type { SubjectOverview } from "@/features/subjects/types";

export const fetchSubjectsOverview = async () => {
  const response = await api.get<SubjectOverview[]>('/api/croquis/subjects/overview/');
  return response.data;
}