import { ObjectID } from "bson";
import { Blueprint } from "../components/BlueprintEditor/typings";
import { roomUpdateMiddlewire } from "../components/BlueprintEditor/lib/middleware";

const dataConverter: (data: { floorplan: Array<any> }) => Blueprint = (
  data
) => {
  let roomids = [];
  let blurprint = { elements: [], corners: [] };
  data.floorplan.forEach((room) => {
    const roomid = new ObjectID().toString();
    roomids.push(roomid);
    blurprint.corners = [
      ...blurprint.corners,
      ...room.corners.map((c: any) => ({
        _id: c.id,
        pos: c.pos,
      })),
    ];
    let height = 0;
    let roomchilds = [];
    room.walls.forEach((wall: any) => {
      const wallid = new ObjectID().toString();
      const wallheight = wall.height * 100; // m to cm
      blurprint.elements.push({
        _id: wallid,
        type: "wall",
        parent: roomid,
        height: wallheight,
        corners: [wall.corner1, wall.corner2],
      });
      if (wallheight > height) height = wallheight;
      roomchilds.push(wallid);
    });
    blurprint.elements = [
      {
        _id: roomid,
        type: "room",
        parent: null,
        height: height,
        properties: {
          name: room.name || "Room",
          elements: roomchilds,
        },
      },
      ...blurprint.elements,
    ];
  });
  roomids.forEach((id) => {
    blurprint = roomUpdateMiddlewire(id, blurprint);
  });
  return blurprint;
};

export default dataConverter;
