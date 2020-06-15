import React, { useState } from "react";
// import BlueprintEditor from "../../../components/BlueprintEditor";
import BlueprintEditor from "../components/BlueprintEditor";
import {
  Blueprint,
  BlueprintState,
} from "../components/BlueprintEditor/typings";
import dataConverter from "../lib/blueprintDataConverter";

const mockRawBlueprint: any = {
  floorplan: [
    {
      corners: [
        {
          id: "5ed7236f812c432016db9671",
          pos: { x: 48, y: -54 },
        },
        {
          id: "5ed7237465956b1e54c94b73",
          pos: { x: 148, y: -54 },
        },
        {
          id: "5ed72379d7be2498d670c83d",
          pos: { x: 148, y: 46 },
        },
        {
          id: "5ed72442974dae5bce07b191",
          pos: { x: 48, y: 46 },
        },
      ],
      walls: [
        {
          id: "5ed721f6da5ae4c601be42b8",
          corner1: "5ed7236f812c432016db9671",
          corner2: "5ed7237465956b1e54c94b73",
          height: 3.0,
        },
        {
          id: "5ed724aacf4586a4311c9e7e",
          corner1: "5ed7237465956b1e54c94b73",
          corner2: "5ed72379d7be2498d670c83d",
          height: 3.0,
        },
        {
          id: "5ed724e8647f6b6f59dd84a6",
          corner1: "5ed72379d7be2498d670c83d",
          corner2: "5ed72442974dae5bce07b191",
          height: 3.0,
        },
        {
          id: "5ed724f2dd76a79dcf1b3eb8",
          corner1: "5ed72442974dae5bce07b191",
          corner2: "5ed7236f812c432016db9671",
          height: 3.0,
        },
      ],
    },
  ],
};

// const mockBlueprint: Blueprint = {
//   elements: [
//     {
//       _id: "5ed721e95a9e712ffc89b099",
//       type: "room",
//       parent: null,
//       boundary: [],
//       center: { x: 30, y: 20, z: 10 },
//       properties: {
//         name: "Room 1",
//         elements: [
//           "5ed721f6da5ae4c601be42b8",
//           "5ed724aacf4586a4311c9e7e",
//           "5ed724e8647f6b6f59dd84a6",
//           "5ed724f2dd76a79dcf1b3eb8",
//         ],
//       },
//     },
//     {
//       _id: "5ed721f6da5ae4c601be42b8",
//       type: "wall",
//       parent: "5ed721e95a9e712ffc89b099",
//       // TODO: needed? for quick fetch of all nested children
//       // ancestors: [],
//       center: { x: 30, y: 20, z: 10 },
//       corners: ["5ed7236f812c432016db9671", "5ed7237465956b1e54c94b73"],
//     },
//     {
//       _id: "5ed724aacf4586a4311c9e7e",
//       type: "wall",
//       parent: "5ed721e95a9e712ffc89b099",
//       // TODO: needed? for quick fetch of all nested children
//       // ancestors: [],
//       center: { x: 30, y: 20, z: 10 },
//       corners: ["5ed7237465956b1e54c94b73", "5ed72379d7be2498d670c83d"],
//     },
//     {
//       _id: "5ed724e8647f6b6f59dd84a6",
//       type: "wall",
//       parent: "5ed721e95a9e712ffc89b099",
//       // TODO: needed? for quick fetch of all nested children
//       // ancestors: [],
//       center: { x: 30, y: 20, z: 10 },
//       corners: ["5ed72379d7be2498d670c83d", "5ed72442974dae5bce07b191"],
//     },
//     {
//       _id: "5ed724f2dd76a79dcf1b3eb8",
//       type: "wall",
//       parent: "5ed721e95a9e712ffc89b099",
//       // TODO: needed? for quick fetch of all nested children
//       // ancestors: [],
//       center: { x: 30, y: 20, z: 10 },
//       corners: ["5ed72442974dae5bce07b191", "5ed7236f812c432016db9671"],
//     },
//     {
//       _id: "5ed724f2dd76a79dcf1b3eb8",
//       type: "furniture",
//       parent: "5ed721e95a9e712ffc89b099",
//       // TODO: needed? for quick fetch of all nested children
//       // ancestors: [],
//       center: { x: 30, y: 20, z: 10 },
//     },
//   ],
//   corners: [
//     {
//       _id: "5ed7236f812c432016db9671",
//       pos: { x: 48, y: -54 },
//     },
//     {
//       _id: "5ed7237465956b1e54c94b73",
//       pos: { x: 148, y: -54 },
//     },
//     {
//       _id: "5ed72379d7be2498d670c83d",
//       pos: { x: 148, y: 46 },
//     },
//     {
//       _id: "5ed72442974dae5bce07b191",
//       pos: { x: 48, y: 46 },
//     },
//   ],
// };

const mockBlueprintState: BlueprintState = {
  controlPanels: {
    bottom: {
      tabView: "",
      isOpen: true,
      controlView: "addElement",
      controls: ["form", "addElement", "code"],
    },
    left: {
      tabView: "",
      isOpen: false,
      controlView: "",
      controls: ["form", "addElement"],
    },
  },
  disableSelection: false,
  panels: [
    {
      _id: "5eddbb009a45849e28c9e86e",
      is3D: false,
      showMiniMap: true,
      screenOffset: { x: 0, y: 0, z: 0 },
      cameraOffset: { x: 0, y: 0, z: 0 },
      scale: 1,
      rotate: { x: 0, y: 0 },
    },
    // {
    //   _id: "5eddc029d05929b400de047a",
    //   is3D: true,
    //   showMiniMap: true,
    //   screenOffset: { x: 0, y: 0, z: 0 },
    //   rotate: { x: 0, y: 0 },
    //   scale: 1,
    // },
  ],
  panelsLayout: [
    // {
    //   _id: "5eddd0fce9e58ed08c3f926d",
    //   columns: [
    //     {
    //       _id: "5eddd0ea1edb321d44a63ce3",
    //       panel: "5eddbb009a45849e28c9e86e",
    //     },
    //     {
    //       _id: "5eddd0f0003fc03b3531c6ee",
    //       panel: "5eddc029d05929b400de047a",
    //     },
    //   ],
    // },
    {
      _id: "5eddd0ea1edb321d44a63ce3",
      panel: "5eddbb009a45849e28c9e86e",
    },
  ],
  selected: {
    elements: ["5ed721f6da5ae4c601be42b8"],
    control: null,
  },
  showMiniMap: true,
};

export default () => {
  const [blueprint, setBlueprint] = useState<Blueprint>(
    dataConverter(mockRawBlueprint)
  );
  const [blueprintState, setBlueprintState] = useState<BlueprintState>(
    mockBlueprintState
  );
  return (
    // <div style={{ margin: "10px 15px", height: "100%" }}>
    <BlueprintEditor
      blueprintState={blueprintState}
      onBlueprintStateChange={setBlueprintState}
      blueprint={blueprint}
      onBlueprintChange={setBlueprint}
    />
    // </div>
  );
};
