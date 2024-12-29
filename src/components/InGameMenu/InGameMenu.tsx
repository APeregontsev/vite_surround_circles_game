import { CirclePause, Flag, RotateCcw } from "lucide-react";
import React, { PropsWithChildren } from "react";
import { palette } from "src/constants/constants";
import { RouteTypes, useSettings, useStore } from "src/store/store";
import { Button } from "src/ui";
import { ConfirmCard, Modal } from "..";
import "./styles.scss";

type Props = {};

export const InGameMenu = ({}: PropsWithChildren<Props>) => {
  const navigate = useSettings((state) => state.navigate);

  const { setTimerPause, isTimerPaused, isTimerActive } = useSettings((state) => ({
    toggleTimer: state.toggleTimer,
    setTimerPause: state.setTimerPause,
    isTimerPaused: state.isPaused,
    isTimerActive: state.isTimerActive,
  }));

  const reset = useStore((state) => state.resetGame);

  const [gameState, setGameState] = React.useState<"pause" | "reset" | "finish" | null>(null);

  function openModal(gameState: "pause" | "reset" | "finish") {
    setGameState(gameState);

    if (isTimerActive) setTimerPause(true);
  }

  function toggleModal() {
    setGameState(null);

    if (isTimerActive && isTimerPaused) setTimerPause(false);
  }

  function handleReset() {
    reset();
    setGameState(null);
  }

  function handleFinish() {
    navigate(RouteTypes.M_MENU);
    reset();
  }

  return (
    <div className="menu-item">
      <Button icon title="Reset game" onClick={() => openModal("reset")}>
        <RotateCcw color={palette.blue} />
      </Button>
      <Button icon title="Pause game" onClick={() => openModal("pause")}>
        <CirclePause color={palette.blue} />
      </Button>

      <Button icon title="Finish game" onClick={() => openModal("finish")}>
        <Flag color={palette.red} />
      </Button>

      {gameState && (
        <Modal toggleModal={toggleModal}>
          {gameState === "pause" && (
            <ConfirmCard
              title="Paused"
              subTitle="Game is paused."
              onCancel={handleReset}
              onConfirm={toggleModal}
              onCancelText="Reset"
              onConfirmText="Resume"
              cancelRed
            />
          )}

          {gameState === "reset" && (
            <ConfirmCard
              title="Reset game"
              subTitle="Are you sure you want to reset the game?"
              onCancel={toggleModal}
              onConfirm={handleReset}
              onCancelText="Cancel"
              onConfirmText="Reset"
              confirmRed
            />
          )}

          {gameState === "finish" && (
            <ConfirmCard
              title="Finish game"
              subTitle="Are you sure you want to finish the game?"
              onCancel={toggleModal}
              onConfirm={handleFinish}
              onCancelText="Cancel"
              onConfirmText="Finish"
              confirmRed
            />
          )}
        </Modal>
      )}
    </div>
  );
};
