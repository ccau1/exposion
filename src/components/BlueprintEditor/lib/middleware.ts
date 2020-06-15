import { Blueprint } from "../typings";
import { scalePolygon } from "./utils";

export const roomUpdateMiddlewire = (roomid: string, blueprint: Blueprint) => {
  const room = blueprint.elements.find((ele) => ele._id === roomid);
  if (!room || room.type !== "room") {
    throw new Error("Room not found");
  }
  let walls = [];
  let cornerids = [];
  room.properties.elements.forEach((id: string) => {
    const ele = blueprint.elements.find((ele) => ele._id === id);
    if (ele.type === "wall") {
      walls.push(ele);
      if (!cornerids.includes(ele.corners[0])) {
        cornerids.push(ele.corners[0]);
      }
      if (!cornerids.includes(ele.corners[1])) {
        cornerids.push(ele.corners[1]);
      }
    } else {
      // update item center and boundary
    }
  });
  const polygon = cornerids.map(
    (cid) => blueprint.corners.find((c) => cid === c._id).pos
  );
  const inwardCorners = scalePolygon(polygon, -5);
  const outwardCorners = scalePolygon(polygon, 5);
  const corners = cornerids.reduce((data, id, i) => {
    data[id] = {
      _id: id,
      pos: polygon[i],
      inward: inwardCorners[i],
      outward: outwardCorners[i],
    };
    return data;
  }, {});

  let xmin = Infinity;
  let xmax = -Infinity;
  let zmin = Infinity;
  let zmax = -Infinity;
  polygon.forEach((corner) => {
    if (corner.x < xmin) xmin = corner.x;
    if (corner.x > xmax) xmax = corner.x;
    if (corner.y < zmin) zmin = corner.y;
    if (corner.y > zmax) zmax = corner.y;
  });

  let elements = {
    [room._id]: {
      ...room,
      boundary: [
        { x: xmax, y: room.height, z: zmax },
        { x: xmin, y: 0, z: zmin },
      ],
      center: {
        x: (xmin + xmax) * 0.5,
        y: room.height * 0.5,
        z: (zmin + zmax) * 0.5,
      },
    },
  };
  walls.forEach((wall) => {
    const corner1 = corners[wall.corners[0]];
    const corner2 = corners[wall.corners[1]];
    elements[wall._id] = {
      ...wall,
      boundary: [
        { x: corner1.pos.x, y: 0, z: corner1.pos.y },
        { x: corner2.pos.x, y: wall.height, z: corner2.pos.y },
      ],
      center: {
        x: (corner1.pos.x + corner2.pos.x) * 0.5,
        y: wall.height * 0.5,
        z: (corner2.pos.y, +corner2.pos.y) * 0.5,
      },
    };
  });

  return {
    elements: blueprint.elements.map((e) => elements[e._id] || e),
    corners: blueprint.corners.map((c) => corners[c._id] || c),
  };
};
