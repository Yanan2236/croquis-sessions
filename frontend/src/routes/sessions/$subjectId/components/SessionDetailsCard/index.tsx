import { useState } from "react";

import { FrontFace } from "../FrontFace";
import { BackFace } from "../BackFace";
import styles from "./styles.module.css";

type Face = "front" | "back";

type Props = {
  session: {
    id: number | string;
    thumb_image?: string | null;
    finalized_at: string;
    duration_seconds?: number | null;
  };
};

export const SessionDetailsCard = ({ session }: Props) => {
  const [face, setFace] = useState<Face>("front");

  return (
    <article className={styles.card} role="listitem">
      {face === "front" ? (
        <FrontFace setFace={setFace} session={session} />
      ) : (
        <BackFace setFace={setFace} sessionId={session.id} />
      )}
    </article>
  );
};

