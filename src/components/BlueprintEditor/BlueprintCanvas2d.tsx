import React, { useEffect, useLayoutEffect, useContext, useRef } from "react";
import elementTypes from "./elementTypes";
import { Blueprint, BlueprintState, BlueprintPanelState } from "./typings";
import { CanvasContext } from "./contexts/CanvasContext";
import { PanelContext } from "./contexts/PanelContext";
import { TouchTrackerContext } from "./contexts/TouchTrackerContext";
import useDimensions from "./hooks/useDimensions";
import styles from "./styles";
import { BlueprintContext } from "./contexts/BlueprintContext";
import { BlueprintStateContext } from "./contexts/BlueprintStateContext";

interface BlueprintEditor2DProps {
  panelState: BlueprintPanelState;
  blueprint: Blueprint;
  onBlueprintChange: (blueprint: Blueprint) => void;
  blueprintState: BlueprintState;
  onBlueprintStateChange: (blueprintState: BlueprintState) => void;
}

const drawLine = (canvasContext, p1: number[], p2: number[]) => {
  canvasContext.beginPath();
  canvasContext.moveTo(p1[0], p1[1]);
  canvasContext.lineTo(p2[0], p2[1]);
  canvasContext.lineWidth = 1;
  canvasContext.strokeStyle = "#eeeeee";
  canvasContext.stroke();
};

const cleanCanvas = (canvasEl: HTMLCanvasElement) => {
  const canvasContext = canvasEl.getContext("2d");
  canvasContext.clearRect(0, 0, canvasEl.width, canvasEl.height);
  for (let x = 0; x < canvasEl.width; x += 20) {
    drawLine(canvasContext, [x, 0], [x, canvasEl.height]);
  }
  for (let y = 0; y < canvasEl.height; y += 20) {
    drawLine(canvasContext, [0, y], [canvasEl.width, y]);
  }
  canvasContext.save();
};

export default ({ panelState }: BlueprintEditor2DProps) => {
  const { getTouches } = useContext(TouchTrackerContext);
  const [dimensionsRef, dimensions] = useDimensions();
  const { blueprint } = useContext(BlueprintContext);
  const { updatePanel } = useContext(PanelContext);
  const { state: blueprintState } = useContext(BlueprintStateContext);
  const touches = getTouches();
  const { selectableElements2D, setSelectableElements2D } = useContext(
    CanvasContext
  );

  const canvasEl = useRef<HTMLCanvasElement>();
  useEffect(() => {
    if (dimensions) {
      canvasEl.current.width = dimensions.width;
      canvasEl.current.height = dimensions.height;
      updatePanel(panelState._id, {
        ...panelState,
        screenOffset: {
          x: canvasEl.current.width / 2,
          y: canvasEl.current.height / 2,
        },
      });
    }
  }, [dimensions]);
  useEffect(() => {
    let selectableElements = [];
    blueprint.elements.forEach((ele) => {
      const selectableElementsByElement = elementTypes[
        ele.type
      ]?.getSelectableElements2D?.(ele, blueprintState);

      selectableElements = [
        ...selectableElements,
        ...(selectableElementsByElement || []),
      ];
    });
    selectableElements.sort((a, b) => a.zIndex - b.zIndex);
    setSelectableElements2D(selectableElements);
  }, [blueprint, blueprintState]);
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      const canvasContext = canvasEl.current.getContext("2d");
      cleanCanvas(canvasEl.current);
      canvasContext.translate(
        panelState.screenOffset.x,
        panelState.screenOffset.y
      );
      selectableElements2D.forEach((selectableEle) => {
        const ele = blueprint.elements.find(
          (e) => e._id === selectableEle.elementId
        );
        const elementType = elementTypes[ele.type];
        if (selectableEle.controlType) {
          elementType.renderControl2D?.(
            canvasContext,
            ele,
            selectableEle.controlType,
            blueprint,
            blueprintState
          );
        } else {
          elementType.render2D?.(canvasContext, ele, blueprint, blueprintState);
        }
      });
      canvasContext.restore();
    });
  }, [selectableElements2D, panelState]);

  useEffect(() => {
    const num = touches.length;
    if (num) {
      if (num === 1) {
        // console.log(touches);
        // const figure = touches[0];
        // const selectableElement = getSelectableElementByPosition2D(
        //   { x: figure.x, y: figure.y },
        //   blueprint
        // );
      } else if (num === 2) {
        //
      }
    }
  }, [touches]);

  return (
    <div style={styles.canvasContainer} ref={dimensionsRef}>
      <canvas style={{ display: "block" }} ref={canvasEl} />
    </div>
  );
};
