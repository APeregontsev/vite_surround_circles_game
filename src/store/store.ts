import { TCircle } from "src/components/GameArea/types";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

export enum RouteTypes {
  M_MENU = "Main menu",
  P_MENU = "Player menu",
  STAT = "Statistics page",
  GAME = "Game page",
}

export enum TGameType {
  P_vs_P = "PvsP",
  P_vs_C = "PvsC",
}

export type TSettings = {
  address: RouteTypes;
  playerA: string;
  playerB: string;
  isPaused: boolean;

  isTimerActive: boolean;

  navigate: (address: RouteTypes) => void;

  setPlayerA: (name: string) => void;
  setPlayerB: (name: string) => void;

  toggleTimer: () => void;
};

export type TGame = {
  isPlayerA: boolean;
  isReset: boolean;
  isShowIndex: boolean;

  scoreA: Set<{}>;
  scoreB: Set<{}>;

  gameType: TGameType;
  setGameType: (newGameType: TGameType) => void;

  surrounded: Set<TCircle>;
  setSurrounded: (newSet: Set<TCircle>) => void;

  toggleShowIndex: () => void;
  setTurn: () => void;
  resetGame: () => void;
};

export const useSettings = createWithEqualityFn<TSettings>(
  (set, get) => ({
    address: RouteTypes.M_MENU,
    playerA: "",
    playerB: "",
    isPaused: false,
    isTimerActive: true,

    navigate: (address) => set({ address: address }),

    setPlayerA: (name) => set({ playerA: name }),
    setPlayerB: (name) => set({ playerB: name }),

    toggleTimer: () => set({ isTimerActive: !get().isTimerActive }),
  }),
  shallow
);

export const useStore = createWithEqualityFn<TGame>(
  (set, get) => ({
    isPlayerA: false,
    isReset: false,
    isShowIndex: false,

    gameType: TGameType.P_vs_P,

    scoreA: new Set(),
    scoreB: new Set(),

    surrounded: new Set(),

    toggleShowIndex: () => set({ isShowIndex: !get().isShowIndex }),

    setTurn: () => set({ isPlayerA: !get().isPlayerA }),

    setSurrounded: (newSet) => set({ surrounded: newSet }),

    resetGame: () => set({ isPlayerA: false, scoreA: new Set(), scoreB: new Set(), isReset: !get().isReset }),

    setGameType: (newGameType: TGameType) => set({ gameType: newGameType }),
  }),
  shallow
);
