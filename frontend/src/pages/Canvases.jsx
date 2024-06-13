import React, { useState, useEffect } from "react";
import { Grid, Stack, Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useLoadCanvasesMutation } from "../features/canvas/canvasApiSlice";
import { useNavigate } from "react-router-dom";
import {
  CanvasPreview,
  ConfirmCanvasDelete,
  CreateCanvas,
} from "../components";
import { setHistory } from "../features/canvas/stageSlice";
import { resetCanvas } from "../features/canvas/canvasSlice";

const Canvases = () => {
  const [canvases, setCanvases] = useState([]);
  const navigate = useNavigate();
  const userData = useSelector(selectCurrentUser);

  const dispatch = useDispatch();

  const [isDelModOpen, setIsDelModOpen] = useState(false);
  const [delCanvasId, setDelCanvasId] = useState(null);
  const [delCanvasName, setDelCanvasName] = useState(null);
  const [shouldUpdateCanvases, setShouldUpdateCanvases] = useState(true);

  const [createCanvasModalWindowOpen, setCreateCanvasModalWindowOpen] =
    useState(false);

  const [loadCanvases] = useLoadCanvasesMutation();

  useEffect(() => {
    if (!userData) navigate("/login");

    if (shouldUpdateCanvases) {
      loadUserCanvases();

      //Clean current canvas state
      dispatch(setHistory({ position: 0, history: [[]] }));
      dispatch(resetCanvas);
      setShouldUpdateCanvases(false);
    }
  }, [shouldUpdateCanvases]);

  const loadUserCanvases = async () => {
    try {
      const response = await loadCanvases({ page: 1, pageSize: 10 }).unwrap();

      setCanvases(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = () => {
    if (!userData) navigate("/login");
    else {
      setCreateCanvasModalWindowOpen(true);
    }
  };

  const handleClickDel = (id, name) => {
    setDelCanvasName(name);
    setDelCanvasId(id);
    setIsDelModOpen(true);
  };

  return (
    <Stack
      direction="column"
      width="100%"
      alignItems="center"
      mt="30px"
      mb="30px"
      spacing={2}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
      >
        <Typography variant="h2" sx={{ mr: 2 }}>
          My Canvases
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreate}
          startIcon={<AddIcon />}
          sx={{ pl: 5, pr: 5 }}
        >
          Create
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ width: { xs: "100%", md: "80%" } }}>
        {canvases?.map((data) => (
          <Grid item xs={12} sm={6} key={data._id}>
            <CanvasPreview
              canvasData={data}
              handleClickDelete={handleClickDel}
            />
          </Grid>
        ))}
      </Grid>
      <CreateCanvas
        isOpen={createCanvasModalWindowOpen}
        setIsOpen={setCreateCanvasModalWindowOpen}
      />
      <ConfirmCanvasDelete
        isOpen={isDelModOpen}
        setIsOpen={setIsDelModOpen}
        name={delCanvasName}
        id={delCanvasId}
        setDelCanvasName={setDelCanvasName}
        setDelCanvasId={setDelCanvasId}
        setShouldUpdateCanvases={setShouldUpdateCanvases}
      />
    </Stack>
  );
};

export default Canvases;
