import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllStageObjects,
  selectCurrentStageTool,
  selectHistoryPos,
  selectShouldSync,
  selectStageHistory,
  selectStageImgUrls,
  setHistory,
  setImages,
  setShouldSync,
  setStageObjects,
} from "../features/canvas/stageSlice";
import {
  selectCurrentCanvasHeight,
  selectCurrentCanvasThumbnail,
  selectCurrentCanvasWidth,
  selectCurrentCavasId,
  setCanvas,
  setThumbnail,
} from "../features/canvas/canvasSlice";
import {
  useLoadCanvasMutation,
  useUpdateCanvasMutation,
  useUploadCanvasPreviewImgMutation,
} from "../features/canvas/canvasApiSlice";
import { Tools, Canvas, Toolbar, TopToolBar } from "../components";
import { Box, Stack } from "@mui/material";

import { useLocation } from "react-router-dom";
import { stageToImageBlob } from "../helpers/stageToImageBlob";

const Editor = () => {
  const stageRef = useRef();
  const activeTool = useSelector(selectCurrentStageTool);
  const historyPos = useSelector(selectHistoryPos);
  const obj = useSelector(selectAllStageObjects);
  const thumbnail = useSelector(selectCurrentCanvasThumbnail);
  const canvasSize = {
    width: useSelector(selectCurrentCanvasWidth),
    height: useSelector(selectCurrentCanvasHeight),
  };

  const shouldSync = useSelector(selectShouldSync);
  const cid = useSelector(selectCurrentCavasId);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const dispatch = useDispatch();

  const [loadCanvas] = useLoadCanvasMutation();
  const [updateCanvas] = useUpdateCanvasMutation();
  const [uploadThumbnail] = useUploadCanvasPreviewImgMutation();

  const loadCanvasData = async (id) => {
    try {
      const response = await loadCanvas({ id });

      const { currentState, imageUrls, ...canvas } = response.data.data;

      dispatch(setStageObjects({ objects: currentState }));
      dispatch(setImages({ imgs: imageUrls }));
      dispatch(setCanvas({ ...canvas }));
    } catch (err) {
      console.log(err);
    }
  };

  const updateHistory = async () => {
    if (!cid) return;

    try {
      const response = await updateCanvas({
        id: cid,
        data: {
          currentState: obj,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const canvasId = queryParams.get("canvas");
    if (canvasId) loadCanvasData(canvasId);
  }, []);

  const uploadCanvasThumbnail = async (formData) => {
    try {
      const response = await uploadThumbnail({
        id: cid,
        formData,
      }).unwrap();

      dispatch(setThumbnail({ url: response.url }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (shouldSync && cid) {
      console.log("UPDATE HISTORY", cid);
      if (historyPos !== 0) updateHistory();

      if (historyPos === 5 && !thumbnail) {
        const blob = stageToImageBlob(stageRef, canvasSize);

        const preview = URL.createObjectURL(blob);
        console.log("PREVIEW", preview);
        const formData = new FormData();
        formData.append("image", blob);
        uploadCanvasThumbnail(formData);
      }

      dispatch(setShouldSync({ shouldSync: false }));
    }
  }, [shouldSync]);

  return (
    <Stack direction="row" sx={{ height: "100vh" }}>
      <Toolbar stageRef={stageRef} />
      <Tools active={activeTool} />
      <Stack direction="column" sx={{ flex: 1 }}>
        <TopToolBar />
        <Canvas stageRef={stageRef} tool={activeTool} />
      </Stack>
    </Stack>
  );
};

export default Editor;
