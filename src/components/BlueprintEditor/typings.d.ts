import { SFC } from "react";

interface ResizeObserver {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

interface CanvasControl {
  touchStart?: () => void;
  touchEnd?: () => void;
  touchDrag?: () => void;
  render2D?: (
    canvasContext,
    element: BlueprintElement,
    blueprint: Blueprint,
    blueprintState: BlueprintState
  ) => void;
  render3D?: (
    canvasContext,
    element: BlueprintElement,
    blueprint: Blueprint,
    blueprintState: BlueprintState
  ) => void;
}

type BlueprintControlTypeRenderProps = {
  orientation: "horizontal" | "vertical";
};

type BlueprintControlTypeRender = SFC<BlueprintControlTypeRenderProps>;

type BlueprintControlTypeToolbarProps = {
  controlType: BlueprintControlType;
};

type BlueprintControlTypeToolbar = SFC<BlueprintControlTypeToolbarProps>;

interface BlueprintControlType {
  key: string;
  name: string;
  icon?: string;
  iconActive?: string;
  toolbar?: BlueprintControlTypeToolbar;
  render: BlueprintControlTypeRender;
}

interface Position2D {
  x?: number;
  y?: number;
}

interface Position3D {
  x?: number;
  y?: number;
  z?: number;
}

interface BlueprintElement<Properties = any> {
  _id: string;
  type: string;
  parent: string | null;
  center: Position3D;
  boundary?: Position3D[];
  corners?: string[];
  rotate?: Position3D;
  isInWall?: boolean;
  height?: number;
  properties?: Properties;
  form?: SFC;
}

interface BlueprintCorner {
  _id: string;
  pos: Position2D;
  inward?: Position2D;
  outward?: Position2D;
}

interface Blueprint {
  elements: BlueprintElement[];
  corners: BlueprintCorner[];
}

interface BlueprintStateSelected {
  room?: string;
  // components selected (ie. could be group move)
  elements: string[];
  // if has control, selected will assume
  // control, otherwise, components selected
  control?: string;
}

interface BlueprintCanvasPanelRow {
  _id: string;
  panel?: string;
  columns?: BlueprintCanvasPanelRow[];
}

interface BlueprintPanelState {
  _id: string;
  is3D: boolean;
  showMiniMap?: boolean;
  screenOffset: Position3D;
  cameraOffset?: position3D;
  scale: number;
  rotate: Position2D;
}

interface ReactElementSize {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  left: number;
  bottom: number;
}

interface ControlPanel {
  isOpen: boolean;
  tabView: string;
  controlView: string;
  controls: string[];
}

interface BlueprintState {
  disableSelection?: boolean;
  showMiniMap?: boolean;
  miniMapSize?: number;
  selected: BlueprintStateSelected;
  panels: BlueprintPanelState[];
  panelsLayout: BlueprintCanvasPanelRow[];
  controlPanels: {
    left: ControlPanel;
    bottom: ControlPanel;
    [key: string]: ControlPanel;
  };
}

interface ElementActionsProps<Properties = any> {
  element: BlueprintElement<Properties>;
  onElementChange: (element: BlueprintElement<Properties>) => void;
  state: BlueprintState;
  onStateChange: (state: BlueprintState) => void;
}

interface ElementFormProps<Properties = any> {
  element: BlueprintElement<Properties>;
  onElementChange: (element: BlueprintElement<Properties>) => void;
  state: BlueprintState;
  onStateChange: (state: BlueprintState) => void;
}

interface SelectableElement<Properties = any> {
  elementId: string;
  controlType?: string;
  zIndex: number;
}

interface ElementType<Properties = any> {
  key: string;
  name: string;
  icon?: string;
  new: (
    ele?: any
  ) => { elements: BlueprintElement<Properties>[]; corners: BlueprintCorner[] };
  remove?: (blueprint: Blueprint, element: BlueprintElement) => Blueprint;
  moveDelta?: (
    blueprint: Blueprint,
    instance: BlueprintElement,
    deltaX: number,
    deltaY: number,
    deltaZ: number
  ) => Blueprint;
  inherits?: string;
  controls?: string[];
  menuHidden?: boolean;
  categories: string[];
  form?: SFC<ElementFormProps<Properties>>;
  actions?: SFC<ElementActionsProps<Properties>>;
  setCenterPoint2D?: (
    ele: BlueprintElement,
    blueprint: Blueprint
  ) => position2D;
  setCenterPoint3D?: (
    ele: BlueprintElement,
    blueprint: Blueprint
  ) => position3D;
  isOverlapped2D?: (
    ele: BlueprintElement,
    blueprint: Blueprint,
    position: position2D
  ) => boolean;
  isOverlapped3D?: (
    ele: BlueprintElement,
    blueprint: Blueprint,
    position: position3D
  ) => boolean;
  render2D?: (
    canvasContext,
    element: BlueprintElement,
    blueprint: Blueprint,
    blueprintState: BlueprintState
  ) => void;
  render3D?: (
    scene: THREE.Scene,
    element: BlueprintElement,
    blueprint: Blueprint,
    blueprintState: BlueprintState,
    meshpool: { [key: string]: THREE.Mesh },
    setMeshpool: (meshpool: { [key: string]: THREE.Mesh }) => void
  ) => void;
  renderControl2D?: (
    canvasContext,
    element: BlueprintElement,
    controlType: string,
    blueprint: Blueprint,
    blueprintState: BlueprintState
  ) => void;
  renderControl3D?: (
    scene: THREE.Scene,
    element: BlueprintElement,
    controlType: string,
    blueprint: Blueprint,
    blueprintState: BlueprintState,
    meshpool: { [key: string]: THREE.Mesh },
    setMeshpool: (meshpool: { key: THREE.Mesh }) => void
  ) => void;
  getSelectableElements2D?: (
    element: BlueprintElement,
    blueprintState: BlueprintState
  ) => SelectableElement[];
  getSelectableElements3D?: (
    element: BlueprintElement,
    blueprintState: BlueprintState
  ) => SelectableElement[];
}

interface ElementTypeFormProps {
  blueprint: Blueprint;
  onBlueprintChange: (blueprint: Blueprint) => void;
  blueprintState: BlueprintState;
  onBlueprintStateChange: (blueprintState: BlueprintState) => void;
}
