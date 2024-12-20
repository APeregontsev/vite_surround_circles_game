import React from "react";
import { palette } from "src/constants/constants";
import { useStore } from "src/store/store";
import { createCircles } from "./helpers";
import { TCircle, TPath } from "./types";

type Props = {
  DESIRED_CIRCLE_DIAMETR: number;
  CIRCLE_SPACING: number;
};

export function useCanvas({ DESIRED_CIRCLE_DIAMETR, CIRCLE_SPACING }: Props) {
  const { isReset, setSurrounded, isPlayerA } = useStore((state) => ({
    isPlayerA: state.isPlayerA,
    isReset: state.isReset,
    resetGame: state.resetGame,
    setSurrounded: state.setSurrounded,
  }));

  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [gridSizeX, setGridSizeX] = React.useState(0);

  const [canvasWidth, setCanvasWidth] = React.useState(0);
  const [canvasHeight, setCanvasHeight] = React.useState(0);
  const [circleDiameter] = React.useState(DESIRED_CIRCLE_DIAMETR);
  const [circleRadius] = React.useState(DESIRED_CIRCLE_DIAMETR / 2 - CIRCLE_SPACING);

  const [circles, setCircles] = React.useState<TCircle[]>([]);

  const [pathToDraw, setPathToDraw] = React.useState<TPath[]>([]);
  const [hoverCircle, setHoverCircle] = React.useState<TCircle | null>(null);

  const activePlayerColor = isPlayerA ? palette.red : palette.blue;

  React.useEffect(() => {
    function resizeCanvas() {
      const canvas_W = canvasRef?.current ? canvasRef?.current?.clientWidth : 0;
      const canvas_H = canvasRef?.current ? canvasRef?.current?.clientHeight : 0;

      const gridX = Math.floor((canvas_W - 0) / DESIRED_CIRCLE_DIAMETR);
      const gridY = Math.floor((canvas_H - 0) / DESIRED_CIRCLE_DIAMETR);

      const totalGridWidth = gridX * circleDiameter;
      const totalGridHeight = gridY * circleDiameter;

      const offset_X = (canvas_W - totalGridWidth) / 2;
      const offset_Y = (canvas_H - totalGridHeight) / 2;

      const newCircles = createCircles({
        gridSizeY: gridY,
        gridSizeX: gridX,
        circleDiameter,
        offsetX: offset_X,
        offsetY: offset_Y,
        circleRadius,
      });

      setGridSizeX(gridX);
      setCanvasWidth(canvas_W);
      setCanvasHeight(canvas_H);

      setCircles(newCircles);

      // to reset values

      setSurrounded(new Set([]));
      setPathToDraw([]);
    }

    //Lets fulfill array with circles
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isReset]);

  function mouseEnterHandler(item: TCircle) {
    if (item.fillColor !== palette.grey || item.isSurrounded) {
      return;
    }

    if (canvasRef?.current) {
      canvasRef.current.style.cursor = "pointer";
    }

    setHoverCircle({ ...item, fillColor: activePlayerColor });
  }

  function mouseLeaveHandler() {
    setHoverCircle(null);
  }

  return {
    canvasRef,
    gridSizeX,
    canvasWidth,
    canvasHeight,
    circles,
    circleDiameter,
    circleRadius,
    setCircles,
    mouseEnterHandler,
    mouseLeaveHandler,
    pathToDraw,
    setPathToDraw,
    hoverCircle,
  };
}
