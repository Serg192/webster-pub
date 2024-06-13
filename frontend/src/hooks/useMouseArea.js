import { nanoid } from "@reduxjs/toolkit";
import { toStageRelPos } from "../helpers/toStageRelPos";
import {
  Rectangle,
  Circle,
  ShapeType,
  Text,
  Tool,
  Line,
  Polygon,
  Arrow,
} from "../types";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { getEllipseSize, getRectSize } from "../helpers/shapeSize";

import { useDispatch, useSelector } from "react-redux";
import {
  addObjectToStage,
  selectStageObject,
  selectStageObjectsInArea,
  selectAllSelectedObjects,
  selectAllStageObjects,
} from "../features/canvas/stageSlice";

const initialArea = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  visible: false,
  startX: 0,
  startY: 0,
};

const findNearestPoint = (x, y, shapes, magnetDistance = 20) => {
  let nearestPoint = null;
  let minDistance = Infinity;
  if (!Array.isArray(shapes)) {
    return nearestPoint;
  }


  shapes.forEach(shape => {
    if (shape.points && (shape.type === ShapeType.LINE || shape.type === ShapeType.ARROW)) {
      for (let i = 0; i < shape.points.length; i += 2) {
        const pointX = shape.points[i];
        const pointY = shape.points[i + 1];
        const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);

        if (distance < minDistance && distance < magnetDistance) {
          minDistance = distance;
          nearestPoint = { x: pointX, y: pointY };
        }
      }
    } else if (shape.type === ShapeType.RECTANGLE) {
      const angle = shape.rotation * (Math.PI / 180);
      console.log(shape.rotation);
      const rectPoints = [
        { x: (shape.x + (shape.width / 2)) , y: (shape.y + shape.height)},
        { x: shape.x + (shape.width / 2), y: shape.y },
        { x: shape.x, y: shape.y + (shape.height / 2) },
        { x: (shape.x + shape.width), y: shape.y + (shape.height / 2) }
      ];

      rectPoints.forEach(point => {
        const rotatedX = (point.x - shape.x) * Math.cos(angle) - (point.y - shape.y) * Math.sin(angle) + shape.x;
        const rotatedY = (point.x - shape.x) * Math.sin(angle) + (point.y - shape.y) * Math.cos(angle) + shape.y;
        const distance = Math.sqrt((x - rotatedX) ** 2 + (y - rotatedY) ** 2);

        if (distance < minDistance && distance < magnetDistance) {
          minDistance = distance;
          nearestPoint = { x: rotatedX, y: rotatedY };
        }
      });
    } else if (shape.type === ShapeType.CIRCLE) {
      const angle = shape.rotation * (Math.PI / 180);
      const circlePoints = [
        { x: shape.x + shape.radiusX, y: shape.y },
        { x: shape.x - shape.radiusX, y: shape.y },
        { x: shape.x, y: shape.y + shape.radiusY },
        { x: shape.x, y: shape.y - shape.radiusY }
      ];

      circlePoints.forEach(point => {
        const rotatedX = (point.x - shape.x) * Math.cos(angle) - (point.y - shape.y) * Math.sin(angle) + shape.x;
        const rotatedY = (point.x - shape.x) * Math.sin(angle) + (point.y - shape.y) * Math.cos(angle) + shape.y;
        const distance = Math.sqrt((x - rotatedX) ** 2 + (y - rotatedY) ** 2);

        if (distance < minDistance && distance < magnetDistance) {
          minDistance = distance;
          nearestPoint = { x: rotatedX, y: rotatedY };
        }
      });
    } else if (shape.type === ShapeType.POLYGON) {
      const { x: centerX, y: centerY, radius, sides, rotation } = shape;
      const angleStep = 360 / sides;
      console.log("angleStep:" + angleStep);
      const initialAngle = rotation * (Math.PI / 180);

      for (let i = 0; i < sides; i++) {
        const angle = ((i * angleStep) * Math.PI / 180) + initialAngle;
        console.log(angle);
        const pointX = centerX + (radius * Math.cos(angle));
        const pointY = centerY + (radius * Math.sin(angle));
        const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);

        if (distance < minDistance && distance < magnetDistance) {
          minDistance = distance;
          nearestPoint = { x: pointX, y: pointY };
        }
      }
    }
  });

  return nearestPoint;
};

export const useMouseArea = ({ tool }) => {
  const dispatch = useDispatch();

  const [selectedArea, setSelectedArea] = useState(initialArea);
  const shapePreview = useRef(null);
  const layerPreviewRef = useRef(null);
  const mouseDown = useRef(false);

  const selectedObjects = useSelector(selectAllSelectedObjects);
  const [mSelectStarted, setMSelectStarted] = useState(false);

  const onMouseDown = (e) => {
    if (tool === Tool.GRAB) return;
    mouseDown.current = true;

    const stage = e.target.getStage();
    const pos = toStageRelPos(stage);

    if (e.target !== stage) {
      const shapeId = e.target.attrs.id;

      if (e.target.getParent().className !== "Transformer") {
        dispatch(selectStageObject({ id: shapeId }));
      }
    } else {
      dispatch(selectStageObject({ id: "" }));
    }

    if (!pos) return null;

    if (tool === Tool.TEXT) {
      const shape = new Text({
        id: nanoid(),
        type: ShapeType.TEXT,
        x: pos.x,
        y: pos.y,
        text: "Text",
        fontSize: 400,
        rotation: 0,
      });

      dispatch(addObjectToStage({ shape: Object.assign({}, shape) }));
      return;
    }

    const selectedArea = {
      visible: true,
      startX: pos.x,
      startY: pos.y,
      width: 0,
      height: 0,
      ...pos,
    };
    setSelectedArea(selectedArea);

    let shape = null;

    if (tool === Tool.RECTANGLE) {
      shape = new Rectangle({
        id: nanoid(),
        fill: "transparent",
        stroke: "black",
        strokeWidth: 2,
        rotation: 0,
        ...selectedArea,
      });
    }

    if (tool === Tool.CIRCLE) {
      shape = new Circle({
        id: nanoid(),
        fill: "transparent",
        stroke: "black",
        strokeWidth: 2,
        radiusX: 0,
        radiusY: 0,
        rotation: 0,
        ...pos,
      });
    }

    if (tool === Tool.PENCIL) {
      shape = new Line({
        id: nanoid(),
        fill: "transparent",
        stroke: "black",
        strokeWidth: 2,
        points: [pos.x, pos.y],
        rotation: 0,
        ...pos,
      });
    }

    if (tool === Tool.POLYGON) {
      shape = new Polygon({
        id: nanoid(),
        fill: "transparent",
        stroke: "black",
        strokeWidth: 2,
        rotation: 0,
        radius: 0,
        sides: 5,
        ...selectedArea,
      });
    }

    if (tool === Tool.ARROW) {
      const nearestPoint = findNearestPoint(pos.x, pos.y, shapes);
      const point = {x: pos.x, y: pos.y};
      if (nearestPoint) {
        point.x = nearestPoint.x;
        point.y = nearestPoint.y;
      }
      shape = new Arrow({
        id: nanoid(),
        stroke: "black",
        strokeWidth: 2,
        points: [point.x, point.y],
        rotation: 0,
        fill: 'black',
        ...pos,
      });
    }

    if (!shape) return;
    shapePreview.current = shape;

    switch (tool) {
      case Tool.RECTANGLE:
        layerPreviewRef.current?.add(new Konva.Rect(shape));
        break;
      case Tool.CIRCLE:
        layerPreviewRef.current?.add(
          new Konva.Ellipse({ ...shape, radiusX: 0, radiusY: 0 })
        );
        break;
      case Tool.POLYGON:
        layerPreviewRef.current?.add(new Konva.RegularPolygon({ ...shape }));
        break;
      case Tool.PENCIL:
        layerPreviewRef.current?.add(new Konva.Line({ ...shape, x: 0, y: 0 }));
        break;
      case Tool.ARROW:
        layerPreviewRef.current?.add(new Konva.Arrow({ ...shape, x: 0, y: 0 }));
        break;
      default:
        break;
    }
  };

  const shapes = useSelector(selectAllStageObjects); 
  const onMouseMove = (e) => {
    if (!mouseDown.current) return;

    const stage = e.target.getStage();
    const pos = toStageRelPos(stage);
    if (!pos) return;

    const { x, y, width, height } = getNewSelectAreaSize(pos, {
      x: selectedArea.startX,
      y: selectedArea.startY,
    });

    const rectSelection = getRectSize({ height, width, x, y });

    if (
      tool === Tool.POINTER &&
      (selectedObjects.length === 0 ||
        (selectedObjects.length > 0 && mSelectStarted))
    ) {
      setMSelectStarted(true);
      setSelectedArea({ ...selectedArea, ...rectSelection });
      dispatch(selectStageObjectsInArea({ box: rectSelection }));
      return;
    }

    const shape = shapePreview?.current;
    const shapeToEdit = layerPreviewRef?.current?.findOne(`#${shape?.id}`);

    if (!shapeToEdit || !shape) return;

    if (tool === Tool.RECTANGLE) {
      shapeToEdit.setAttrs(rectSelection);
      shapePreview.current = { ...shape, ...rectSelection };
    }

    if (tool === Tool.CIRCLE) {
      const circleSelection = getEllipseSize({ height, width, x, y });
      shapeToEdit.setAttrs(circleSelection);
      shapePreview.current = { ...shape, ...circleSelection };
    }

    if (tool === Tool.POLYGON) {
      const polygonSelection = {
        x: x - width / 2,
        y: y - height / 2,
        radius: width / 2,
      };
      shapeToEdit.setAttrs(polygonSelection);
      shapePreview.current = { ...shape, ...polygonSelection };
    }

    if (tool === Tool.PENCIL) {
      const points = shape.points.concat([pos.x, pos.y]);
      shape.points = points;
      shapeToEdit.setAttrs({ points });
    }

    if (tool === Tool.ARROW) {
      const points = [shape.points[0], shape.points[1], pos.x, pos.y];
      //shape.points = points;
      const nearestPoint = findNearestPoint(pos.x, pos.y, shapes);
      if (nearestPoint) {
        points[2] = nearestPoint.x;
        points[3] = nearestPoint.y;
      }
      shape.points = points;
      shapeToEdit.setAttrs({ points });
    }

    layerPreviewRef.current?.batchDraw();
  };

  
  const onMouseUp = () => {
    mouseDown.current = false;
    setMSelectStarted(false);
    if (tool !== Tool.POINTER && tool !== Tool.GRAB) {
      const shape = shapePreview.current;
      if (!shape) return;

      const shapeToEdit = layerPreviewRef?.current?.findOne(`#${shape?.id}`);
      shapeToEdit?.destroy();
      layerPreviewRef.current?.batchDraw();
      dispatch(
        addObjectToStage({
          shape:
            shape.type === ShapeType.LINE ? Object.assign({}, shape) : shape,
        })
      );
      shapePreview.current = null;
    }
    setSelectedArea(initialArea);
  };

  return { onMouseDown, onMouseMove, onMouseUp, layerPreviewRef, selectedArea };
};

const getNewSelectAreaSize = (start, end) => {
  const width = Math.abs(start.x - end.x);
  const height = Math.abs(start.y - end.y);
  const x = (start.x + end.x) / 2;
  const y = (start.y + end.y) / 2;

  return { x, y, width, height };
};
