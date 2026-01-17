import { useEffect, useState } from "react";

import { fetchSubjectsOverview  } from "@/features/subjects/api";
import type { SubjectOverview } from "@/features/subjects/types";

export const HomePage = () => {
  const [subjects, setSubjects] = useState<Array<SubjectOverview>>([])

  useEffect(() => {
    const loadSubjects = async () => {
      const data = await fetchSubjectsOverview();
      setSubjects(data);
    }
    loadSubjects();
  }, []);

  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}