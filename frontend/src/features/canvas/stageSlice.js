import { createSlice } from "@reduxjs/toolkit";
import { isShapeInBox } from "../../helpers/isShapeInBox";

import { Tool } from "../../types";

const initialState = {
  selectedTool: Tool.POINTER,
  stagePosition: { x: 0, y: 0 },
  stageScale: 1,
  stageObjects: [],
  stageImgUrls: [],
  selectedShapeId: null,

  //History
  shouldSync: false,
  currentPosition: 0,
  history: [[]],
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setTool(state, { payload }) {
      state.selectedTool = payload.tool;
    },
    setStagePosition(state, { payload }) {
      const { x, y } = payload;
      state.stagePosition = { x, y };
    },
    setStageScale(state, { payload }) {
      state.stageScale = payload.scale;
    },

    setHistory(state, { payload }) {
      const { history, position } = payload;
      state.history = history;
      state.currentPosition = position;
      state.stageObjects = history[position];
    },

    setImages(state, { payload }) {
      state.stageImgUrls = payload.imgs;
    },

    setStageObjects(state, { payload }) {
      state.stageObjects = payload.objects;
    },

    addStageImage(state, { payload }) {
      state.stageImgUrls.push(payload.img);
    },

    setShouldSync(state, { payload }) {
      state.shouldSync = payload.shouldSync;
    },
    //highly inefficient approach
    saveToHistory(state) {
      state.shouldSync = true;
      if (state.currentPosition < state.history.length - 1) {
        state.history = state.history.slice(0, state.currentPosition + 1);
      }

      state.history.push([...state.stageObjects]);
      state.currentPosition++;
    },

    resetStage(state) {
      Object.assign(state, initialState);
    },

    addObjectToStage(state, { payload }) {
      state.stageObjects.push(payload.shape);
      stageSlice.caseReducers.saveToHistory(state);
    },

    removeObjectFromStage(state, { payload }) {
      state.stageObjects = state.stageObjects.filter(
        (obj) => obj.id !== payload.id
      );
      stageSlice.caseReducers.saveToHistory(state);
    },

    updateStageObject(state, { payload }) {
      const index = state.stageObjects.findIndex(
        (obj) => obj.id === payload.id
      );

      if (index !== -1) {
        state.stageObjects[index] = {
          ...state.stageObjects[index],
          ...payload.shape,
        };
      }
      stageSlice.caseReducers.saveToHistory(state);
    },

    selectStageObject(state, { payload }) {
      let selectedShapeId =
        state.selectedShapeId === payload.id ? null : payload.id;
      state.stageObjects = state.stageObjects.map((shape) => {
        if (shape.id === payload.id) {
          return { ...shape, selected: true };
        }
        return { ...shape, selected: false };
      });
      state.selectedShapeId = selectedShapeId;
    },

    selectStageObjectsInArea(state, { payload }) {
      state.stageObjects = state.stageObjects.map((shape) => {
        return {
          ...shape,
          selected: isShapeInBox(shape, payload.box),
        };
      });
    },

    stageHandleShapeDragEnd(state, { payload }) {
      const { id, x, y } = payload;
      state.stageObjects = state.stageObjects.map((shape) =>
        shape.id === id ? { ...shape, x, y } : shape
      );
      stageSlice.caseReducers.saveToHistory(state);
    },

    undo(state) {
      if (state.currentPosition > 0) {
        state.currentPosition--;
        state.stageObjects = state.history[state.currentPosition];
      }
    },

    redo(state) {
      if (state.currentPosition < state.history.length - 1) {
        state.currentPosition++;
        state.stageObjects = state.history[state.currentPosition];
      }
    },
    stageHandleTransformRectEnd(state, { payload }) {
      const { id, x, y, width, height, rotation } = payload;
      state.stageObjects = state.stageObjects.map((shape) =>
        shape.id === id ? { ...shape, x, y, width, height, rotation } : shape
      );
    },
    stageHandleTransformCircEnd(state, { payload }) {
      const { id, x, y, radiusX, radiusY, rotation } = payload;
      state.stageObjects = state.stageObjects.map((shape) =>
        shape.id === id ? { ...shape, x, y, radiusX, radiusY, rotation } : shape
      );
    },
    stageHandleTransformTextEnd(state, { payload }) {
      const { id, x, y, fontSize, rotation } = payload;
      state.stageObjects = state.stageObjects.map((shape) =>
        shape.id === id ? { ...shape, x, y, fontSize, rotation } : shape
      );
    },
    stageHandleTransformLineEnd(state, { payload }) {
      const { id, x, y, points, rotation } = payload;
      state.stageObjects = state.stageObjects.map((shape) =>
        shape.id === id ? { ...shape, x, y, points, rotation } : shape
      );
    },
    stageHandleTransformArroEnd(state, { payload }) {
      const { id, x, y, points, rotation } = payload;
      state.stageObjects = state.stageObjects.map((shape) =>
        shape.id === id ? { ...shape, x, y, points, rotation } : shape
      );
    },
    stageHandleTransformPoliEnd(state, { payload }) {
      const { id, x, y, radius, rotation } = payload;
      state.stageObjects = state.stageObjects.map((shape) =>
        shape.id === id ? { ...shape, x, y, radius, rotation } : shape
      );
    },
  },
});

export const {
  setTool,
  setStageScale,
  setStagePosition,
  addObjectToStage,
  removeObjectFromStage,
  updateStageObject,
  selectStageObject,
  selectStageObjectsInArea,
  stageHandleShapeDragEnd,
  setHistory,
  setStageObjects,
  redo,
  undo,
  stageHandleTransformRectEnd,
  stageHandleTransformCircEnd,
  stageHandleTransformTextEnd,
  stageHandleTransformLineEnd,
  stageHandleTransformPoliEnd,
  stageHandleTransformArroEnd,
  addStageImage,
  setImages,
  setShouldSync,
  resetStage,
} = stageSlice.actions;
export default stageSlice.reducer;

export const selectCurrentStageTool = (state) => state.stage.selectedTool;
export const selectStagePosition = (state) => state.stage.stagePosition;
export const selectStageScale = (state) => state.stage.stageScale;
export const selectAllStageObjects = (state) => state.stage.stageObjects;
export const selectSelectedShapeId = (state) => state.stage.selectedShapeId;
export const selectStageHistory = (state) => state.stage.history;
export const selectHistoryPos = (state) => state.stage.currentPosition;
export const selectStageImgUrls = (state) => state.stage.stageImgUrls;
export const selectShouldSync = (state) => state.stage.shouldSync;
export const selectAllSelectedObjects = (state) =>
  state.stage.stageObjects.filter((obj) => obj.selected);
export const selectStateObjectById = (id) => (state) =>
  state.stage.stageObjects.find((obj) => obj.id === id);
