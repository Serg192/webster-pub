export const toStageRelPos = (stage) => {
  if (!stage) return null;

  const transform = stage.getAbsoluteTransform().copy();
  transform.invert();
  const position = stage.getStage().getPointerPosition();

  if (!position) return null;
  return transform.point(position);
};
