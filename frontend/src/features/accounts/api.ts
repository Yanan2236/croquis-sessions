import { api } from "@/lib/api";

import type { User } from "./types";

export const login = async (email: string, password: string) => {
  const response = await api.post<User>('/api/accounts/login/', { email, password });
  return response.data;
}

export const logout = async () => {
  const response = await api.post('/api/accounts/logout/');
  return response.data;
}

export const featchMe = async () => {
  const response = await api.get<User>('/api/accounts/me/');
  return response.data;
}