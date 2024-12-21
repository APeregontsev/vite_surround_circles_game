import React from "react";
import { palette } from "src/constants/constants";
import { TGameType, useStore } from "src/store/store";
import { drawPath, getRandomMove, isCanBeSurroundedRecursive, isSurroundedRecursive } from "./helpers";
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

    const startOfRange = circles.findIndex((x) => x.isClicked && x.fillColor === palette.blue);
    const endOfRange = circles.findLastIndex((x) => x.isClicked && x.fillColor === palette.blue);

    const checked = new Set<number>();
    const failedCheck = new Set<number>();

    const possibleTurns: { checkedIndex: number; surroundedBy: TCircle[]; value?: number }[] = [];

    if (startOfRange < 0) return;

    for (let i = startOfRange; i <= endOfRange; i++) {
      const surroundedBy = new Set<TCircle>();

      const checkedTemp = new Set<number>();

      console.log(`pc_turn_____________inside_for__${i}`);

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
        /*   console.log("pc_turn_____________checked", checked);
        console.log(`pc_turn_____________surroundedBy___${i}`, surroundedBy); */

        // Lets merge checked circles if they can be surrounded, otherwise ignore them
        if (checkedTemp.size) checkedTemp.forEach((item) => checked.add(item));

        possibleTurns.push({ checkedIndex: i, surroundedBy: [...surroundedBy] });
      }
    }

    console.log("pc_turn.............................setTurn<<<<<<<<<<<<<<<<<<<<", possibleTurns);

    if (!possibleTurns.length) return makeATurn(getRandomMove(circles));

    if (!possibleTurns.filter((turn) => turn?.surroundedBy?.length).length) {
      return makeATurn(getRandomMove(circles));
    }

    makeATurn(
      possibleTurns
        .filter((turn) => turn?.surroundedBy?.length)
        .reduce((acc, possibleTurn) => {
          if (!possibleTurn) return acc;
          if (!possibleTurn.surroundedBy.length) return acc;

          if (possibleTurn?.surroundedBy?.length < acc?.surroundedBy?.length) return possibleTurn;

          return acc;
        }).surroundedBy[0].index ?? getRandomMove(circles)
    );
  }, [isPlayerA]);

  /*   console.log(".....................................surrounded ", surrounded); */

  return { computersMove, setComputersMove, makeATurn, isPlayerA, isShowIndex, is_vs_pc };
}
