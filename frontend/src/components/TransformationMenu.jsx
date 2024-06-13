import React from "react";

import { ShapeType } from "../types";
import { Stack, Typography } from "@mui/material";

const TransformationMenu = ({
  selectedShapeType,
  pos,
  size,
  setPos,
  setSize,
  points,
  setPoints,
  handleTransformationUpdate,
}) => {
  return (
    <Stack
      direction="column"
      padding={1}
      spacing={1}
      minWidth={200}
      alignItems={"end"}
    >
      <Stack direction="row" spacing={1}>
        <Typography variant="h5">x:</Typography>
        <input
          type="number"
          value={pos.x}
          onChange={(e) => {
            setPos({ ...pos, x: e.target.value });
            handleTransformationUpdate({
              ...pos,
              ...size,
              x: e.target.value,
              points,
            });
          }}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography variant="h5">y:</Typography>
        <input
          type="number"
          value={pos.y}
          onChange={(e) => {
            setPos({ ...pos, y: e.target.value });
            handleTransformationUpdate({
              ...pos,
              ...size,
              y: e.target.value,
              points,
            });
          }}
        />
      </Stack>

      {selectedShapeType === ShapeType.POLYGON && (
        <>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5">radius</Typography>
            <input
              type="number"
              value={size.w}
              onChange={(e) => {
                setSize({ ...size, w: e.target.value });
                handleTransformationUpdate({
                  ...pos,
                  ...size,
                  w: e.target.value,
                  points,
                });
              }}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5">points</Typography>
            <input
              type="number"
              value={points}
              onChange={(e) => {
                setPoints(e.target.value);
                handleTransformationUpdate({
                  ...pos,
                  ...size,
                  points: e.target.value,
                });
              }}
            />
          </Stack>
        </>
      )}
      {selectedShapeType !== ShapeType.POLYGON && (
        <>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5">
              {selectedShapeType === ShapeType.RECTANGLE ? "width" : "radiusX"}:
            </Typography>
            <input
              type="number"
              value={size.w}
              onChange={(e) => {
                setSize({ ...size, w: e.target.value });
                handleTransformationUpdate({
                  ...pos,
                  ...size,
                  w: e.target.value,
                });
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Typography variant="h5">
              {selectedShapeType === ShapeType.RECTANGLE ? "height" : "radiusY"}
              :
            </Typography>
            <input
              type="number"
              value={size.h}
              onChange={(e) => {
                setSize({ ...size, h: e.target.value });
                handleTransformationUpdate({
                  ...pos,
                  ...size,
                  h: e.target.value,
                });
              }}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default TransformationMenu;
