export const isShapeInBox = (shape, box) => {
  return (
    shape.x >= box.x &&
    shape.x <= box.x + box.width &&
    shape.y >= box.y &&
    shape.y <= box.y + box.height
  );
};
