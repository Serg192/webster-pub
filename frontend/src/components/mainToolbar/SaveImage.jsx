import React, { useState } from "react";

import { useSelector } from "react-redux";
import { Box, Button, Select, MenuItem, Switch, FormControlLabel } from "@mui/material";
import SimCardDownloadRoundedIcon from "@mui/icons-material/SimCardDownloadRounded";
import {
  selectCurrentCanvasWidth,
  selectCurrentCanvasHeight,
} from "../../features/canvas/canvasSlice";

const SaveImage = ({ stageRef }) => {
  const [imageFormat, setImageFormat] = useState("png");
  const [transparentBackground, setTransparentBackground] = useState(false);

  const canvasSize = {
    width: useSelector(selectCurrentCanvasWidth),
    height: useSelector(selectCurrentCanvasHeight),
  };

  const handleSaveImage = () => {
    const stage = stageRef.current;

    const stageCopy = stage.clone();

    stageCopy.setAttrs({
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    });

    if (transparentBackground) {
      stageCopy.findOne("#main-stage").fill("transparent");
    }

    let dataURL = stageCopy.toDataURL({
      x: 0,
      y: 0,
      ...canvasSize,
      mimeType: `image/${imageFormat}`,
    });
    const link = document.createElement("a");
    link.download = `export.${imageFormat}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Select
        value={imageFormat}
        onChange={(event) => setImageFormat(event.target.value)}
        variant="outlined"
        size="small"
      >
        <MenuItem value="jpeg">JPEG</MenuItem>
        <MenuItem value="png">PNG</MenuItem>
        <MenuItem value="svg">SVG</MenuItem>
        <MenuItem value="webp">WEBP</MenuItem>
        <MenuItem value="bmp">BMP</MenuItem>
        <MenuItem value="tiff">TIFF</MenuItem>
      </Select>
      <FormControlLabel
        control={
          <Switch
          checked={transparentBackground}
          onChange={(event) => setTransparentBackground(event.target.checked)}
          />
          }
        label="Transparent Background"
      />
      <Button
        variant="contained"
        disableElevation
        startIcon={<SimCardDownloadRoundedIcon />}
        onClick={handleSaveImage}
      >
        Download Image
      </Button>
    </Box>
  );
};

export default SaveImage;
