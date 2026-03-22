import { Link } from "react-router-dom";
import { useMeQuery } from "@/features/accounts/queries/useMeQuery";
import styles from "./styles.module.css";

export const BackToLineLoopLink = () => {
  const q = useMeQuery();

  const isAuthenticated = !!q.data;

  const to = isAuthenticated ? "/app/sessions/new" : "/";

  return (
    <Link to={to} className={styles.backLink}>
      ← LineLoopに戻る
    </Link>
  );
};