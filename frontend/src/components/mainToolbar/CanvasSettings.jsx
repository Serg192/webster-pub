import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Stack,
  InputLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectCurrentCanvas,
  setCanvasSize,
  setCanvas,
} from "../../features/canvas/canvasSlice";
import { useUpdateCanvasMutation } from "../../features/canvas/canvasApiSlice";
import { styled } from "@mui/system";

import { CANVAS_SIZE_TEMPLATES } from "../../const/canvas";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(3),
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  maxWidth: "400px",
  margin: "0 auto",
  width: "100%",
}));

const CanvasSettings = () => {
  const dispatch = useDispatch();

  const canvasState = useSelector(selectCurrentCanvas);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const [updateCanvas] = useUpdateCanvasMutation();

  useEffect(() => {
    setName(canvasState.name);
    setDescription(canvasState.description);
    setSelectedSize(`${canvasState.width}|${canvasState.height}`);
    setWidth(canvasState.width);
    setHeight(canvasState.height);
  }, [canvasState]);

  const handleSettingsSave = async () => {
    if (canvasState._id) {
      if (name.length <= 4 || name.length >= 100) {
        setNameError(true);
      } else if (description.length >= 500) {
        setDescriptionError(true);
      } else {
        try {
          const response = await updateCanvas({
            id: canvasState._id,
            data: {
              width,
              height,
              name,
              description,
            },
          });
          const canvas = response.data.data;
          dispatch(setCanvas({ ...canvas }));
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      dispatch(setCanvasSize({ width, height }));
    }
  };

  return (
    <Container>
      <Stack direction="column" width="100%" spacing={1}>
        <TextField
          id="name"
          label="Name"
          type="text"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          value={name}
          error={nameError}
          helperText={nameError ? "Nname should not be empty" : ""}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(name.length <= 4 || name.length >= 100);
          }}
        />

        <TextField
          id="description"
          label="Description"
          type="text"
          placeholder="Description"
          required
          fullWidth
          multiline
          rows={9}
          value={description}
          error={descriptionError}
          helperText={descriptionError ? "Description should not be empty" : ""}
          onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionError(e.target.value.length >= 500);
          }}
        />

        <InputLabel id="size-select-label">Select Size</InputLabel>
        <Select
          labelId="size-select-label"
          id="size-select"
          value={selectedSize}
          onChange={(e) => {
            const size = e.target.value.split("|");
            setWidth(size[0]);
            setHeight(size[1]);
            setSelectedSize(e.target.value);
          }}
          label="Select Size"
        >
          {CANVAS_SIZE_TEMPLATES.map((t) => (
            <MenuItem value={`${t.width}|${t.height}`}>{t.name}</MenuItem>
          ))}
        </Select>

        <Stack direction="row" spacing={1}>
          <TextField
            id="width"
            label="Width"
            type="number"
            placeholder="Width"
            value={width}
            inputProps={{ min: 1, max: 5000 }}
            onChange={(e) => {
              let v = e.target.value;
              if (v < 1) v = 1;
              if (v > 5000) v = 5000;
              setWidth(v);
            }}
          />
          <TextField
            id="height"
            label="Height"
            type="number"
            placeholder="height"
            value={height}
            inputProps={{ min: 1, max: 5000 }}
            onChange={(e) => {
              let v = e.target.value;
              if (v < 1) v = 1;
              if (v > 5000) v = 5000;
              setHeight(v);
            }}
          />
        </Stack>

        <Button variant="contained" color="info" onClick={handleSettingsSave}>
          Save
        </Button>
      </Stack>
    </Container>
  );
};

export default CanvasSettings;
