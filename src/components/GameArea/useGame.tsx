import React from "react";
import { palette } from "src/constants/constants";
import { TGameType, useStore } from "src/store/store";
import {
  drawPath,
  getRandomMoveNextToClicked,
  getSafeIndexForMove,
  isCanBeSurroundedRecursive,
  isMoveToBreakBruteforce,
  isSurroundedRecursive,
  takeAMoveOnShortestPath,
} from "./helpers";
import { TBroodforce, TCircle, TPath } from "./types";

export const MOVES_IN_A_ROW = 2; // for detecting bruteforcing from a user side

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

  const [isBruteforcing, setIsBruteforcing] = React.useState<TBroodforce>({
    prevUserMove: null,
  });

  const makeATurn = React.useCallback(
    (index: number) => {
      if (circles[index].fillColor !== palette.grey || circles[index].isSurrounded) {
        return;
      }

      if (isPlayerA && is_vs_pc) setComputersMove(circles[index]);

      // lets check if user is bruteforcing
      if (!isPlayerA && is_vs_pc) {
        if (!isBruteforcing?.prevUserMove) {
          setIsBruteforcing({ prevUserMove: index });
        } else {
          let tempState: TBroodforce = {};

          const directions: Record<number, TBroodforce["direction"]> = {
            [index - 1]: "R", // moving to the right
            [index + 1]: "L", // moving to the left
            [index - gridSizeX]: "B", // moving to the bottom
            [index + gridSizeX]: "T", // moving to the top
          };

          const newDirection = directions[isBruteforcing.prevUserMove];

          if (newDirection) {
            if (isBruteforcing.direction === newDirection) {
              tempState.count = (isBruteforcing.count || 0) + 1;
            } else {
              tempState.count = 1;
            }
            tempState.direction = newDirection;
          }

          tempState.prevUserMove = index;

          setIsBruteforcing(tempState);
        }
      }

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
        circles[i].fillColor === secondaryPlayerColor &&
        !circles[i].isSurrounded &&
        !checked.has(i) &&
        isCanBeSurroundedRecursive({
          circles,
          gridSizeX,
          index: i,
          checked,
          surroundedBy,
          checkedTemp,
          failedCheck,
          checkingColor: secondaryPlayerColor,
          surroundingColor: activePlayerColor,
        })
      ) {
        // Lets merge checked circles if they can be surrounded, otherwise ignore them
        if (checkedTemp.size) checkedTemp.forEach((item) => checked.add(item));

        possiblePcMooves.push({ checkedIndex: i, surroundedBy: [...surroundedBy] });
      }
    }

    // Possible user turns-------------------------------------------------------------------------------------
    const possibleUserMooves: { checkedIndex: number; surroundedBy: TCircle[] }[] = [];

    if (true) {
      const checked = new Set<number>();
      const failedCheck = new Set<number>();

      for (let i = startOfRange; i <= endOfRange; i++) {
        const surroundedBy = new Set<TCircle>();
        const checkedTemp = new Set<number>();

        if (
          circles[i].fillColor === activePlayerColor &&
          !circles[i].isSurrounded &&
          !checked.has(i) &&
          isCanBeSurroundedRecursive({
            circles,
            gridSizeX,
            index: i,
            checked,
            surroundedBy,
            checkedTemp,
            failedCheck,
            checkingColor: activePlayerColor,
            surroundingColor: secondaryPlayerColor,
          })
        ) {
          // Lets merge checked circles if they can be surrounded, otherwise ignore them
          if (checkedTemp.size) checkedTemp.forEach((item) => checked.add(item));

          possibleUserMooves.push({ checkedIndex: i, surroundedBy: [...surroundedBy] });
        }
      }
    }

    // Evaluating-------------------------------------------------------------------------------------

    const availablePcMooves = possiblePcMooves.filter((turn) => turn?.surroundedBy?.length);
    const availableUserMooves = possibleUserMooves.filter((turn) => turn?.surroundedBy?.length);

    const isPcMooves = possiblePcMooves.length && availablePcMooves.length;
    const isUserMooves = possibleUserMooves.length && availableUserMooves.length;

    const priorityMooves = [1, 2];

    // 1.
    if (!isPcMooves && !isUserMooves) {
      // For bruteforce case handling
      const isMoveToBreakBruteforceValid = isMoveToBreakBruteforce(
        isBruteforcing as Required<TBroodforce> & { prevUserMove: number },
        circles,
        gridSizeX
      );

      if (isMoveToBreakBruteforceValid) return makeATurn(isMoveToBreakBruteforceValid);
      // For bruteforce case handling

      return makeATurn(getRandomMoveNextToClicked(circles, gridSizeX));
    }

    // 2.
    if (!isPcMooves && isUserMooves) {
      // Lets first execute priority move if they exist
      for (let index = 0; index < priorityMooves.length; index++) {
        const priority = priorityMooves[index];

        const priorityUserMooves = availableUserMooves.filter(
          (turn) => turn?.surroundedBy?.length === priority
        );

        if (priorityUserMooves.length) {
          return makeATurn(
            getSafeIndexForMove({
              circles,
              proposedMoves: priorityUserMooves[0].surroundedBy,
              allyColor: activePlayerColor,
              enemyColor: secondaryPlayerColor,
              gridSizeX,
            })
          );
        }
      }

      // For bruteforce case handling
      const isMoveToBreakBruteforceValid = isMoveToBreakBruteforce(
        isBruteforcing as Required<TBroodforce> & { prevUserMove: number },
        circles,
        gridSizeX
      );

      if (isMoveToBreakBruteforceValid) {
        return makeATurn(isMoveToBreakBruteforceValid);
      }
      // For bruteforce case handling
      return makeATurn(
        takeAMoveOnShortestPath({
          movesArray: availableUserMooves,
          circles,
          allyColor: activePlayerColor,
          enemyColor: secondaryPlayerColor,
          gridSizeX,
        }) || getRandomMoveNextToClicked(circles, gridSizeX)
      );
    }

    // 3.
    if (isPcMooves && !isUserMooves) {
      return makeATurn(
        takeAMoveOnShortestPath({
          movesArray: availablePcMooves,
          circles,
          allyColor: activePlayerColor,
          enemyColor: secondaryPlayerColor,
          gridSizeX,
        }) || getRandomMoveNextToClicked(circles, gridSizeX)
      );
    }

    // 4.

    const lastPriorityMoves = [1, 2, 3, 4, 5, 6, 7];

    for (let index = 0; index < lastPriorityMoves.length; index++) {
      const priority = lastPriorityMoves[index];

      const priorityPcMooves = availablePcMooves.filter((turn) => turn?.surroundedBy?.length === priority);

      if (priorityPcMooves.length) {
        return makeATurn(
          getSafeIndexForMove({
            circles,
            proposedMoves: priorityPcMooves[0].surroundedBy,
            allyColor: activePlayerColor,
            enemyColor: secondaryPlayerColor,
            gridSizeX,
          })
        );
      }

      // Lets skip non priority possible users moves
      if (priority >= 3) continue;

      const priorityUserMooves = availableUserMooves.filter(
        (turn) => turn?.surroundedBy?.length === priority
      );

      if (priorityUserMooves.length) {
        return makeATurn(
          getSafeIndexForMove({
            circles,
            proposedMoves: priorityUserMooves[0].surroundedBy,
            allyColor: activePlayerColor,
            enemyColor: secondaryPlayerColor,
            gridSizeX,
          })
        );
      }
    }

    // 5.
    // Bruteforce case handling
    const isMoveToBreakBruteforceValid = isMoveToBreakBruteforce(
      isBruteforcing as Required<TBroodforce> & { prevUserMove: number },
      circles,
      gridSizeX
    );

    if (isMoveToBreakBruteforceValid) {
      return makeATurn(isMoveToBreakBruteforceValid);
    }

    // 00.
    // For handling edge cases
    return makeATurn(
      takeAMoveOnShortestPath({
        movesArray: availablePcMooves,
        circles,
        allyColor: activePlayerColor,
        enemyColor: secondaryPlayerColor,
        gridSizeX,
      }) || getRandomMoveNextToClicked(circles, gridSizeX)
    );
  }, [isPlayerA]);

  return { computersMove, setComputersMove, makeATurn, isPlayerA, isShowIndex, is_vs_pc };
}
