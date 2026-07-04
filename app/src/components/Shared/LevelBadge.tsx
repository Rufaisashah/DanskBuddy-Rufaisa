export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface Props {
  level: Level;
}

const BASE =
  "inline-flex items-center justify-center px-[10px] py-[5px] rounded-sm text-xs font-extrabold";

const VARIANT: Record<Level, string> = {
  A1: "bg-secondary-light text-secondary-dark",
  A2: "bg-secondary-light text-secondary-dark",
  B1: "bg-primary-light text-primary",
  B2: "bg-primary-light text-primary",
  C1: "bg-primary-pale text-primary-dark",
  C2: "bg-primary-pale text-primary-dark",
};

export default function LevelBadge({ level }: Props) {
  return <span className={`${BASE} ${VARIANT[level]}`}>{level}</span>;
}
