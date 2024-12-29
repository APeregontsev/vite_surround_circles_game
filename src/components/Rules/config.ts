import rules_steps from "src/assets/rules_steps.png";
import rules_surround from "src/assets/rules_surround.png";
import rules_victory from "src/assets/rules_victory.png";

export type TRule = {
  img: string;
  rules: string[];
};

export const RULES_CONFIG: Record<number, TRule> = {
  1: {
    img: rules_steps,
    rules: ["The goal of the game is to surround opponent's dots;", "One surrounded dot equals one point;"],
  },
  2: {
    img: rules_surround,
    rules: [
      "The dots must be surrounded on all four sides;",
      "Their total number in the surrounding is not limited;",
    ],
  },
  3: { img: rules_victory, rules: ["The winner is the one who surrounds more dots;"] },
};
