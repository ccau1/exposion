import { StyleProp } from "react-native";

export default {
  controlPanelsContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },
  elementTypeButton: {
    padding: "10px",
    display: "block",
    width: "100px",
  },
  codeDisplayContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  panelsContainer: {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  panelRow: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  panelColumn: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  panel: {
    flex: 1,
  },
  panelButton: {
    padding: "5px",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  panelButtonActive: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  canvasContainer: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
} as { [key: string]: StyleProp<any> };
