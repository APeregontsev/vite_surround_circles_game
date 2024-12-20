import cn from "clsx";
import { PropsWithChildren } from "react";
import "./styles.scss";

type Props = { active?: boolean; red?: boolean };

export const PlayerStatCard = ({ active = false, red = false, children }: PropsWithChildren<Props>) => {
  const styles = cn("player-wrapper", { active: active }, red ? "red" : "blue");

  return <div className={styles}>{children}</div>;
};
