import { PropsWithChildren } from "react";
import "./styles.scss";

type Props = { name: string; score: number };

export const PlayerStat = ({ name, score = 0 }: PropsWithChildren<Props>) => {
  return (
    <div className="playername-wrapper" title="Player's score">
      <div className="player-name">{name}</div>
      <div className="player-score">{score}</div>
    </div>
  );
};
