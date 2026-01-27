import { useMatch, useNavigate } from "react-router-dom";

import { useIncompleteSessionQuery } from "@/features/sessions/queries/useIncompleteSessionQuery";
import { Banner } from "@/components/layout/IncompleteSessionBanner/Banner";
import { useMeQuery } from "@/features/accounts/queries/useMeQuery";

export const IncompleteSessionBanner = () => {
  const { data: me } = useMeQuery();
  const { data: incompleteSession, isPending, isError } = useIncompleteSessionQuery(!!me);


  if (isPending) return null;
  if (isError) return null;
  
  return (
    incompleteSession ? (
      <Banner session={incompleteSession} />
    ) : null
  );
}