import type { InternalAxiosRequestConfig } from "axios";
import { api } from "./client";

export const getCookie = (name: string) => {
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[2]) : null;
};

export const attachCsrfToken = () => {
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      config.headers.set("X-CSRFToken", csrfToken);
    }
    return config;
  });
};


