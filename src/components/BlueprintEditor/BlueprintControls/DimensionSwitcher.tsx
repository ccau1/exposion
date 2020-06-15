import React from "react";
import { useContext } from "react";
import { BlueprintStateContext } from "../contexts/BlueprintStateContext";

export default () => {
  const { setIs3D } = useContext(BlueprintStateContext);
  return (
    <div>
      <a onClick={() => setIs3D(false)}>2D</a>
      <a onClick={() => setIs3D(true)}>3D</a>
    </div>
  );
};
