import { api } from "@/lib/api";

import type { Me } from "./types";

export const login = async (email: string, password: string) => {
  const response = await api.post<Me>('/api/accounts/login/', { email, password });
  return response.data;
}

export const logout = async () => {
  const response = await api.post('/api/accounts/logout/');
  return response.data;
}

export const fetchMe = async () => {
  const response = await api.get<Me>('/api/accounts/me/');
  return response.data;
}

export const signup = async (username: string, email: string, password: string, password_confirm: string): Promise<void> => {
  return await api.post('/api/accounts/signup/', { username, email, password, password_confirm });
}