import styles from "./styles.module.css";

type Requirement = "required" | "optional" | "confirmed";

type Props = {
  requirement: Requirement;
};

const LABEL_MAP: Record<Requirement, string> = {
  required: "必須",
  optional: "任意",
  confirmed: "確定",
};

export const RequirementBadge = ({ requirement }: Props) => {
  return (
    <span
      className={`${styles.badge} ${styles[requirement]}`}
      aria-label={LABEL_MAP[requirement]}
    >
      {LABEL_MAP[requirement]}
    </span>
  );
};
