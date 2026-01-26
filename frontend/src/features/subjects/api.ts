import { api } from "@/lib/api";
import type { SubjectOverview } from "@/features/subjects/types";

export const fetchSubjectsOverview = async () => {
  const response = await api.get<SubjectOverview[]>('/api/croquis/subjects/overview/');
  return response.data;
}

export const createSubject = async (name: string) => {
  const response = await api.post<SubjectOverview>('/api/croquis/subjects/', { name });
  return response.data;
}

export const renameSubject = async (subjectId: number, newName: string) => {
  const response = await api.patch<SubjectOverview>(`/api/croquis/subjects/${subjectId}/`, { name: newName });
  return response.data;
}