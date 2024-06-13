export const getRectSize = ({ height, width, x, y }) => ({
  x: x - width / 2,
  y: y - height / 2,
  width,
  height,
});

export const getEllipseSize = ({ height, width, x, y }) => ({
  x,
  y,
  radiusX: width / 2,
  radiusY: height / 2,
});
