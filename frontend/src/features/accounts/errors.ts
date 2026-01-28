export type SignupErrorKind =
  | "network"        // response なし
  | "bad_request"    // 400
  | "unauthorized"   // 401/403
  | "conflict"       // 409
  | "rate_limited"   // 429
  | "server"         // 5xx
  | "unknown";       // その他

export type SignupErrorInfo = {
  kind: SignupErrorKind;
  status: number | null;
  data?: unknown;
};

const isAxiosErrorLike = (e: unknown): e is { response?: { status?: number; data?: unknown } } =>
  !!e && typeof e === "object";

export const classifySignupError = (error: unknown): SignupErrorInfo => {
  if (!isAxiosErrorLike(error)) {
    return { kind: "unknown", status: null };
  }

  const status = error.response?.status ?? null;

  if (status === null) {
    return { kind: "network", status: null };
  }

  if (status === 400) {
    return { kind: "bad_request", status, data: error.response?.data };
  }
  if (status === 401 || status === 403) {
    return { kind: "unauthorized", status };
  }
  if (status === 409) {
    return { kind: "conflict", status };
  }
  if (status === 429) {
    return { kind: "rate_limited", status };
  }
  if (status >= 500) {
    return { kind: "server", status };
  }

  return { kind: "unknown", status };
};


const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

const toStringArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") return [v];
  return [];
};

export const extractValidationMessages = (data: unknown): string[] => {
  if (!isRecord(data)) return [];

  return Object.values(data).flatMap(toStringArray);
};
