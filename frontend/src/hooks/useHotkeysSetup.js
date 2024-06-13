import { useHotkeys } from "react-hotkeys-hook";
import { useSelector, useDispatch } from "react-redux";
import { selectStageObject, setTool } from "../features/canvas/stageSlice";
import { Tool } from "../types";

import {
  selectAllSelectedObjects,
  removeObjectFromStage,
  updateStageObject,
  undo,
  redo,
} from "../features/canvas/stageSlice";

const useHotkeySetup = () => {
  const dispatch = useDispatch();
  const objects = useSelector(selectAllSelectedObjects);

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  const handleDelete = () => {
    const ids = objects.map((obj) => obj.id);

    for (let id of ids) {
      dispatch(removeObjectFromStage({ id }));
    }
    dispatch(selectStageObject(""));
  };

  const handlePointer = () => {
    dispatch(setTool({ tool: Tool.POINTER }));
  };

  const handleGrad = () => {
    dispatch(setTool({ tool: Tool.GRAB }));
  };

  const handleRectangle = () => {
    dispatch(setTool({ tool: Tool.RECTANGLE }));
  };

  const handlePolygon = () => {
    dispatch(setTool({ tool: Tool.POLYGON }));
  };

  const handleCircle = () => {
    dispatch(setTool({ tool: Tool.CIRCLE }));
  };

  const handleText = () => {
    dispatch(setTool({ tool: Tool.TEXT }));
  };

  const handlePencil = () => {
    dispatch(setTool({ tool: Tool.PENCIL }));
  };

  const handleArrow = () => {
    dispatch(setTool({ tool: Tool.ARROW }));
  };

  useHotkeys("ctrl+Z", () => handleUndo());
  useHotkeys("ctrl+Y", () => handleRedo());
  useHotkeys("delete", () => handleDelete());
  useHotkeys("alt+Q", () => handlePointer());
  useHotkeys("alt+W", () => handleGrad());
  useHotkeys("alt+Z", () => handleRectangle());
  useHotkeys("alt+X", () => handlePolygon());
  useHotkeys("alt+C", () => handleCircle());
  useHotkeys("alt+V", () => handleArrow());
  useHotkeys("alt+B", () => handleText());
  useHotkeys("alt+N", () => handlePencil());
};

export default useHotkeySetup;
