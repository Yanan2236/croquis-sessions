import { api } from "@/lib/api";
import type {
  CroquisSession,
  StartSessionPayload,
  FinishSessionPayload,
} from "../types";


export const startSession = async (payload: StartSessionPayload) => {
  const response = await api.post<CroquisSession>('/api/croquis/sessions/', payload);
  return response.data;
};

export const finishSession = (payload: FinishSessionPayload, sessionId: number, endedAt: string) => {
  return api.patch<CroquisSession>(`/api/croquis/sessions/${sessionId}/`, { ...payload, ended_at: endedAt });
};

export const fetchSessionDetails = async (sessionId: number) => {
  const response = await api.get<CroquisSession>(`/api/croquis/sessions/${sessionId}/`);
  return response.data;
}