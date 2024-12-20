import React, { PropsWithChildren } from "react";
import { Circle, Layer, Line, Stage, Text } from "react-konva";
import { palette } from "src/constants/constants";
import "./styles.scss";
import { useBlink } from "./useBlink";
import { useCanvas } from "./useCanvas";
import { useGame } from "./useGame";

type Props = {};

const DESIRED_CIRCLE_DIAMETR = 20;
const CIRCLE_SPACING = 1; // Space between circles
const LINE_WIDTH = 3; // Width of the line that connects circles

export const GameArea = ({}: PropsWithChildren<Props>) => {
  const {
    canvasRef,
    gridSizeX,
    canvasWidth,
    canvasHeight,
    circles,
    setCircles,
    circleDiameter,
    circleRadius,
    mouseEnterHandler,
    mouseLeaveHandler,
    pathToDraw,
    hoverCircle,
    setPathToDraw,
  } = useCanvas({
    DESIRED_CIRCLE_DIAMETR,
    CIRCLE_SPACING,
  });

  const { computersMove, makeATurn, isPlayerA, isShowIndex, is_vs_pc } = useGame({
    circles,
    gridSizeX,
    setCircles,
    setPathToDraw,
    circleDiameter,
  });

  // Blink effect: show -> hide -> show cover circle
  const { isVisible } = useBlink({ computersMove, isPlayerA });

  //---------------------------------------------------

  /*   console.log("surrounded ", surrounded);
  console.log("pathToDraw ***", pathToDraw); */

  return (
    <div className="canvas-wrapper" ref={canvasRef}>
      <Stage width={canvasWidth} height={canvasHeight} onMouseLeave={mouseLeaveHandler}>
        <Layer>
          {React.useMemo(() => {
            return circles.map((item, index) => {
              if (index === 0) console.log("Render >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

              return (
                <React.Fragment key={index}>
                  <Circle
                    x={item.x}
                    y={item.y}
                    radius={circleRadius}
                    fill={item.fillColor}
                    onMouseLeave={() => {
                      if (canvasRef?.current) {
                        canvasRef.current.style.cursor = "";
                      }
                      /*    mouseLeaveHandler(); */
                    }}
                    opacity={item.isSurrounded ? 0.3 : 1}
                    onMouseEnter={() => mouseEnterHandler(item)}
                    onClick={() => makeATurn(index)}
                    onTap={() => makeATurn(index)}
                  />

                  {isShowIndex && (
                    <Text
                      listening={false}
                      x={item.x}
                      y={item.y}
                      text={index.toString()}
                      fontSize={8}
                      fill="black"
                      width={20 - CIRCLE_SPACING}
                      height={20 - CIRCLE_SPACING}
                      verticalAlign="center"
                      align="center"
                      offsetX={circleRadius}
                      offsetY={circleRadius / 2 - 1}
                    />
                  )}
                </React.Fragment>
              );
            });
          }, [circles, isShowIndex])}
        </Layer>
        <Layer>
          {React.useMemo(() => {
            if (pathToDraw.length > 0)
              return pathToDraw.map(({ color, path }, index) => {
                if (index === 0)
                  console.log("Render___PATH >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

                const pathToDraw = path.reduce((acc, item) => {
                  acc.push(item.x);
                  acc.push(item.y);
                  return acc;
                }, [] as number[]);

                return (
                  <Line
                    key={`line-${index}`}
                    points={[...pathToDraw]}
                    stroke={color}
                    strokeWidth={LINE_WIDTH}
                  />
                );
              });
          }, [pathToDraw])}
        </Layer>
        <Layer>
          {hoverCircle && (
            <Circle
              listening={false}
              x={hoverCircle.x}
              y={hoverCircle.y}
              radius={circleRadius}
              fill={!is_vs_pc ? hoverCircle.fillColor : palette.blue}
            />
          )}
        </Layer>
        <Layer>
          {isVisible && computersMove && (
            <Circle
              listening={false}
              x={computersMove.x}
              y={computersMove.y}
              radius={circleRadius + 1}
              fill={palette.grey}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
