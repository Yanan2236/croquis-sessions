export const routes = {
  sessions: () => "/app/sessions",
  sessionRun: (id: number | string) => `/app/sessions/run/${id}`,
  sessionRunFinish: (id: number | string) => `/app/sessions/run/${id}/finish`,
  sessionRunDone: (id: number | string) => `/app/sessions/run/${id}/done`,
  sessionView: (id: number | string) => `/app/sessions/view/${id}`,
};
