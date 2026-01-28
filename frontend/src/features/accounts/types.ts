export type Me = {
  id: number;
  username: string;
  email: string;
};

export type NormalizedError = {
  status: number | null;
  message: string;
  fieldErrors?: Record<string, string>;
  kind: "validation" | "conflict" | "auth" | "network" | "server" | "unknown";
}