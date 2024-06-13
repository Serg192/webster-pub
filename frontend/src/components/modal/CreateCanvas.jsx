import React, { useState } from "react";
import {
  Stack,
  Button,
  Modal,
  Box,
  Select,
  TextField,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCreateCanvasMutation } from "../../features/canvas/canvasApiSlice";
import { CANVAS_SIZE_TEMPLATES } from "../../const/canvas";

const CreateCanvas = ({ isOpen, setIsOpen }) => {
  const [selectedSize, setSelectedSize] = useState(
    `${CANVAS_SIZE_TEMPLATES[0].width}|${CANVAS_SIZE_TEMPLATES[0].height}`
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [createCanvas] = useCreateCanvasMutation();

  const navigate = useNavigate();

  const handleClose = () => {
    setName("");
    setDescription("");
    setNameError(false);
    setDescriptionError(false);
    setIsOpen(false);
  };

  const handleCreateCanvas = async () => {
    setNameError(false);
    setDescriptionError(false);

    if (name.length <= 4 || name.length >= 100) {
      setNameError(true);
    } else if (description.length >= 500) {
      setDescriptionError(true);
    } else {
      //handle create

      try {
        const size = selectedSize.split("|");
        const response = await createCanvas({
          data: {
            name,
            description,
            width: Number(size[0]),
            height: Number(size[1]),
          },
        });
        handleClose();
        navigate(`/edit?canvas=${response.data.data._id}`);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Modal open={isOpen}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          maxHeight: "100vh",
          overflowY: "auto",
          p: 4,
          minWidth: "500px",
          overflow: "auto",
        }}
      >
        <Stack direction="column">
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
            helperText={
              descriptionError ? "Description should not be empty" : ""
            }
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
            onChange={(e) => setSelectedSize(e.target.value)}
            label="Select Size"
          >
            {CANVAS_SIZE_TEMPLATES.map((t) => (
              <MenuItem value={`${t.width}|${t.height}`}>{t.name}</MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack direction="row" justifyContent="center" spacing={5} mt={3}>
          <Button
            variant="contained"
            color="info"
            sx={{ width: "50%" }}
            onClick={() => handleCreateCanvas()}
          >
            Create
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleClose}
            sx={{ width: "50%" }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateCanvas;
