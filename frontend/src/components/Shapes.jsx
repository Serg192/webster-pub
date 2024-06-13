import React from "react";
import { ShapeType, Tool } from "../types";
import {
  Ellipse,
  Line,
  Rect,
  Text,
  RegularPolygon,
  Arrow,
  Image,
} from "react-konva";

import Konva from "konva";

const Shapes = ({ shapes, tool, onDragEnd, onSelect }) => {
  const common = {
    draggable: tool === Tool.POINTER,
    onDragEnd,
    onClick: (e) => {
      onSelect(e.target);
    },
  };
  return shapes.map((shape) => {
    const active = shape.selected
      ? { shadowColor: "blue", shadowBlur: 10 }
      : {};

    const props = { ...common, ...shape, ...active };
    switch (shape.type) {
      case ShapeType.IMAGE:
        const imageObj = new window.Image();
        imageObj.src = props.image;
        imageObj.crossOrigin = "Anonymous";
        props.image = imageObj;
        return <Image key={shape.id} {...props} />;
      case ShapeType.RECTANGLE:
        return <Rect key={shape.id} {...props} />;
      case ShapeType.POLYGON:
        return <RegularPolygon key={shape.id} {...props} />;
      case ShapeType.CIRCLE:
        return (
          <Ellipse
            key={shape.id}
            {...props}
            height={shape.radiusY * 2}
            width={shape.radiusX * 2}
          />
        );
      case ShapeType.ARROW:
        return <Arrow key={shape.id} {...props} x={0} y={0}/>;
      case ShapeType.TEXT:
        return <Text key={shape.id} {...props} />;
      case ShapeType.LINE:
        return <Line key={shape.id} {...props} x={0} y={0} />;
      default:
        return null;
    }
  });
};

export default Shapes;
