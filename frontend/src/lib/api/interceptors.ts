import { api } from "./client";

export const attachResponseInterceptors = () => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log("401: not authenticated");
      }
      return Promise.reject(error);
    }
  );
};
