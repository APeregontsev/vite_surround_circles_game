import React from "react";
import { TCircle } from "./types";

const BLINK_TIME = 300; // Time of blinking of a computer move after appear

type Props = {
  computersMove: TCircle | null;
  isPlayerA: boolean;
};

export const useBlink = ({ computersMove, isPlayerA }: Props) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!computersMove && !isPlayerA) return;

    setIsVisible(false);
    const BLINK_TIMEout = setTimeout(() => {
      setIsVisible(true); // Hide it
      setTimeout(() => setIsVisible(false), BLINK_TIME);
    }, BLINK_TIME);

    return () => clearTimeout(BLINK_TIMEout); // Cleanup on unmount
  }, [computersMove]);

  return { isVisible };
};
