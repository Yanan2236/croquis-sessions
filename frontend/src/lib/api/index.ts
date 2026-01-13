import { api } from "./client";
import { attachCsrfToken } from "./csrf";
import { attachResponseInterceptors } from "./interceptors";

let initialized = false;

const init = () => {
  if (initialized) return;
  initialized = true;

  attachCsrfToken();
  attachResponseInterceptors();
};

init();

export { api };