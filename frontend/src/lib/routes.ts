export const routes = {
  sessions: () => "/sessions",
  sessionRun: (id: number | string) => `/sessions/run/${id}`,
  sessionRunFinish: (id: number | string) => `/sessions/run/${id}/finish`,
  sessionRunDone: (id: number | string) => `/sessions/run/${id}/done`,
  sessionView: (id: number | string) => `/sessions/view/${id}`,
};
