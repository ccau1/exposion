import * as THREE from "three";
import Form from "./Form";
import { ElementType, BlueprintCorner, BlueprintElement } from "../../typings";
import elementTypes from "..";
import { ObjectID } from "bson";
import { pointInPolygon, abangle } from "../../lib/utils";

export interface RoomProperties {
  elements: string[];
}

export default {
  key: "room",
  name: "Room",
  categories: ["room"],
  new(ele) {
    const walls = Array.from({ length: 4 }).reduce<{
      elements: BlueprintElement[];
      corners: BlueprintCorner[];
    }>(
      (obj) => {
        const { elements, corners } = elementTypes["wall"].new();
        obj.elements = obj.elements.concat(elements);
        obj.corners = obj.corners.concat(corners);
        return obj;
      },
      {
        elements: [],
        corners: [],
      }
    );
    return {
      elements: [
        {
          _id: new ObjectID().toString(),
          type: this.key,
          parent: null,
          center: { x: 0, y: 0, z: 0 },
          rotate: { x: 0, y: 0 },
          corners: [],
          properties: {
            elements: [],
          },
          isInWall: false,
          ...ele,
        },
        ...walls.elements,
      ],
      corners: [...walls.corners],
    };
  },
  moveDelta: (blueprint, element, deltaX, deltaY, deltaZ) => {
    const newElements = [...blueprint.elements];
    element.properties?.elements.forEach((el) => {
      // FIXME: need to find provider's moveDelta
      // helper.moveDelta(el, deltaX, deltaY, deltaZ);
    });
    return { ...blueprint, elements: newElements };
  },
  isOverlapped2D: (
    ele: BlueprintElement<RoomProperties>,
    blueprint,
    position
  ) => {
    const corners = ele.properties?.elements.reduce<{
      [key: string]: BlueprintCorner;
    }>((data, eid) => {
      const wall = blueprint.elements.find((_ele) => _ele._id === eid);
      if (wall && wall.type === "wall") {
        data[wall.corners[0]] = blueprint.corners.find(
          (c) => c._id === wall.corners[0]
        );
        data[wall.corners[1]] = blueprint.corners.find(
          (c) => c._id === wall.corners[1]
        );
      }
      return data;
    }, {});
    return pointInPolygon(
      { x: position.x, y: position.y },
      Object.values(corners).map((c) => c.pos)
    );
  },
  render2D: (
    canvasContext,
    ele: BlueprintElement<RoomProperties>,
    blueprint,
    blueprintState
  ) => {
    const isElementSelected = blueprintState.selected.elements.includes(
      ele._id
    );
    const corners = ele.properties?.elements.reduce<{
      [key: string]: BlueprintCorner;
    }>((data, eid) => {
      const wall = blueprint.elements.find((_ele) => _ele._id === eid);
      if (wall && wall.type === "wall") {
        data[wall.corners[0]] = blueprint.corners.find(
          (c) => c._id === wall.corners[0]
        );
        data[wall.corners[1]] = blueprint.corners.find(
          (c) => c._id === wall.corners[1]
        );
      }
      return data;
    }, {});
    const cornersList = Object.values(corners);

    canvasContext.beginPath();
    canvasContext.moveTo(cornersList[0].pos.x, cornersList[0].pos.y);
    for (let i = 1; i < cornersList.length; i++) {
      canvasContext.lineTo(cornersList[i].pos.x, cornersList[i].pos.y);
    }
    canvasContext.lineTo(cornersList[0].pos.x, cornersList[0].pos.y);
    canvasContext.closePath();

    if (isElementSelected) {
      canvasContext.lineWidth = 14;
      canvasContext.strokeStyle = blueprintState.selected.room
        ? "#999999"
        : "#000000";
      canvasContext.stroke();
    } else {
      canvasContext.fillStyle = "#eeeeee";
      canvasContext.fill();

      canvasContext.font = "12px Verdana";
      canvasContext.fillStyle = "#000000";
      canvasContext.textAlign = "center";
      canvasContext.fillText(
        ele.properties["name"],
        ele.center.x,
        ele.center.z + 3
      );
      canvasContext.lineWidth = 5;
      canvasContext.strokeStyle = blueprintState.selected.room
        ? "#999999"
        : "#000000";
      canvasContext.stroke();
    }
  },
  render3D: (
    scene,
    ele: BlueprintElement<RoomProperties>,
    blueprint,
    blueprintState,
    meshpool,
    setMeshpool
  ) => {
    ele.properties?.elements.forEach((eid) => {
      const wall = blueprint.elements.find((_ele) => _ele._id === eid);
      if (wall && wall.type === "wall") {
        const corner1 = blueprint.corners.find(
          (c) => wall.corners[0] === c._id
        );
        const corner2 = blueprint.corners.find(
          (c) => wall.corners[1] === c._id
        );
        const v1 = new THREE.Vector3(corner1.inward.x, 0, corner1.inward.y);
        const v2 = new THREE.Vector3(corner2.inward.x, 0, corner2.inward.y);
        const v3 = v2.clone();
        v3.y = wall.height;
        const v4 = v1.clone();
        v4.y = wall.height;

        const points = [v1.clone(), v2.clone(), v3.clone(), v4.clone()];

        const transform = new THREE.Matrix4(),
          invTransform = new THREE.Matrix4();
        const angle = abangle(
          { x: 1, y: 0 },
          { x: v2.x - v1.x, y: v2.z - v1.z }
        );
        const tt = new THREE.Matrix4();
        tt.makeTranslation(-v1.x, 0, -v1.z);
        const tr = new THREE.Matrix4();
        tr.makeRotationY(-angle);
        transform.multiplyMatrices(tr, tt);
        invTransform.getInverse(transform);

        points.forEach((p) => {
          p.applyMatrix4(transform);
        });

        const shape = new THREE.Shape([
          new THREE.Vector2(points[0].x, points[0].y),
          new THREE.Vector2(points[1].x, points[1].y),
          new THREE.Vector2(points[2].x, points[2].y),
          new THREE.Vector2(points[3].x, points[3].y),
        ]);
        const geometry = new THREE.ShapeGeometry(shape);
        geometry.vertices.forEach((v) => {
          v.applyMatrix4(invTransform);
        });
        const meshkey = `${wall._id}_inward`;
        if (!meshpool[meshkey]) {
          const mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({ color: 0xffffff })
          );
          scene.add(mesh);
          setMeshpool({ ...meshpool, [meshkey]: mesh });
        } else {
          meshpool[meshkey].geometry = geometry;
        }
      }
    });
  },
  renderControl2D: (
    canvasContext,
    ele: BlueprintElement<RoomProperties>,
    controlType,
    blueprint,
    blueprintState
  ) => {
    //
  },
  getSelectableElements2D: (ele, blueprintState) => {
    const isElementSelected = blueprintState.selected.elements.includes(
      ele._id
    );
    const selectableElements = [];
    selectableElements.push({
      elementId: ele._id,
      zIndex: isElementSelected ? 3 : 1,
    });
    if (isElementSelected) {
      const elementType = elementTypes[ele.type];
      (elementType.controls || []).forEach((type) => {
        selectableElements.push({
          elementId: ele._id,
          controlType: type,
          zIndex: 10,
        });
      });
    }
    return selectableElements;
  },
  getSelectableElements3D: (ele, blueprintState) => {
    return [
      {
        elementId: ele._id,
        zIndex: 1,
      },
    ];
  },
  form: Form,
} as ElementType<RoomProperties>;
