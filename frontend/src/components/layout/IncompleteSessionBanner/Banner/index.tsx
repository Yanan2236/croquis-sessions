import { useNavigate } from "react-router-dom";

import { routes } from "@/lib/routes";
import type { IncompleteSessionResponse } from "@/features/sessions/types";
import styles from "./styles.module.css";

type Props = {
  session: IncompleteSessionResponse;
};

export const Banner = ({ session }: Props) => {
  const navigate = useNavigate();

  const goRun = () => navigate(routes.sessionRun(session.id));
  const goFinish = () => navigate(routes.sessionRunFinish(session.id));

  const views = {
    running: {
      title: "進行中のセッションがあります",
      primaryLabel: "再開する",
      primaryOnClick: goRun,
    },
    needs_finalize: {
      title: "未確定のセッションがあります",
      primaryLabel: "確定する",
      primaryOnClick: goFinish,
    },
  } satisfies Record<
    IncompleteSessionResponse["state"],
    {
      title: string;
      primaryLabel: string;
      primaryOnClick: () => void;
    }
  >;

  const v = views[session.state];

  return (
    <div className={styles.root} role="status" aria-live="polite">
      <div className={styles.left}>
        <div className={styles.title}>{v.title}</div>
        <div className={styles.meta}>{session.subject_name}</div>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.primaryBtn} onClick={v.primaryOnClick}>
          {v.primaryLabel}
        </button>
      </div>
    </div>
  );
};
