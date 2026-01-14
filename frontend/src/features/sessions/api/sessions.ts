import { api } from "@/lib/api";
import type {
  CroquisSession,
  StartSessionPayload,
  FinishSessionVariables,
} from "@/features/sessions/types";


export const startSession = async (payload: StartSessionPayload) => {
  const response = await api.post<CroquisSession>('/api/croquis/sessions/', payload);
  return response.data;
};

export const finishSession = async ({ sessionId, payload }: FinishSessionVariables) => {
  const response = await api.patch<CroquisSession>(`/api/croquis/sessions/${sessionId}/`, payload);
  return response.data;
};

export const fetchSessionDetails = async (sessionId: number) => {
  const response = await api.get<CroquisSession>(`/api/croquis/sessions/${sessionId}/`);
  return response.data;
}