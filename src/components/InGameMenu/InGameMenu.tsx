import { CirclePause, Flag, RotateCcw } from "lucide-react";
import React, { PropsWithChildren } from "react";
import { palette } from "src/constants/constants";
import { RouteTypes, useSettings, useStore } from "src/store/store";
import { Button } from "src/ui";
import { Modal } from "..";
import "./styles.scss";

type Props = {};

export const InGameMenu = ({}: PropsWithChildren<Props>) => {
  const navigate = useSettings((state) => state.navigate);

  const { toggleTimer } = useSettings((state) => ({
    toggleTimer: state.toggleTimer,
  }));

  const reset = useStore((state) => state.resetGame);

  const [isPaused, setIsPaused] = React.useState<boolean>(false);

  function navigateMainMenu() {
    navigate(RouteTypes.M_MENU);
  }

  function handleReset() {
    reset();
  }

  function togglePause() {
    setIsPaused((state) => !state);
    toggleTimer();
  }

  function toggleReset() {
    reset();
    setIsPaused((state) => !state);
    toggleTimer();
  }

  return (
    <div className="menu-item">
      <Button icon title="Reset game" onClick={handleReset}>
        <RotateCcw color={palette.blue} />
      </Button>
      <Button icon title="Pause game" onClick={togglePause}>
        <CirclePause color={palette.blue} />
      </Button>

      <Button icon title="Finish game" onClick={navigateMainMenu}>
        <Flag color={palette.red} />
      </Button>

      {isPaused && (
        <Modal toggleModal={togglePause}>
          <div className="pause-wrapper">
            <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Paused</h1>
            <div className="btn-wrapper">
              <Button outlined fullwidth onClick={toggleReset} type="reset">
                Reset
              </Button>

              <Button fullwidth type="submit" onClick={togglePause}>
                Resume
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
