import { createSlice } from "@reduxjs/toolkit";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
} from "../../const/canvas";

const initialState = {
  _id: null,
  name: "",
  width: DEFAULT_CANVAS_WIDTH,
  height: DEFAULT_CANVAS_HEIGHT,
  thumbnail: null,
  description: "",
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setCanvas(state, { payload }) {
      state._id = payload._id;
      state.name = payload.name;
      state.description = payload.description;
      state.width = payload.width;
      state.height = payload.height;
      state.thumbnail = payload.thumbnail;
    },

    setThumbnail(state, { payload }) {
      state.thumbnail = payload.url;
    },

    resetCanvas(state) {
      state._id = null;
      state.name = null;
      state.description = null;
      state.content = null;
      state.width = DEFAULT_CANVAS_WIDTH;
      state.height = DEFAULT_CANVAS_HEIGHT;
    },
    setCanvasSize(state, { payload }) {
      state.width = payload.width;
      state.height = payload.height;
    },
  },
});

export const { setCanvas, resetCanvas, setCanvasSize, setScale, setThumbnail } =
  canvasSlice.actions;
export default canvasSlice.reducer;

export const selectCurrentCavasId = (state) => state.canvas._id;
export const selectCurrentCanvasName = (state) => state.canvas.name;
export const selectCurrentCanvasDescription = (state) =>
  state.canvas.description;
export const selectCurrentCanvasWidth = (state) => state.canvas.width;
export const selectCurrentCanvasHeight = (state) => state.canvas.height;
export const selectCurrentCanvasThumbnail = (state) => state.canvas.thumbnail;
export const selectCurrentCanvas = (state) => state.canvas;
