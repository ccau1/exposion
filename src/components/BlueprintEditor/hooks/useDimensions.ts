import { useRef, useState, useLayoutEffect, MutableRefObject } from "react";
import { ReactElementSize } from "../typings";

const useDimensions = (): [
  MutableRefObject<HTMLDivElement>,
  ReactElementSize
] => {
  const ref = useRef<HTMLDivElement>();
  const [dimensions, setDimensions] = useState<ReactElementSize>(null);

  // const resizeObserver = new ResizeObserver(() =>
  //   setDimensions(ref.current?.getBoundingClientRect().toJSON())
  // );

  useLayoutEffect(() => {
    setDimensions(ref.current?.getBoundingClientRect().toJSON());
    const resizeFn = (e) => {
      setDimensions(ref.current?.getBoundingClientRect().toJSON());
    };

    // resizeObserver.observe(ref.current);

    window.removeEventListener("resize", resizeFn);
    window.addEventListener("resize", resizeFn);
    return () => {
      // resizeObserver.disconnect();
      window.removeEventListener("resize", resizeFn);
    };
  }, [ref]);

  return [ref, dimensions];
};

export default useDimensions;
