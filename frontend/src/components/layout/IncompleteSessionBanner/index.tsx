import { useMatch, useNavigate } from "react-router-dom";

import { useIncompleteSessionQuery } from "@/features/sessions/queries/useIncompleteSessionQuery";
import { Banner } from "@/components/layout/IncompleteSessionBanner/Banner";

export const IncompleteSessionBanner = () => {
  const { data: incompleteSession, isPending, isError } = useIncompleteSessionQuery();

  if (isPending) return null;
  if (isError) return null;
  
  return (
    incompleteSession ? (
      <Banner session={incompleteSession} />
    ) : null
  );
}