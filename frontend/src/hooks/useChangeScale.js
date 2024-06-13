import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectStagePosition,
  selectStageScale,
  setStageScale,
} from "../features/canvas/stageSlice";

import { SCALE_SPEED, SCALE_MIN_MAX } from "../const/canvas";

export const useChangeScale = () => {
  const dispatch = useDispatch();

  //for smooth animation
  const [localStagePos, setLocalStagePos] = useState({ x: 0, y: 0 });
  const [localStageScale, setLocalStageScale] = useState(1);

  const stageScale = useSelector(selectStageScale);
  const stagePosition = useSelector(selectStagePosition);

  useEffect(() => {
    setLocalStageScale(stageScale);
  }, [stageScale]);

  useEffect(() => {
    setLocalStagePos(stagePosition);
  }, [stagePosition]);

  const limitScale = (current, min, max) =>
    Math.max(min, Math.min(max, current));

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();

    if (!stage) return;

    const oldScale = stage.scaleX();
    const cursorPosition = stage?.getPointerPosition();

    const cursorPositionTo = {
      x: (cursorPosition.x - stage.x()) / oldScale,
      y: (cursorPosition.y - stage.y()) / oldScale,
    };

    const newScale =
      e.evt.deltaY < 0 ? oldScale * SCALE_SPEED : oldScale / SCALE_SPEED;

    const limitedScale = limitScale(
      newScale,
      SCALE_MIN_MAX.min,
      SCALE_MIN_MAX.max
    );

    setLocalStageScale(limitedScale);
    dispatch(setStageScale({ scale: limitedScale }));

    setLocalStagePos({
      x: cursorPosition.x - cursorPositionTo.x * limitedScale,
      y: cursorPosition.y - cursorPositionTo.y * limitedScale,
    });
  };

  return { handleWheel, stagePos: localStagePos, stageScale: localStageScale };
};
