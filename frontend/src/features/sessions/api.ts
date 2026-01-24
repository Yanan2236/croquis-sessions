import { api } from "@/lib/api";
import type {
  CroquisSession,
  CroquisSessionDetails,
  StartSessionPayload,
  FinishSessionVariables,
  FinishAllVariables,
  IncompleteSessionResponse,
  ListSessionsParams,
} from "@/features/sessions/types";
import type { Drawing } from "@/features/drawings/types";


export const startSession = async (payload: StartSessionPayload) => {
  const response = await api.post<CroquisSession>('/api/croquis/sessions/', payload);
  return response.data;
};

export const finishSession = async ({ sessionId, payload }: FinishSessionVariables) => {
  const response = await api.patch<CroquisSession>(`/api/croquis/sessions/${sessionId}/`, payload);
  return response.data;
};

export const fetchSessionDetails = async (sessionId: number) => {
  const response = await api.get<CroquisSessionDetails>(`/api/croquis/sessions/${sessionId}/`);
  return response.data;
}

export const uploadDrawing = async (sessionId: number, file: File) => {
  const form = new FormData();
  form.append("image_file", file);

  const response = await api.post<Drawing>(`/api/croquis/sessions/${sessionId}/drawings/`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export const finishAll = async ({ sessionId, payload, files }: FinishAllVariables) => {
  await finishSession({ sessionId, payload });

  if (files.length === 0) return;
  await Promise.all(files.map((file) => uploadDrawing(sessionId, file)));
}

export const fetchIncompleteSession = async () => {
  const response = await api.get<IncompleteSessionResponse>('/api/croquis/sessions/incomplete/');
  if (response.status === 204) return null; // nullに正規化
  return response.data; // 200の場合はデータを返す
}

export const endSession = async (sessionId: number) => {
  const response = await api.patch<CroquisSession>(`/api/croquis/sessions/${sessionId}/end/`);
  return response.data;
}

export const listSessions = async (params?: ListSessionsParams) => {
  const response = await api.get<CroquisSessionDetails[]>('/api/croquis/sessions/', { params });
  return response.data;
}