import { api } from "@/lib/api";
import type {
  Drawing,
} from "@/features/drawings/types";  

export const uploadDrawing = async (sessionId: number, file: File) => {
  const form = new FormData();
  form.append("image_file", file);

  const response = await api.post<Drawing>(`/api/croquis/sessions/${sessionId}/drawings/`, form);
  return response.data;
};