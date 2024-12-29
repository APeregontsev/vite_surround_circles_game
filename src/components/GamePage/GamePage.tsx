import { PropsWithChildren } from "react";
import { palette } from "src/constants/constants";
import { TGameType, useSettings, useStore } from "src/store/store";
import { InGameMenu, PlayerStatCard, Timer } from "..";
import { GameArea } from "../GameArea/GameArea";
import { PlayerStat } from "../PlayerStat/PlayerStat";
import { calcScore } from "./helpers";
import "./styles.scss";

type Props = {};
const COMPUTER_TITLE = "AI__v__1.1.2";

export const GamePage = ({}: PropsWithChildren<Props>) => {
  const { playerA, playerB } = useSettings((state) => ({
    playerA: state.playerA,
    playerB: state.playerB,
  }));

  const { scoreA, scoreB, isPlayerA, is_vs_pc } = useStore((state) => ({
    scoreA: calcScore(state.surrounded, palette.red),
    scoreB: calcScore(state.surrounded, palette.blue),
    isPlayerA: state.isPlayerA,
    is_vs_pc: state.gameType === TGameType.P_vs_C,
  }));

  return (
    <div className="gamepage-wrapper">
      <div className="players-wrapper">
        <div className="score-wrapper">
          <PlayerStatCard active={!isPlayerA}>
            <Timer />
            <PlayerStat name={playerA || "Incognito"} score={scoreA} />
          </PlayerStatCard>

          <PlayerStatCard active={isPlayerA} red={true}>
            <InGameMenu />
            <PlayerStat name={!is_vs_pc ? playerB : COMPUTER_TITLE} score={scoreB} />
          </PlayerStatCard>
        </div>
      </div>

      <GameArea />
    </div>
  );
};
