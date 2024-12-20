import { TCircle } from "../GameArea/types";

export function calcScore(surroundedArray: Set<TCircle>, playerColor: string) {
  return [...surroundedArray].reduce(
    (acc, item) =>
      item.fillColor === playerColor && !item.surroundedBy?.some((circle) => circle.isSurrounded)
        ? ++acc
        : acc,
    0
  );
}
