import React from "react";
import { Stack, Box, Modal, Typography, Button } from "@mui/material";
import { useDeleteCanvasMutation } from "../../features/canvas/canvasApiSlice";

const ConfirmCanvasDelete = ({
  isOpen,
  setIsOpen,
  name,
  id,
  setDelCanvasName,
  setDelCanvasId,
  setShouldUpdateCanvases,
}) => {
  const [deleteCanvas] = useDeleteCanvasMutation();

  const handleClose = () => {
    setDelCanvasId(null);
    setDelCanvasName(null);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteCanvas({ id }).unwrap();
      handleClose();
      setShouldUpdateCanvases(true);
    } catch (err) {
      console.log(err);
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
          minWidth: "600px",
          overflow: "auto",
        }}
      >
        <Stack direction="column" alignItems="center" width="100%">
          <Typography variant="h3">
            Are you sure you want to delete '{name}'?
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            width="100%"
            spacing={5}
            mt={3}
          >
            <Button
              variant="contained"
              color="warning"
              sx={{ width: "50%" }}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => handleClose()}
              sx={{ width: "50%" }}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmCanvasDelete;
