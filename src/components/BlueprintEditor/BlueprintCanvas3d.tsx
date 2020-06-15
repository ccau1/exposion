import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import * as THREE from "three";
import elementTypes from "./elementTypes";
import { Blueprint, BlueprintState, BlueprintPanelState } from "./typings";
import { CanvasContext } from "./contexts/CanvasContext";
import { TouchTrackerContext } from "./contexts/TouchTrackerContext";
import useDimensions from "./hooks/useDimensions";
import { BlueprintContext } from "./contexts/BlueprintContext";
import { BlueprintStateContext } from "./contexts/BlueprintStateContext";

interface BlueprintEditor3DProps {
  panelState: BlueprintPanelState;
  blueprint: Blueprint;
  onBlueprintChange: (blueprint: Blueprint) => void;
  blueprintState: BlueprintState;
  onBlueprintStateChange: (blueprintState: BlueprintState) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
};

export default ({ panelState }: BlueprintEditor3DProps) => {
  const [dimensionsRef, dimensions] = useDimensions();
  const { blueprint } = useContext(BlueprintContext);
  const { state: blueprintState } = useContext(BlueprintStateContext);
  const { getTouches } = useContext(TouchTrackerContext);
  const touches = getTouches();
  const {
    selectableElements3D,
    setSelectableElements3D,
    getSelectableElementByPosition3D,
  } = useContext(CanvasContext);

  const divEl = useRef<HTMLDivElement>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [scene, setScene] = useState<THREE.Scene>();
  const [meshPool, setMeshPool] = useState<{ [key: string]: THREE.Mesh }>({});
  const [status, setStatus] = useState<string>("init");
  useEffect(() => {
    const r = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    r.autoClear = false;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.setClearColor(0x999999);
    setRenderer(r);
    const scene = new THREE.Scene();
    setScene(scene);

    const light = new THREE.HemisphereLight(0xffffff, 0x888888, 1.5);
    light.position.set(0, 300, 0);
    scene.add(light);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0);
    dirLight.color.setHSL(1, 1, 0.1);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.far = 301;
    dirLight.shadow.bias = -0.0001;
    dirLight.visible = true;
    scene.add(dirLight);
    scene.add(dirLight.target);
  }, []);
  useEffect(() => {
    if (dimensions) {
      renderer.setSize(dimensions.width, dimensions.height);
      setCamera(
        new THREE.PerspectiveCamera(
          45,
          dimensions.width / dimensions.height,
          1,
          10000
        )
      );
      divEl.current.innerHTML = "";
      divEl.current.appendChild(renderer.domElement);
    }
  }, [dimensions]);
  useEffect(() => {
    let selectableElements = [];
    blueprint.elements.forEach((ele) => {
      const selectableElementsByElement = elementTypes[
        ele.type
      ]?.getSelectableElements3D?.(ele, blueprintState);

      selectableElements = [
        ...selectableElements,
        ...(selectableElementsByElement || []),
      ];
    });
    selectableElements.sort((a, b) => a.zIndex - b.zIndex);
    setSelectableElements3D(selectableElements);
  }, [blueprint, blueprintState]);
  useEffect(() => {
    if (scene && camera) {
      selectableElements3D.forEach((selectableEle) => {
        const ele = blueprint.elements.find(
          (e) => e._id === selectableEle.elementId
        );
        const elementType = elementTypes[ele.type];
        if (selectableEle.controlType) {
          elementType.renderControl3D(
            scene,
            ele,
            selectableEle.controlType,
            blueprint,
            blueprintState,
            meshPool,
            setMeshPool
          );
        } else {
          elementType.render3D(
            scene,
            ele,
            blueprint,
            blueprintState,
            meshPool,
            setMeshPool
          );
        }
      });

      let xmin = Infinity;
      let xmax = -Infinity;
      let zmin = Infinity;
      let zmax = -Infinity;
      blueprint.corners.forEach((corner) => {
        if (corner.pos.x < xmin) xmin = corner.pos.x;
        if (corner.pos.x > xmax) xmax = corner.pos.x;
        if (corner.pos.y < zmin) zmin = corner.pos.y;
        if (corner.pos.y > zmax) zmax = corner.pos.y;
      });
      const center = new THREE.Vector3(
        (xmin + xmax) * 0.5,
        150.0,
        (zmin + zmax) * 0.5
      );
      const size = new THREE.Vector3(xmax - xmin, 0, zmax - zmin);
      const distance = size.z * 4;
      const offset = center
        .clone()
        .add(new THREE.Vector3(0, distance, distance));

      camera.position.copy(new THREE.Vector3(offset.x, offset.y, offset.z));
      camera.lookAt(new THREE.Vector3(center.x, center.y, center.z));

      setStatus("ready");
    }
  }, [scene, camera, selectableElements3D, meshPool]);
  useLayoutEffect(() => {
    if (status === "ready") {
      requestAnimationFrame(() => {
        renderer.clear();
        renderer.render(scene, camera);
        setStatus("completed");
      });
    }
  }, [status]);

  useEffect(() => {
    const num = touches.length;
    if (num) {
      if (num === 1) {
        // console.log(touches);
        // const figure = touches[0];
        // const selectableElement = getSelectableElementByPosition3D(
        //   { x: figure.x, y: figure.y },
        //   blueprint
        // );
      } else if (num === 2) {
        //
      }
    }
  }, [touches]);

  return (
    <div style={containerStyle} ref={dimensionsRef}>
      <div ref={divEl} />
    </div>
  );
};
