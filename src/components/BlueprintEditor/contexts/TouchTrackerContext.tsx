import React, {
  CElement,
  useMemo,
  useEffect,
  useState,
  useRef,
  createContext,
} from "react";
import { Position2D } from "../typings";
import { BlueprintStateContext } from "./BlueprintStateContext";

interface TouchTrackerEvent {
  x: number;
  y: number;
  force: number;
  isTouched: boolean;
  target: string;
  originalX: number;
  originalY: number;
  deltaX: number;
  deltaY: number;
  deltaXInterval: number;
  deltaYInterval: number;
  moveDistance: number;
  originalCenterDistance: number; // distance between center point and touch
  deltaCenterDistance: number;
  deltaCenterDistanceInterval: number;
}

interface TouchSummary {
  scaleDelta: number; // resize from original size
  rotateDelta: number;
  dragDelta: Position2D;
  scaleDeltaInterval: number;
  rotateDeltaInterval: number;
  dragDeltaInterval: Position2D;
  fingersCenter: Position2D;
}

type TouchTrackerListener = (
  touches: TouchTrackerEvent[],
  summary: TouchSummary
) => void;

export interface TouchTrackerContextProps {
  getTouches: () => TouchTrackerEvent[];
  getTouchSummary: () => TouchSummary;
  addTouchListener: (
    type: "start" | "move" | "end",
    fn: TouchTrackerListener
  ) => void;
  removeTouchListener: (
    type: "start" | "move" | "end",
    fn: TouchTrackerListener
  ) => void;
}

export interface TouchTrackerProviderProps {
  children?: CElement<any, any>;
}

export const TouchTrackerContext = createContext<TouchTrackerContextProps>(
  null
);

const Provider = ({ children }: TouchTrackerProviderProps) => {
  //For future state use
  // const { state } = useContext(BlueprintStateContext);
  const scaleSpeed = 300;
  const scaleRatio = 0.1;

  const touchesRef = useRef<TouchTrackerEvent[]>([]);

  const topLeftDivRef = useRef<HTMLDivElement>(null);

  const touchSummaryRef = useRef<TouchSummary>({
    scaleDelta: 0,
    rotateDelta: 0,
    dragDelta: {
      x: 0,
      y: 0,
    },
    scaleDeltaInterval: 0,
    rotateDeltaInterval: 0,
    dragDeltaInterval: {
      x: 0,
      y: 0,
    },
    fingersCenter: {
      x: 0,
      y: 0,
    },
  });

  const [touchFns, setTouchFns] = useState<{
    start: TouchTrackerListener[];
    move: TouchTrackerListener[];
    end: TouchTrackerListener[];
  }>({
    start: [],
    move: [],
    end: [],
  });
  const value = useMemo<TouchTrackerContextProps>(
    () => ({
      getTopLeftDiv() {
        return topLeftDivRef.current;
      },
      getTouches() {
        return touchesRef.current;
      },
      getTouchSummary() {
        return touchSummaryRef.current;
      },
      addTouchListener(type, fn: TouchTrackerListener) {
        touchFns[type].push(fn);
      },
      removeTouchListener(type, fn: TouchTrackerListener) {
        setTouchFns({
          ...touchFns,
          [type]: touchFns[type].filter((f) => f !== fn),
        });
      },
    }),
    [touchFns]
  );

  //get position relative to parent
  const getPositionByEvent = (ev: {
    clientX: number;
    clientY: number;
  }): Position2D => {
    const parentPos = topLeftDivRef.current.getBoundingClientRect();

    if (
      ev.clientX < parentPos.left ||
      ev.clientY < parentPos.top ||
      ev.clientX > parentPos.left + parentPos.width ||
      ev.clientY > parentPos.top + parentPos.height
    ) {
      // console.log("out of bound");
    }
    return { x: ev.clientX - parentPos.left, y: ev.clientY - parentPos.top };
  };

  const distanceDeltaToScale = (
    scaleDelta: number,
    options?: { breakpoint?: number; speed?: number }
  ): number => {
    const opts = {
      scaleSpeed: scaleSpeed || 300,
      scaleRatio: scaleRatio || 0.1,
      ...options,
    };
    return 1 + (scaleDelta / opts.scaleSpeed) * opts.scaleRatio;
  };

  //get the original x and y
  //if no previous coordinate, current coordinate is the original x and y
  //current x and y params from getPositionByEvent function
  const originalXY = (currentXY: Position2D): Position2D => {
    if (touchesRef.current.length) {
      return {
        x: touchesRef.current[0].originalX,
        y: touchesRef.current[0].originalY,
      };
    } else {
      return {
        x: currentXY.x,
        y: currentXY.y,
      };
    }
  };

  // get the delta of x and y
  const getDelta = (
    currentXY: Position2D,
    originalXY: Position2D
  ): Position2D => {
    return {
      x: currentXY.x - originalXY.x,
      y: currentXY.y - originalXY.y,
    };
  };

  const getDeltaInterval = (
    currentXY: Position2D,
    originalXY: Position2D
  ): Position2D => {
    const previousXY = {
      x: touchesRef.current[touchesRef.current.length - 1].x,
      y: touchesRef.current[touchesRef.current.length - 1].y,
    };

    if (previousXY) {
      return {
        x: currentXY.x - previousXY.x,
        y: currentXY.y - previousXY.y,
      };
    } else {
      return {
        x: getDelta(currentXY, originalXY).x,
        y: getDelta(currentXY, originalXY).y,
      };
    }
  };

  // get the delta of the distance btw coordinate and center
  // if no previous coordinate, current delta is the current distance to center
  const getDeltaCenterDistance = (originalCenterDistance: number): number => {
    if (touchesRef.current.length) {
      return (
        originalCenterDistance - touchesRef.current[0].originalCenterDistance
      );
    } else {
      return originalCenterDistance;
    }
  };

  const getDeltaCenterDistanceInterval = (
    deltaCenterDistance: number
  ): number => {
    if (touchesRef.current.length) {
      return (
        deltaCenterDistance -
        touchesRef.current[touchesRef.current.length - 1].deltaCenterDistance
      );
    } else {
      return 0;
    }
  };

  const getScaleDeltaInterval = (scaleDelta: number): number => {
    if (touchesRef.current.length) {
      return scaleDelta - touchSummaryRef.current.scaleDelta;
    } else {
      return 0;
    }
  };

  const getRotateDeltaInterval = (rotateDelta: number): number => {
    if (touchesRef.current.length) {
      return rotateDelta - touchSummaryRef.current.rotateDelta;
    } else {
      return 0;
    }
  };

  const coordinateDistance = (pos1: Position2D, pos2: Position2D): number => {
    return ((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2) ** 0.5;
  };

  //for reduce method
  const xyDeltaAverages = (
    xy: Position2D,
    touch: TouchTrackerEvent,
    touchIndex: number,
    newTouches: TouchTrackerEvent[]
  ) => {
    // sum up all delta x and delta y
    xy.x += touch.deltaX;
    xy.y += touch.deltaY;

    // if it is the last one, divide by length to get the avg
    if (touchIndex === newTouches.length - 1) {
      xy.x = xy.x / newTouches.length;
      xy.y = xy.y / newTouches.length;
    }

    return xy;
  };

  //for reduce method
  const xyDeltaIntervalAverage = (
    xyInterval: Position2D,
    touch: TouchTrackerEvent,
    touchIndex: number,
    newTouches: TouchTrackerEvent[]
  ) => {
    // sum up all delta x and delta y interval
    xyInterval.x += touch.deltaXInterval;
    xyInterval.y += touch.deltaYInterval;

    // if it is the last one, divide by length to get the avg
    if (touchIndex === newTouches.length - 1) {
      xyInterval.x = xyInterval.x / newTouches.length;
      xyInterval.y = xyInterval.y / newTouches.length;
    }

    return xyInterval;
  };

  //for reduce method
  const scaleDeltaAverage = (
    accDistance,
    touch,
    touchIndex,
    newTouches: TouchTrackerEvent[]
  ) => {
    // sum up all finger's delta distance from fingersCenter
    accDistance += touch.deltaCenterDistance;

    // if it is the last one, divide by length to get the avg
    if (touchIndex === newTouches.length - 1) {
      accDistance = accDistance / newTouches.length;
    }

    return accDistance;
  };

  //for reduce method
  const rotateDeltaAverage = (
    accMove: number,
    touch: TouchTrackerEvent,
    touchIndex: number,
    newTouches: TouchTrackerEvent[]
  ): number => {
    accMove += touch.moveDistance;

    if (touchIndex === newTouches.length - 1) {
      accMove = accMove / newTouches.length;
    }

    return accMove;
  };

  const getFingersCenter = (ev: TouchEvent) => {
    //Create an array with length equal to number of touches each time
    return Array.from({ length: ev.touches.length }).reduce<Position2D>(
      (pos2dAcc, v, vIndex) => {
        const { x, y } = getTouchPosition(ev.touches.item(vIndex));
        pos2dAcc.x += x;
        pos2dAcc.y += y;

        if (vIndex >= ev.touches.length - 1) {
          // last item, handle avg
          pos2dAcc.x /= ev.touches.length;
          pos2dAcc.y /= ev.touches.length;
        }
        return pos2dAcc;
      },
      { x: 0, y: 0 }
    );
  };

  const generateTouches = (ev: TouchEvent): TouchTrackerEvent[] => {
    const newTouches: TouchTrackerEvent[] = [];

    for (let i = 0; i < ev.touches.length; i++) {
      const thisTouch: Touch = ev.touches.item(i);
      const { force }: Touch = thisTouch;
      const currentXY: Position2D = getTouchPosition(thisTouch);
      const originalXAndY: Position2D = originalXY(currentXY);
      const deltaX: number = getDelta(currentXY, originalXAndY).x;
      const deltaY: number = getDelta(currentXY, originalXAndY).y;
      const deltaXInterval: number = getDeltaInterval(currentXY, originalXAndY)
        .x;
      const deltaYInterval: number = getDeltaInterval(currentXY, originalXAndY)
        .y;
      const previousXY = { x: deltaXInterval, y: deltaYInterval };
      const moveDistance: number = coordinateDistance(currentXY, previousXY);
      //distance between original point and the touch(es)
      const originalCenterDistance: number = coordinateDistance(
        getTouchPosition(thisTouch),
        getFingersCenter(ev)
      );
      const deltaCenterDistance: number = getDeltaCenterDistance(
        originalCenterDistance
      );
      const deltaCenterDistanceInterval: number = getDeltaCenterDistanceInterval(
        originalCenterDistance
      );

      newTouches.push({
        x: currentXY.x,
        y: currentXY.y,
        force: force,
        isTouched: true,
        target:
          (thisTouch.target as any).tagName ||
          (thisTouch.target as any).localName,
        originalX: originalXAndY.x,
        originalY: originalXAndY.y,
        deltaX: deltaX,
        deltaY: deltaY,
        deltaXInterval: deltaXInterval,
        deltaYInterval: deltaYInterval,
        moveDistance: moveDistance,
        originalCenterDistance: originalCenterDistance,
        deltaCenterDistance: deltaCenterDistance,
        deltaCenterDistanceInterval: deltaCenterDistanceInterval,
      });
    }
    return newTouches;
  };

  const mouseHandlers = useMemo(
    () => ({
      move: (ev: MouseEvent) => {
        console.log("mouseDownHandler ev", ev, getPositionByEvent(ev));
        const currentXY = getPositionByEvent(ev);
        const originalXAndY: Position2D = originalXY(currentXY);
        const deltaX: number = getDelta(currentXY, originalXAndY).x;
        const deltaY: number = getDelta(currentXY, originalXAndY).y;
        const deltaXInterval: number = getDeltaInterval(
          currentXY,
          originalXAndY
        ).x;
        const deltaYInterval: number = getDeltaInterval(
          currentXY,
          originalXAndY
        ).y;
        const previousXY: Position2D = { x: deltaXInterval, y: deltaYInterval };
        const moveDistance: number = coordinateDistance(currentXY, previousXY);

        const newTouches: TouchTrackerEvent[] = [
          {
            x: currentXY.x,
            y: currentXY.y,
            force: 0,
            isTouched: false,
            target: ((ev.target as any).tagName ||
              (ev.target as any).localName ||
              "") as string,
            originalX: originalXAndY.x,
            originalY: originalXAndY.y,
            deltaX: deltaX,
            deltaY: deltaY,
            deltaXInterval: deltaXInterval,
            deltaYInterval: deltaYInterval,
            moveDistance: moveDistance,
            //mouse coordinate is the center so distance is 0
            originalCenterDistance: 0,
            deltaCenterDistance: 0,
            deltaCenterDistanceInterval: 0,
          },
        ];

        const newTouchSummary: TouchSummary = {
          //mouse event does not scale and rotate
          scaleDelta: 0,
          rotateDelta: 0,
          dragDelta: newTouches.reduce<Position2D>(xyDeltaAverages, {
            x: 0,
            y: 0,
          }),
          //mouse event does not scale and rotate
          scaleDeltaInterval: 0,
          rotateDeltaInterval: 0,
          dragDeltaInterval: newTouches.reduce<Position2D>(
            xyDeltaIntervalAverage,
            {
              x: 0,
              y: 0,
            }
          ),

          //mouse coordinate is the center
          fingersCenter: {
            x: currentXY.x,
            y: currentXY.y,
          },
        };

        touchFns.move.forEach((fn) => fn(newTouches, newTouchSummary));
      },
      down: (ev: MouseEvent) => {
        console.log("mouseDownHandler ev", ev, getPositionByEvent(ev));
        const { x, y } = getPositionByEvent(ev);

        const newTouches: TouchTrackerEvent[] = [
          {
            x: x,
            y: y,
            force: 0,
            isTouched: false,
            target: ((ev.target as any).tagName ||
              (ev.target as any).localName ||
              "") as string,

            //the event coordinate is the original
            originalX: x,
            originalY: y,

            //no subsequent mouse event so below properties are all 0
            deltaX: 0,
            deltaY: 0,
            deltaXInterval: 0,
            deltaYInterval: 0,
            moveDistance: 0,
            originalCenterDistance: 0,
            deltaCenterDistance: 0,
            deltaCenterDistanceInterval: 0,
          },
        ];

        const newTouchSummary: TouchSummary = {
          scaleDelta: 0,
          rotateDelta: 0,
          dragDelta: { x: 0, y: 0 }, //no dragging on down key
          scaleDeltaInterval: 0,
          rotateDeltaInterval: 0,
          dragDeltaInterval: { x: 0, y: 0 }, //no dragging on down key,
          fingersCenter: {
            x: x,
            y: y,
          },
        };
        touchFns.move.forEach((fn) => fn(newTouches, newTouchSummary));
      },
      up: (ev: MouseEvent) => {
        const newTouches: TouchTrackerEvent[] = [
          //lifting the click up triggers no coordinate so below are all 0
          {
            x: 0,
            y: 0,
            force: 0,
            isTouched: false,
            target: ((ev.target as any).tagName ||
              (ev.target as any).localName ||
              "") as string,
            originalX: 0,
            originalY: 0,
            deltaX: 0,
            deltaY: 0,
            deltaXInterval: 0,
            deltaYInterval: 0,
            moveDistance: 0,
            originalCenterDistance: 0,
            deltaCenterDistance: 0,
            deltaCenterDistanceInterval: 0,
          },
        ];
        const newTouchSummary: TouchSummary = {
          scaleDelta: 0,
          rotateDelta: 0,
          dragDelta: { x: 0, y: 0 }, //no dragging on up key
          scaleDeltaInterval: 0,
          rotateDeltaInterval: 0,
          dragDeltaInterval: { x: 0, y: 0 }, //no dragging on up key,
          fingersCenter: {
            x: 0,
            y: 0,
          },
        };
        touchFns.move.forEach((fn) => fn(newTouches, newTouchSummary));
      },
    }),
    [touchFns]
  );

  const getTouchPosition = (touch: Touch): Position2D => {
    return { x: touch.clientX, y: touch.clientY };
  };

  const touchHandlers = useMemo(
    () => ({
      start: (ev: TouchEvent) => {
        // console.log("touch start ev", ev);
        const fingersCenter = getFingersCenter(ev);
        console.log("getFingersCenter", fingersCenter);

        const newTouchSummary: TouchSummary = {
          scaleDelta: 0,
          rotateDelta: 0,
          dragDelta: {
            x: 0,
            y: 0,
          },
          scaleDeltaInterval: 0,
          rotateDeltaInterval: 0,
          dragDeltaInterval: {
            x: 0,
            y: 0,
          },
          fingersCenter: {
            x: fingersCenter.x,
            y: fingersCenter.y,
          },
        };

        const newTouches: TouchTrackerEvent[] = generateTouches(ev);

        touchFns.start.forEach((fn) => fn(newTouches, newTouchSummary));
      },
      move: (ev: TouchEvent) => {
        console.log("touch move ev", ev);
        const fingersCenter = getFingersCenter(ev);
        const newTouches: TouchTrackerEvent[] = generateTouches(ev);
        const scaleDelta = distanceDeltaToScale(
          newTouches.reduce<number>(scaleDeltaAverage, 0)
        );
        const rotateDelta = newTouches.reduce<number>(rotateDeltaAverage, 0);

        const newTouchSummary: TouchSummary = {
          scaleDelta: scaleDelta,
          rotateDelta: rotateDelta,
          dragDelta: newTouches.reduce<Position2D>(xyDeltaAverages, {
            x: 0,
            y: 0,
          }),
          scaleDeltaInterval: getScaleDeltaInterval(scaleDelta),
          rotateDeltaInterval: getRotateDeltaInterval(rotateDelta),
          dragDeltaInterval: newTouches.reduce<Position2D>(
            xyDeltaIntervalAverage,
            {
              x: 0,
              y: 0,
            }
          ),
          fingersCenter: fingersCenter,
        };

        touchFns.move.forEach((fn) => fn(newTouches, newTouchSummary));
      },
      cancel: (ev: TouchEvent) => {
        console.log("touch cancel ev", ev);
        const fingersCenter = getFingersCenter(ev);
        const newTouches: TouchTrackerEvent[] = generateTouches(ev);
        const newTouchSummary: TouchSummary = {
          scaleDelta: 0,
          rotateDelta: 0,
          dragDelta: {
            x: 0,
            y: 0,
          },
          scaleDeltaInterval: 0,
          rotateDeltaInterval: 0,
          dragDeltaInterval: {
            x: 0,
            y: 0,
          },
          fingersCenter,
        };

        touchFns.move.forEach((fn) => fn(newTouches, newTouchSummary));
      },
      end: (ev: TouchEvent) => {
        console.log("touch end ev", ev);
        const fingersCenter = getFingersCenter(ev);
        const newTouches: TouchTrackerEvent[] = generateTouches(ev);
        const newTouchSummary: TouchSummary = {
          scaleDelta: 0,
          rotateDelta: 0,
          dragDelta: {
            x: 0,
            y: 0,
          },
          scaleDeltaInterval: 0,
          rotateDeltaInterval: 0,
          dragDeltaInterval: {
            x: 0,
            y: 0,
          },
          fingersCenter,
        };

        touchFns.move.forEach((fn) => fn(newTouches, newTouchSummary));
      },
    }),
    [touchFns]
  );

  useEffect(() => {
    // set mouse listeners
    Object.keys(mouseHandlers).forEach((mouseEventKey) => {
      // remove any old listeners with this function
      document.removeEventListener(
        `mouse${mouseEventKey}`,
        mouseHandlers[mouseEventKey]
      );
      // add new listeners
      document.addEventListener(
        `mouse${mouseEventKey}`,
        mouseHandlers[mouseEventKey]
      );
    });

    // set touch listeners
    Object.keys(touchHandlers).forEach((touchEventKey) => {
      // remove any old listeners with this function
      document.removeEventListener(
        `touch${touchEventKey}`,
        touchHandlers[touchEventKey]
      );
      // add new listeners
      document.addEventListener(
        `touch${touchEventKey}`,
        touchHandlers[touchEventKey]
      );
    });

    // on unmount, remove listeners
    return () => {
      // go through each mouse event
      Object.keys(mouseHandlers).forEach((mouseEventKey) => {
        // remove any old listeners with this function
        document.removeEventListener(
          `mouse${mouseEventKey}`,
          mouseHandlers[mouseEventKey]
        );
      });
      // go through each touch event
      Object.keys(touchHandlers).forEach((touchEventKey) => {
        // remove any old listeners with this function
        document.removeEventListener(
          `touch${touchEventKey}`,
          touchHandlers[touchEventKey]
        );
      });
    };
  }, [mouseHandlers, touchHandlers]);

  return (
    <TouchTrackerContext.Provider value={value}>
      <div
        className="touchArea"
        ref={topLeftDivRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
      {children}
    </TouchTrackerContext.Provider>
  );
};

export default {
  ...TouchTrackerContext,
  Provider,
  Consumer: TouchTrackerContext.Consumer,
};
