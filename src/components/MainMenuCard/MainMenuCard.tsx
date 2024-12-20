import React, { PropsWithChildren } from "react";
import { RouteTypes, TGameType, useSettings, useStore } from "src/store/store";
import { Button } from "src/ui";
import { MenuCard, Modal } from "..";
import "./styles.scss";

type Props = {};

export const MainMenuCard = ({}: PropsWithChildren<Props>) => {
  const navigate = useSettings((state) => state.navigate);

  const { setGameType } = useStore((state) => ({
    setGameType: state.setGameType,
  }));

  const [showStat, setShowStat] = React.useState<boolean>(false);
  const [showRules, setShowRules] = React.useState<boolean>(false);

  const currentYear = new Date().getFullYear();

  function navigatePlayerCard(type: TGameType) {
    navigate(RouteTypes.P_MENU);
    setGameType(type);
  }

  function toggleStat() {
    setShowStat((state) => !state);
  }

  function toggleRules() {
    setShowRules((state) => !state);
  }

  return (
    <MenuCard>
      <div className="main-wrapper">
        <div className="menu-btn-wrapper">
          <Button fullwidth purple onClick={() => navigatePlayerCard(TGameType.P_vs_C)}>
            Play vs Computer
          </Button>

          <Button fullwidth onClick={() => navigatePlayerCard(TGameType.P_vs_P)}>
            Play vs Player
          </Button>

          <Button fullwidth outlined onClick={toggleStat}>
            Statistics
          </Button>

          <Button outlined fullwidth onClick={toggleRules}>
            Rules
          </Button>
        </div>
        <div className="copyright">© {currentYear}, APeregontsev</div>
      </div>
      {showStat && <Modal toggleModal={toggleStat}>STATT !!!!!!!!!!!!</Modal>}
      {showRules && <Modal toggleModal={toggleRules}>RULES !!!!!!!!!!!!</Modal>}
    </MenuCard>
  );
};
