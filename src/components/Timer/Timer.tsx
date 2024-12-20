import { Timer as TimerIcon } from "lucide-react";
import React from "react";
import { palette } from "src/constants/constants";
import { useSettings, useStore } from "src/store/store";
import { Button } from "src/ui";
import "./styles.scss";
import { useTimer } from "./useTimer";

type Props = {};

export const Timer = ({}: Props) => {
  const { isShowIndex, isReset, toggleShowIndex } = useStore((state) => ({
    toggleShowIndex: state.toggleShowIndex,
    isShowIndex: state.isShowIndex,
    isReset: state.isReset,
  }));

  const { toggleTimer, isTimerActive } = useSettings((state) => ({
    toggleTimer: state.toggleTimer,
    isTimerActive: state.isTimerActive,
  }));

  const { timer, resetTimer } = useTimer(isTimerActive);

  function handleShowIndexes() {
    toggleShowIndex();
  }

  function handleToggleTimer() {
    toggleTimer();
    resetTimer();
  }

  React.useEffect(() => {
    resetTimer();
  }, [isReset]);

  return (
    <div className="menu-item">
      <Button title="Show indexes" onClick={handleShowIndexes} info active={isShowIndex}>
        i
      </Button>
      <Button icon title="Toggle stopwatch" onClick={handleToggleTimer}>
        <TimerIcon color={!isTimerActive ? palette.blue : palette.red} />
      </Button>
      {timer}
    </div>
  );
};
