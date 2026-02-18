import { api } from "@/lib/api";

import type { Me } from "./types";
import { ensureCsrf } from "@/lib/api/csrf";

export const login = async (email: string, password: string) => {
  await ensureCsrf();
  const response = await api.post<Me>('/api/auth/login/', { email, password });
  return response.data;
}

export const logout = async () => {
  await ensureCsrf();
  const response = await api.post('/api/auth/logout/');
  return response.data;
}

export const fetchMe = async () => {
  const response = await api.get<Me>('/api/auth/user/');
  return response.data;
}

export const signup = async (username: string, email: string, password: string, password_confirm: string): Promise<void> => {
  await ensureCsrf();
  return await api.post('/api/auth/registration/', { username, email, password1: password, password2: password_confirm });
}