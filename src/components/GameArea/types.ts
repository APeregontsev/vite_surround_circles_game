export type TCircle = {
  index: number;
  x: number;
  y: number;
  radius: number;
  fillColor: string;
  isClicked: boolean;
  isSurrounded?: boolean;
  surroundedBy?: Omit<TCircle, "surroundedBy">[];
};

export type TCreateCircle = {
  gridSizeY: number;
  gridSizeX: number;
  circleDiameter: number;
  circleRadius: number;
  offsetX: number;
  offsetY: number;
};

export type TPath = { color: string; path: TCircle[] };

export type TRecursiveCheck = {
  circles: TCircle[];
  gridSizeX: number;
  activePlayerColor: string;
  index: number;
  checked: Set<number>;
  surroundedBy: Set<TCircle>;
  prevIndex?: number;
  depth?: number;
};

export type TRecursiveSurround = Omit<TRecursiveCheck, "activePlayerColor"> & {
  checkedTemp: Set<number>;
  failedCheck: Set<number>;
  checkingColor: string;
  surroundingColor: string;
};

export type TPreRecursiveCheck = {
  circles: TCircle[];
  gridSizeX: number;
  activePlayerColor: string;
  index: number;
};
export type TDrawPath = {
  surroundedBy: Set<TCircle>;
  checked: Set<number>;
  gridSizeX: number;
  circleDiameter: number;
};
export type TNotConnectedSurrounding = {
  surroundingArray: TCircle[];
  checkedArray: Set<number>;
  gridSizeX: number;
};

export type TGameData = {
  circles: TCircle[];
  allyColor: string;
  enemyColor: string;
  gridSizeX: number;
};
