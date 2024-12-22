import React from "react";
import { palette } from "src/constants/constants";
import { TGameType, useStore } from "src/store/store";
import {
  drawPath,
  getRandomMoveNextToClicked,
  isCanBeSurroundedRecursive,
  isCanBeSurroundedRecursive2,
  isSurroundedRecursive,
  takeAMove,
} from "./helpers";
import { TCircle, TPath } from "./types";

type Props = {
  circles: TCircle[];
  gridSizeX: number;
  setCircles: React.Dispatch<React.SetStateAction<TCircle[]>>;
  setPathToDraw: React.Dispatch<React.SetStateAction<TPath[]>>;
  circleDiameter: number;
};

export function useGame({ circles, gridSizeX, setCircles, circleDiameter, setPathToDraw }: Props) {
  const { isShowIndex, isPlayerA, setTurn, surrounded, setSurrounded, is_vs_pc } = useStore((state) => ({
    isShowIndex: state.isShowIndex,
    isReset: state.isReset,
    isPlayerA: state.isPlayerA,
    setTurn: state.setTurn,
    surrounded: state.surrounded,
    setSurrounded: state.setSurrounded,
    is_vs_pc: state.gameType === TGameType.P_vs_C,
  }));

  const activePlayerColor = isPlayerA ? palette.red : palette.blue;
  const secondaryPlayerColor = !isPlayerA ? palette.red : palette.blue;

  const [computersMove, setComputersMove] = React.useState<TCircle | null>(null);

  const makeATurn = React.useCallback(
    (index: number) => {
      if (circles[index].fillColor !== palette.grey || circles[index].isSurrounded) {
        return;
      }

      if (isPlayerA && is_vs_pc) setComputersMove(circles[index]);

      circles[index].fillColor = activePlayerColor;
      circles[index].isClicked = true;

      const startOfRange = circles.findIndex((x) => x.isClicked);
      const endOfRange = circles.findLastIndex((x) => x.isClicked);

      for (let i = startOfRange; i < endOfRange; i++) {
        const checked = new Set<number>();
        const surroundedBy = new Set<TCircle>();

        if (
          circles[i].fillColor === secondaryPlayerColor &&
          !circles[i].isSurrounded &&
          isSurroundedRecursive({
            circles,
            gridSizeX,
            activePlayerColor,
            index: i,
            checked,
            surroundedBy,
          })
        ) {
          circles[i].surroundedBy = Array.from(surroundedBy);
          surrounded.add(circles[i]);

          circles[i].isSurrounded = true;

          if (checked.size > 0) {
            for (const item of checked) {
              if (
                circles[item].fillColor === secondaryPlayerColor ||
                circles[item].fillColor === palette.grey
              ) {
                circles[item].surroundedBy = Array.from(surroundedBy);
                surrounded.add(circles[item]);
                circles[item].isSurrounded = true;
              }
            }
          }

          if (surroundedBy.size > 0) {
            const path = drawPath({ surroundedBy, checked, gridSizeX, circleDiameter });

            if (path.length) {
              setPathToDraw((state) => {
                // Lets remove paths that where surrounded by other paths
                const newState = state.filter((path) => !path.path.some((dot) => dot.isSurrounded));

                return [...newState, { color: activePlayerColor, path: path }];
              });
            }
          }
        }
      }

      setSurrounded(new Set(surrounded));
      setCircles([...circles]);
      setTurn();
    },
    [circles, isPlayerA, secondaryPlayerColor, gridSizeX]
  );

  // Computer turn --------------------------------------------------------------------------------------

  React.useEffect(() => {
    if (!isPlayerA || !is_vs_pc || (is_vs_pc && !isPlayerA)) return;

    console.log("activePlayerColor", activePlayerColor === "#1475da" ? "Blue" : "Red");
    console.log("secondaryPlayerColor", secondaryPlayerColor === "#1475da" ? "Blue" : "Red");

    const startOfRange = circles.findIndex((x) => x.isClicked);
    const endOfRange = circles.findLastIndex((x) => x.isClicked);

    const checked = new Set<number>();
    const failedCheck = new Set<number>();

    const possiblePcMooves: { checkedIndex: number; surroundedBy: TCircle[] }[] = [];

    if (startOfRange < 0) return;

    for (let i = startOfRange; i <= endOfRange; i++) {
      const surroundedBy = new Set<TCircle>();

      const checkedTemp = new Set<number>();

      if (
        circles[i].fillColor === palette.blue &&
        !circles[i].isSurrounded &&
        !checked.has(i) &&
        isCanBeSurroundedRecursive({
          circles,
          gridSizeX,
          activePlayerColor,
          index: i,
          checked,
          surroundedBy,
          checkedTemp,
          failedCheck,
        })
      ) {
        // Lets merge checked circles if they can be surrounded, otherwise ignore them
        if (checkedTemp.size) checkedTemp.forEach((item) => checked.add(item));

        possiblePcMooves.push({ checkedIndex: i, surroundedBy: [...surroundedBy] });
      }
    }

    //-------------------------------------------------------------------------------------

    const possibleUserMooves: { checkedIndex: number; surroundedBy: TCircle[] }[] = [];

    if (true) {
      const checked = new Set<number>();
      const failedCheck = new Set<number>();

      for (let i = startOfRange; i <= endOfRange; i++) {
        const surroundedBy = new Set<TCircle>();
        const checkedTemp = new Set<number>();

        if (
          circles[i].fillColor === palette.red &&
          !circles[i].isSurrounded &&
          !checked.has(i) &&
          isCanBeSurroundedRecursive2({
            circles,
            gridSizeX,
            activePlayerColor,
            index: i,
            checked,
            surroundedBy,
            checkedTemp,
            failedCheck,
          })
        ) {
          // Lets merge checked circles if they can be surrounded, otherwise ignore them
          if (checkedTemp.size) checkedTemp.forEach((item) => checked.add(item));

          possibleUserMooves.push({ checkedIndex: i, surroundedBy: [...surroundedBy] });
        }
      }
    }
    /*     console.log("user_turn.............................setTurn<<<<<<<<<<<<<<<<<<<<", possibleUserMooves);
    console.log("pc_turn.............................setTurn<<<<<<<<<<<<<<<<<<<<", possiblePcMooves); */

    //-------------------------------------------------------------------------------------

    const availablePcMooves = possiblePcMooves.filter((turn) => turn?.surroundedBy?.length);
    const availableUserMooves = possibleUserMooves.filter((turn) => turn?.surroundedBy?.length);

    const isPcMooves = possiblePcMooves.length && availablePcMooves.length;
    const isUserMooves = possibleUserMooves.length && availableUserMooves.length;

    // 1.
    if (!isPcMooves && !isUserMooves) return makeATurn(getRandomMoveNextToClicked(circles, gridSizeX));

    // 2.
    if (!isPcMooves && isUserMooves)
      return makeATurn(takeAMove(availableUserMooves) || getRandomMoveNextToClicked(circles, gridSizeX));

    // 3.
    if (isPcMooves && !isUserMooves)
      return makeATurn(takeAMove(availablePcMooves) || getRandomMoveNextToClicked(circles, gridSizeX));

    // 4.
    const priorityMooves = [1, 2];

    for (let index = 0; index < priorityMooves.length; index++) {
      const priority = priorityMooves[index];

      const priorityPcMooves = availablePcMooves.filter((turn) => turn?.surroundedBy?.length === priority);

      if (priorityPcMooves.length) {
        return makeATurn(priorityPcMooves[0].surroundedBy[0].index);
      }

      const priorityUserMooves = availableUserMooves.filter(
        (turn) => turn?.surroundedBy?.length === priority
      );

      if (priorityUserMooves.length) {
        return makeATurn(priorityUserMooves[0].surroundedBy[0].index);
      }
    }

    // 00.
    return makeATurn(takeAMove(availablePcMooves) || getRandomMoveNextToClicked(circles, gridSizeX));
  }, [isPlayerA]);

  return { computersMove, setComputersMove, makeATurn, isPlayerA, isShowIndex, is_vs_pc };
}
