import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import { Box } from "@mui/material";
import { Tool } from "../types";
import { useChangeScale } from "../hooks/useChangeScale";
import { useMouseArea } from "../hooks/useMouseArea";
import Shapes from "./Shapes";
import { ShapeType } from "../types";

import { useDispatch, useSelector } from "react-redux";
import {
  stageHandleShapeDragEnd,
  selectAllStageObjects,
  selectStageObject,
  selectSelectedShapeId,
  stageHandleTransformRectEnd,
  stageHandleTransformCircEnd,
  stageHandleTransformTextEnd,
  stageHandleTransformLineEnd,
  stageHandleTransformPoliEnd,
  stageHandleTransformArroEnd,
} from "../features/canvas/stageSlice";

import {
  selectCurrentCanvasWidth,
  selectCurrentCanvasHeight,
} from "../features/canvas/canvasSlice";

const Canvas = ({ tool, stageRef }) => {
  const selectedShapeId = useSelector(selectSelectedShapeId);
  const [selectedShape, setSelectedShape] = useState(null);
  const transformerRef = useRef();
  const dispatch = useDispatch();

  const containerRef = useRef(null);

  const { handleWheel, stagePos, stageScale } = useChangeScale();
  const { layerPreviewRef, selectedArea, ...handlers } = useMouseArea({
    tool,
  });

  const shapes = useSelector(selectAllStageObjects);

  useEffect(() => {
    dispatch(selectStageObject({ id: "" }));
  }, [tool]);

  useEffect(() => {
    if (selectedShape && tool !== Tool.GRAB) {
      transformerRef.current.nodes([selectedShape]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedShape]);
  useEffect(() => {
    if (!selectedShapeId || selectedShapeId === "main-stage") {
      setSelectedShape(null);
    }
  }, [selectedShapeId]);

  const rectWidth = useSelector(selectCurrentCanvasWidth);
  const rectHeight = useSelector(selectCurrentCanvasHeight);

  const handleShapeDragEnd = (event) => {
    setSelectedShape(null);
    const id = event.target.attrs.id;
    const x = event.target.x();
    const y = event.target.y();

    dispatch(stageHandleShapeDragEnd({ id, x, y }));
  };

  const handleTransformEnd = (event) => {
    try {
      const node = event.target;
      const id = node.attrs.id;
      const x = node.x();
      const y = node.y();

      const rotation = node.rotation();
      switch (node.attrs.type) {
        case ShapeType.RECTANGLE:
        case ShapeType.IMAGE:
          const width = node.width() * node.scaleX();
          const height = node.height() * node.scaleY();
          dispatch(
            stageHandleTransformRectEnd({ id, x, y, width, height, rotation })
          );
          break;

        case ShapeType.CIRCLE:
          const radiusX = node.radiusX() * node.scaleX();
          const radiusY = node.radiusY() * node.scaleY();
          dispatch(
            stageHandleTransformCircEnd({
              id,
              x,
              y,
              radiusX,
              radiusY,
              rotation,
            })
          );
          break;
        case ShapeType.TEXT:
          const fontSize = node.fontSize() * node.scaleX();
          dispatch(
            stageHandleTransformTextEnd({ id, x, y, fontSize, rotation })
          );
          break;
        case ShapeType.LINE:
          const points = node
            .points()
            .map((point, index) =>
              index % 2 === 0 ? point * node.scaleX() : point * node.scaleY()
            );
          dispatch(stageHandleTransformLineEnd({ id, x, y, points, rotation }));
          break;
        case ShapeType.ARROW:
          const pointsA = node
            .points()
            .map((point, index) =>
              index % 2 === 0 ? point * node.scaleX() : point * node.scaleY()
            );
          dispatch(stageHandleTransformArroEnd({ id, x, y, pointsA, rotation }));
          break;
        case ShapeType.POLYGON:
          const radius = node.radius() * node.scaleX();
          dispatch(stageHandleTransformPoliEnd({ id, x, y, radius, rotation }));
          break;
        default:
          break;
      }
      node.scaleX(1);
      node.scaleY(1);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box
      ref={containerRef}
      sx={{
        backgroundImage: `
          linear-gradient(45deg, #e5e4e2 25%, transparent 25%), 
          linear-gradient(-45deg, #e5e4e2 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #e5e4e2 75%), 
          linear-gradient(-45deg, transparent 75%, #e5e4e2 75%)`,
        backgroundSize: "20px 20px",
        backgroundPosition: `
          0 0, 
          0 10px, 
          10px -10px, 
          -10px 0px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Stage
        ref={stageRef}
        {...stagePos}
        {...handlers}
        scale={{ x: stageScale, y: stageScale }}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          cursor: tool === Tool.GRAB ? "grab" : "default",
        }}
        onWheel={handleWheel}
        draggable={tool === Tool.GRAB}
      >
        <Layer>
          <Rect
            id="main-stage"
            x={0}
            y={0}
            width={rectWidth}
            height={rectHeight}
            fill="white"
          />
          <Shapes
            shapes={shapes}
            tool={tool}
            onDragEnd={handleShapeDragEnd}
            onSelect={setSelectedShape}
          />
          {selectedShape && (
            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              rotationSnaps={[0, 90, 180, 270]}
              onTransformEnd={handleTransformEnd}
            />
          )}
        </Layer>
        <Layer ref={layerPreviewRef}></Layer>
        <Layer>
          {selectedArea.visible && (
            <Rect
              {...selectedArea}
              opacity={0.2}
              fill="gray"
              stroke="black"
              strokeWidth={1}
            />
          )}
        </Layer>
      </Stage>
    </Box>
  );
};

export default Canvas;
