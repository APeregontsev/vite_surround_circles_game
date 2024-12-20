import { GamePage, MainMenuCard, PlayersCard } from "src/components";
import { RouteTypes } from "src/store/store";

export const currentRoute = {
  [RouteTypes.M_MENU]: <MainMenuCard />,
  [RouteTypes.P_MENU]: <PlayersCard />,
  [RouteTypes.GAME]: <GamePage />,
  [RouteTypes.STAT]: <GamePage />,
};
