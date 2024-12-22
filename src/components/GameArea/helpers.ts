import { palette } from "src/constants/constants";
import {
  TCircle,
  TCreateCircle,
  TDrawPath,
  TNotConnectedSurrounding,
  TPreRecursiveCheck,
  TRecursiveCheck,
  TRecursiveSurround,
} from "./types";

export function createCircles({
  gridSizeY,
  gridSizeX,
  circleDiameter,
  offsetX,
  offsetY,
  circleRadius,
}: TCreateCircle) {
  const newCircles: TCircle[] = [];

  let counter = 0;

  for (let row = 0; row < gridSizeY; row++) {
    for (let col = 0; col < gridSizeX; col++) {
      newCircles.push({
        index: counter,
        x: col * circleDiameter + circleRadius + offsetX,
        y: row * circleDiameter + circleRadius + offsetY,
        radius: circleRadius,
        fillColor: palette.grey,
        isClicked: false,
      });

      counter++;
    }
  }

  return newCircles;
}

export function isSurroundedRecursive({
  circles,
  gridSizeX,
  activePlayerColor,
  index,
  checked,
  surroundedBy,
  prevIndex,
}: TRecursiveCheck) {
  if (!preRecursiveCheck({ circles, gridSizeX, activePlayerColor, index })) return false;

  const col = index % gridSizeX;

  let preNeighbors = [
    index - 1, // left
    index + 1, // right
    index - gridSizeX, // top
    index + gridSizeX, // bottom
  ];

  const neighbors = [];

  if (prevIndex) {
    preNeighbors = preNeighbors.filter((x) => x !== prevIndex);
  }

  for (const neighborIndex of preNeighbors) {
    if (!checked.has(neighborIndex)) {
      neighbors.push(neighborIndex);
    }
  }

  for (const neighborIndex of neighbors) {
    checked.add(neighborIndex);
    checked.add(index);
  }

  let allSurrounded = true;

  // Out of bounds
  for (const neighborIndex of neighbors) {
    if (
      neighborIndex < 0 ||
      neighborIndex >= circles.length || // Out of bounds
      (neighborIndex % gridSizeX === 0 && col === gridSizeX - 1) || // Right edge case
      (neighborIndex % gridSizeX === gridSizeX - 1 && col === 0) // Left edge case
    ) {
      return false;
    }
  }

  for (const neighborIndex of neighbors) {
    const neighbor = circles[neighborIndex];

    if (neighbor.fillColor === activePlayerColor && !neighbor.isSurrounded) {
      surroundedBy.add(neighbor);

      continue;
    }

    if (
      !isSurroundedRecursive({
        circles,
        gridSizeX,
        activePlayerColor,
        index: neighborIndex,
        checked,
        surroundedBy,
        prevIndex: index,
      })
    ) {
      allSurrounded = false;
      break;
    }
  }

  return allSurrounded;
}

export function preRecursiveCheck({ circles, gridSizeX, activePlayerColor, index }: TPreRecursiveCheck) {
  let leftLine = false;
  let rightLine = false;
  let topLine = false;
  let bottomLine = false;

  const row = Math.floor(index / gridSizeX);

  const rowStart = index - (index % gridSizeX);
  const rowEnd = rowStart + gridSizeX - 1;
  const colEnd = circles.length / gridSizeX - 1;

  // If our circle situated on the board end - exit cause it cant be surrounded
  if (rowStart === index || rowEnd === index || row === 0 || row === colEnd) return false;

  // Lets check line to the left

  for (let i = index - 1; i >= rowStart; i--) {
    const element = circles[i];

    if (element?.fillColor === activePlayerColor) {
      leftLine = true;
      break;
    }
  }

  if (!leftLine) return false;

  // Lets check line to the right

  for (let i = index + 1; i <= rowEnd; i++) {
    const element = circles[i];

    if (element?.fillColor === activePlayerColor) {
      rightLine = true;
      break;
    }
  }

  if (!rightLine) return false;

  // Lets check line to the top

  for (let i = 1; i <= row; i++) {
    const element = circles[index - gridSizeX * i];

    if (element?.fillColor === activePlayerColor) {
      topLine = true;
      break;
    }
  }

  if (!topLine) return false;

  // Lets check line to the bottom

  for (let i = 1; i <= colEnd; i++) {
    const element = circles[index + gridSizeX * i];

    if (element?.fillColor === activePlayerColor) {
      bottomLine = true;
      break;
    }
  }

  if (!bottomLine) return false;

  return leftLine && rightLine && topLine && bottomLine;
}

export function drawPath({ surroundedBy, checked, gridSizeX, circleDiameter }: TDrawPath) {
  const circles = [...surroundedBy];

  circles.sort((a, b) => a.index - b.index);

  // Lets remove dots that surrounded by other dots so they dont form surrounding line
  const dotsToRemove = notConnectedSurroundingDots({
    surroundingArray: circles,
    checkedArray: checked,
    gridSizeX,
  });

  const circlesToDrawLine = circles.filter(({ index }) => !dotsToRemove.has(index));

  const dotsToConnect = new Set<TCircle>();

  buildDotsToConnect(circlesToDrawLine[0]);

  function buildDotsToConnect(dot: TCircle) {
    if (!dotsToConnect.has(dot)) dotsToConnect.add(dot);

    const closestDot = findNearest({
      dot,
      dots: circlesToDrawLine,
      connected: dotsToConnect,
      circleDiameter,
    });

    if (closestDot) {
      buildDotsToConnect(closestDot);
    }

    return;
  }

  const dotsToDraw = Array.from(dotsToConnect);

  const result: TCircle[] = [];

  dotsToDraw.forEach((dot, i) => {
    if (i === dotsToDraw.length - 1) {
      result.push(dot);
      result.push(dotsToDraw[0]);
    } else {
      result.push(dot);
    }
  });

  return result;
}

export function notConnectedSurroundingDots({
  surroundingArray,
  checkedArray,
  gridSizeX,
}: TNotConnectedSurrounding) {
  const dotsToRemoveFromLine = new Set();

  for (let i = 0; i < surroundingArray.length; i++) {
    const dotToCheck = surroundingArray[i].index;

    if (!checkedArray.has(dotToCheck - 1)) continue;
    if (!checkedArray.has(dotToCheck + 1)) continue;
    if (!checkedArray.has(dotToCheck - gridSizeX)) continue;
    if (!checkedArray.has(dotToCheck + gridSizeX)) continue;

    dotsToRemoveFromLine.add(dotToCheck);
  }

  return dotsToRemoveFromLine;
}

export type TFindNearest = { dot: TCircle; dots: TCircle[]; connected: Set<TCircle>; circleDiameter: number };

function findNearest({ dot, dots, connected, circleDiameter }: TFindNearest) {
  let minDist = Infinity;
  let nearestDot = null;

  for (let i = 0; i < dots.length; i++) {
    const otherDot = dots[i];
    if (dot !== otherDot && !connected.has(otherDot)) {
      let dist = distance({ point1: dot, point2: otherDot });

      if (dist < minDist) {
        minDist = dist;
        nearestDot = otherDot;
      }

      if (dist === circleDiameter) {
        break;
      }
    }
  }

  return nearestDot;
}

export type TDistance = { point1: TCircle; point2: TCircle };

function distance({ point1, point2 }: TDistance) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

export function isCanBeSurroundedRecursive({
  circles,
  gridSizeX,
  activePlayerColor,
  index,
  checked,
  surroundedBy,
  prevIndex,
  depth = 1,
  checkedTemp,
  failedCheck,
}: TRecursiveSurround) {
  // Lets do early return if circle leads to out of bounds
  if (failedCheck.has(index)) return false;

  // Lets exit if already checked this circle
  if (checkedTemp.has(index)) return true;

  // Lets limit depth of the rersion until better algorithm is applied
  /*   console.log("..........................................DEPTH", depth); */
  if (depth >= 60) {
    return true;
  }

  const col = index % gridSizeX;
  /* 
  console.log(`1_inside_recursion__${index}____prevIndex`, prevIndex);
  console.log(`2_inside_recursion__${index}____index`, index); */

  let preNeighbors = [
    index - 1, // left
    index + 1, // right
    index - gridSizeX, // top
    index + gridSizeX, // bottom
  ];

  let neighbors = [];

  /*   console.log(`3_inside_recursion__${index}____preNeighbors`, preNeighbors) */ if (!preNeighbors.length)
    return false;

  if (prevIndex) {
    preNeighbors = preNeighbors.filter((x) => x !== prevIndex);
  }

  for (const neighborIndex of preNeighbors) {
    if (!checkedTemp.has(neighborIndex)) {
      neighbors.push(neighborIndex);
    }
  }

  /*   neighbors = [...preNeighbors]; */

  // Out of bounds
  for (const neighborIndex of neighbors) {
    if (
      neighborIndex < 0 ||
      neighborIndex >= circles.length || // Out of bounds
      (neighborIndex % gridSizeX === 0 && col === gridSizeX - 1) || // Right edge case
      (neighborIndex % gridSizeX === gridSizeX - 1 && col === 0) // Left edge case
    ) {
      return false;
    }
  }

  let allSurrounded = true;

  /*   console.log(`4.0_!!!!!!!!!___neighbors_checked`, checked);
  console.log(`4_!!!!!!!!!___neighbors`, neighbors); */

  for (const neighborIndex of neighbors) {
    const neighbor = circles[neighborIndex];

    /*   console.log(`5_inside_neighbors__${neighborIndex}____neighbor`); */

    if (
      (neighbor.fillColor === palette.grey || neighbor.fillColor === palette.red) &&
      !neighbor.isSurrounded
    ) {
      if (neighbor.fillColor === palette.grey) surroundedBy.add(neighbor);

      continue;
    }

    if (
      !isCanBeSurroundedRecursive({
        circles,
        gridSizeX,
        activePlayerColor,
        index: neighborIndex,
        checked,
        surroundedBy,
        prevIndex: index,
        depth: depth + 1,
        checkedTemp,
        failedCheck,
      })
    ) {
      /*       console.log(`6_allSurrounded___FALSE__${neighborIndex}`); */
      checked.add(neighborIndex);
      allSurrounded = false;
      failedCheck.add(neighborIndex);

      break;
    }

    // Lets add circles to checked arr not to calc turns on them
    if (neighbor.fillColor === palette.blue && !neighbor.isSurrounded) {
      checkedTemp.add(neighborIndex);
      checkedTemp.add(index);
    }

    if (
      (neighbor.fillColor === palette.red || neighbor.fillColor === palette.grey) &&
      neighbor.isSurrounded
    ) {
      checkedTemp.add(neighborIndex);
    }
  }

  return allSurrounded;
}

export function isCanBeSurroundedRecursive2({
  circles,
  gridSizeX,
  activePlayerColor,
  index,
  checked,
  surroundedBy,
  prevIndex,
  depth = 1,
  checkedTemp,
  failedCheck,
}: TRecursiveSurround) {
  // Lets do early return if circle leads to out of bounds
  if (failedCheck.has(index)) return false;

  // Lets exit if already checked this circle
  if (checkedTemp.has(index)) return true;

  // Lets limit depth of the rersion until better algorithm is applied
  /*   console.log("..........................................DEPTH", depth); */
  if (depth >= 60) {
    return true;
  }

  const col = index % gridSizeX;
  /* 
  console.log(`1_inside_recursion__${index}____prevIndex`, prevIndex);
  console.log(`2_inside_recursion__${index}____index`, index); */

  let preNeighbors = [
    index - 1, // left
    index + 1, // right
    index - gridSizeX, // top
    index + gridSizeX, // bottom
  ];

  let neighbors = [];

  /*   console.log(`3_inside_recursion__${index}____preNeighbors`, preNeighbors) */ if (!preNeighbors.length)
    return false;

  if (prevIndex) {
    preNeighbors = preNeighbors.filter((x) => x !== prevIndex);
  }

  for (const neighborIndex of preNeighbors) {
    if (!checkedTemp.has(neighborIndex)) {
      neighbors.push(neighborIndex);
    }
  }

  /*   neighbors = [...preNeighbors]; */

  // Out of bounds
  for (const neighborIndex of neighbors) {
    if (
      neighborIndex < 0 ||
      neighborIndex >= circles.length || // Out of bounds
      (neighborIndex % gridSizeX === 0 && col === gridSizeX - 1) || // Right edge case
      (neighborIndex % gridSizeX === gridSizeX - 1 && col === 0) // Left edge case
    ) {
      return false;
    }
  }

  let allSurrounded = true;

  /*   console.log(`4.0_!!!!!!!!!___neighbors_checked`, checked);
  console.log(`4_!!!!!!!!!___neighbors`, neighbors); */

  for (const neighborIndex of neighbors) {
    const neighbor = circles[neighborIndex];

    /*   console.log(`5_inside_neighbors__${neighborIndex}____neighbor`); */

    if (
      (neighbor.fillColor === palette.grey || neighbor.fillColor === palette.blue) &&
      !neighbor.isSurrounded
    ) {
      if (neighbor.fillColor === palette.grey) surroundedBy.add(neighbor);

      continue;
    }

    if (
      !isCanBeSurroundedRecursive2({
        circles,
        gridSizeX,
        activePlayerColor,
        index: neighborIndex,
        checked,
        surroundedBy,
        prevIndex: index,
        depth: depth + 1,
        checkedTemp,
        failedCheck,
      })
    ) {
      /*       console.log(`6_allSurrounded___FALSE__${neighborIndex}`); */
      checked.add(neighborIndex);
      allSurrounded = false;
      failedCheck.add(neighborIndex);

      break;
    }

    // Lets add circles to checked arr not to calc turns on them
    if (neighbor.fillColor === palette.red && !neighbor.isSurrounded) {
      checkedTemp.add(neighborIndex);
      checkedTemp.add(index);
    }

    if (
      (neighbor.fillColor === palette.blue || neighbor.fillColor === palette.grey) &&
      neighbor.isSurrounded
    ) {
      checkedTemp.add(neighborIndex);
    }
  }

  return allSurrounded;
}

export function getRandomMove(circles: TCircle[]) {
  const filteredCircles = circles.filter(
    (dot) => !dot.isClicked && !dot.isSurrounded && dot.fillColor === palette.grey
  );

  if (filteredCircles.length === 0) {
    return 0;
  }

  // Pick a random dot from the filtered circles
  const randomIndex = Math.floor(Math.random() * filteredCircles.length);

  const selectedDot = filteredCircles[randomIndex];

  return selectedDot.index;
}

// Enhanced random move
export function getRandomMoveNextToClicked(circles: TCircle[], gridSizeX: number) {
  const filteredCircles = circles.filter(
    (dot) => dot.isClicked && !dot.isSurrounded && dot.fillColor !== palette.grey
  );

  if (filteredCircles.length === 0) {
    return 0;
  }

  // Pick a random dot from the filtered circles
  function checkFreeNeighbour() {
    const randomIndex = Math.floor(Math.random() * filteredCircles.length);
    const selectedDotIndex = filteredCircles[randomIndex]?.index;

    const col = selectedDotIndex % gridSizeX;

    let preNeighbors = [
      selectedDotIndex - 1, // left
      selectedDotIndex + 1, // right
      selectedDotIndex - gridSizeX, // top
      selectedDotIndex + gridSizeX, // bottom
    ];

    let neighbors = [];

    for (const neighborIndex of preNeighbors) {
      if (
        neighborIndex < 0 ||
        neighborIndex >= circles.length || // Out of bounds
        (neighborIndex % gridSizeX === 0 && col === gridSizeX - 1) || // Right edge case
        (neighborIndex % gridSizeX === gridSizeX - 1 && col === 0) // Left edge case
      ) {
        continue;
      }

      neighbors.push(neighborIndex);
    }

    for (const neighborIndex of neighbors) {
      const neighbor = circles[neighborIndex];

      if (!neighbor) continue;

      if (neighbor.fillColor === palette.grey && !neighbor.isSurrounded) {
        return neighbor.index;
      }
    }

    return checkFreeNeighbour();
  }

  const proposedMove = checkFreeNeighbour();

  return proposedMove ?? 0;
}

export function takeAMove(
  movesArray: {
    checkedIndex: number;
    surroundedBy: TCircle[];
  }[]
) {
  return movesArray.reduce((acc, possibleTurn) => {
    if (!possibleTurn) return acc;
    if (!possibleTurn.surroundedBy.length) return acc;

    if (possibleTurn?.surroundedBy?.length < acc?.surroundedBy?.length) return possibleTurn;

    return acc;
  }).surroundedBy[0].index;
}
