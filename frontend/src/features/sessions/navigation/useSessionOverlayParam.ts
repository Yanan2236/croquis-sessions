import { useSearchParams } from "react-router-dom";

export const useSessionOverlayParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const viewSessionId = searchParams.get("view");

  const open = (sessionId: number | string) => {
    const next = new URLSearchParams(searchParams);
    next.set("view", String(sessionId));
    setSearchParams(next, { replace: false });
  };

  const close = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("view");
    setSearchParams(next, { replace: false });
  };

  return {
    viewSessionId: viewSessionId ? Number(viewSessionId) : null,
    open,
    close,
  };
};
