import { Position2D } from "../typings";

export const pointInPolygon = (pos: Position2D, corners: Position2D[]) => {
  let sx = 0,
    sy = 0;

  for (let i = 0; i < corners.length; i++) {
    sx = Math.min(sx, corners[i].x);
    sy = Math.min(sy, corners[i].y);
  }
  sx = sx - 10;
  sx = sx - 10;

  let times = 0;
  for (let _i = 0; _i < corners.length; _i++) {
    let s = corners[_i];
    let e = _i === corners.length - 1 ? corners[0] : corners[_i + 1];

    if (lineLineIntersect([{ x: sx, y: sy }, pos], [s, e])) {
      times++;
    }
  }
  return times % 2 === 1;
};

export const polygonPolygonIntersect = (
  polygon1: Position2D[],
  polygon2: Position2D[]
) => {
  for (let i = 0; i < polygon1.length; i++) {
    const fc = polygon1[i],
      sc = i === polygon1.length - 1 ? polygon1[0] : polygon1[i + 1];
    if (linePolygonIntersect([fc, sc], polygon2)) {
      return true;
    }
  }
  return false;
};

export const linePolygonIntersect = (
  line: Position2D[],
  polygon: Position2D[]
) => {
  for (let i = 0; i < polygon.length; i++) {
    const fc = polygon[i],
      sc = i === polygon.length - 1 ? polygon[0] : polygon[i + 1];
    if (lineLineIntersect(line, [fc, sc])) {
      return true;
    }
  }
  return false;
};

export const lineLineIntersect = (line1: Position2D[], line2: Position2D[]) => {
  const denominator =
    (line2[1].y - line2[0].y) * (line1[1].x - line1[0].x) -
    (line2[1].x - line2[0].x) * (line1[1].y - line1[0].y);
  if (denominator === 0) {
    return false;
  }
  let a = line1[0].y - line2[0].y;
  let b = line1[0].x - line2[0].x;
  const numerator1 =
    (line2[1].x - line2[0].x) * a - (line2[1].y - line2[0].y) * b;
  const numerator2 =
    (line1[1].x - line1[0].x) * a - (line1[1].y - line1[0].y) * b;
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  return {
    x: line1[0].x + a * (line1[1].x - line1[0].x),
    y: line1[0].y + a * (line1[1].y - line1[0].y),
    onLine1: a > 0 && a < 1,
    onLine2: b > 0 && b < 1,
  };
};

export const midpointOfPolygon = (polygon: Position2D[]) => {
  let centroid = { x: 0, y: 0 };
  let signedArea = 0.0;
  let x0 = 0.0;
  let y0 = 0.0;
  let x1 = 0.0;
  let y1 = 0.0;
  let a = 0.0;

  let i: number;
  for (i = 0; i < polygon.length - 1; ++i) {
    x0 = polygon[i].x;
    y0 = polygon[i].y;
    x1 = polygon[i + 1].x;
    y1 = polygon[i + 1].y;
    a = x0 * y1 - x1 * y0;
    signedArea += a;
    centroid.x += (x0 + x1) * a;
    centroid.y += (y0 + y1) * a;
  }
  x0 = polygon[i].x;
  y0 = polygon[i].y;
  x1 = polygon[0].x;
  y1 = polygon[0].y;
  a = x0 * y1 - x1 * y0;
  signedArea += a;
  centroid.x += (x0 + x1) * a;
  centroid.y += (y0 + y1) * a;

  signedArea *= 0.5;
  centroid.x /= 6.0 * signedArea;
  centroid.y /= 6.0 * signedArea;

  return centroid;
};

export const midpointOfLine = (p1: Position2D, p2: Position2D) => {
  return [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
};

export const distance = (p1: Position2D, p2: Position2D) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const angle = (p1: Position2D, p2: Position2D) => {
  const dy = p2.y - p1.y;
  const dx = p2.x - p1.x;
  let theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI;
  if (theta < 0) theta = 360 + theta;
  return theta;
};

export const abangle = (p1: Position2D, p2: Position2D) => {
  const tDot = p1.x * p2.x + p1.y * p2.y;
  const tDet = p1.x * p2.y - p1.y * p2.x;
  return -Math.atan2(tDet, tDot);
};

export const closestPointOnLine = (p: Position2D, line: Position2D[]) => {
  const a = p.x - line[0].x;
  const b = p.y - line[0].y;
  const c = line[1].x - line[0].x;
  const d = line[1].y - line[0].y;

  const tDot = a * c + b * d;
  const tLenSq = c * c + d * d;
  const tParam = tDot / tLenSq;

  let x: number, y: number;

  if (tParam < 0 || (line[0].x === line[1].x && line[0].y === line[1].y)) {
    x = line[0].x;
    y = line[0].y;
  } else if (tParam > 1) {
    x = line[1].x;
    y = line[1].y;
  } else {
    x = line[0].x + tParam * c;
    y = line[0].y + tParam * d;
  }
  return { x, y };
};

export const pointDistanceFromLine = (p: Position2D, line: Position2D[]) => {
  const cp = closestPointOnLine(p, line);
  return distance(p, cp);
};

export const parallelLine = (line: Position2D[], margin: number) => {
  const dx = line[1].x - line[0].x;
  const dy = line[1].y - line[0].y;
  const edgeLength = Math.sqrt(dx * dx + dy * dy);
  const dn = { x: (-dy / edgeLength) * margin, y: (dx / edgeLength) * margin };
  return [
    { x: line[0].x + dn.x, y: line[0].y + dn.y },
    { x: line[1].x + dn.x, y: line[1].y + dn.y },
  ];
};

export const scalePolygon = (polygon: Position2D[], margin: number) => {
  if (!isClockwise(polygon)) {
    margin = -margin;
  }
  let offsetEdges = [];
  for (let i = 0; i < polygon.length; i++) {
    let p1 = polygon[i];
    let p2 = polygon[(i + polygon.length - 1) % polygon.length];
    offsetEdges.push(parallelLine([p1, p2], margin));
  }
  let vertices = [];
  for (let i = 0; i < offsetEdges.length; i++) {
    let thisEdge = offsetEdges[i];
    let prevI = (i + offsetEdges.length - 1) % offsetEdges.length;
    let prevEdge = offsetEdges[prevI];
    let vertex = lineLineIntersect(prevEdge, thisEdge);
    if (vertex) {
      vertices.push({ x: vertex.x, y: vertex.y });
    }
  }
  return vertices;
};

export const isClockwise = (polygon: Position2D[]) => {
  let tSubX = Math.min(
    0,
    Math.min.apply(
      null,
      polygon.map((p: Position2D) => p.x)
    )
  );
  let tSubY = Math.min(
    0,
    Math.min.apply(
      null,
      polygon.map((p: Position2D) => p.x)
    )
  );

  const newpolygon = polygon.map((p: Position2D) => ({
    x: p.x - tSubX,
    y: p.y - tSubY,
  }));

  let tSum = 0;
  for (let tI = 0; tI < newpolygon.length; tI++) {
    let tC1 = newpolygon[tI];
    let tC2: any;
    if (tI === newpolygon.length - 1) {
      tC2 = newpolygon[0];
    } else {
      tC2 = newpolygon[tI + 1];
    }
    tSum += (tC2.x - tC1.x) * (tC2.y + tC1.y);
  }
  return tSum >= 0;
};
