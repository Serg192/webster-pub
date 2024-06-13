import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { Image } from "../../types";
import { nanoid } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "react-redux";
import {
  addObjectToStage,
  addStageImage,
  selectStageImgUrls,
} from "../../features/canvas/stageSlice";
import { selectCurrentCavasId } from "../../features/canvas/canvasSlice";
import { useUploadStageImgMutation } from "../../features/canvas/canvasApiSlice";

const ImportImage = () => {
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const imgs = useSelector(selectStageImgUrls);
  const cid = useSelector(selectCurrentCavasId);

  const [uploadImage] = useUploadStageImgMutation();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await uploadImage({
          id: cid,
          formData,
        }).unwrap();

        dispatch(addStageImage({ img: response.url }));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleImageClick = (src) => {
    const image = new window.Image();
    image.src = src;
    image.onload = () => {
      const ratio = image.width / image.height;
      const shape = new Image({
        id: nanoid(),
        x: 0,
        y: 0,
        src,
        width: image.width / 2,
        height: image.width / 2 / ratio,
      });
      dispatch(addObjectToStage({ shape }));
    };
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Button
        variant="contained"
        disableElevation
        sx={{ mb: 1 }}
        startIcon={<CloudUploadRoundedIcon />}
        onClick={handleButtonClick}
      >
        Upload Image
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      <Stack
        direction="column"
        spacing={2}
        sx={{
          maxHeight: "80%",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
        }}
      >
        {imgs?.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            sx={{
              width: "100%",
              borderRadius: 2,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default ImportImage;
