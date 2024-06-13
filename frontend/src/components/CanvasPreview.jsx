import React, { useState } from "react";
import { Typography, Box, Stack, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const CanvasPreview = ({ canvasData, handleClickDelete }) => {
  const { _id, name, canvasPreviewImg, description, updatedAt } = canvasData;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "150px",
        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Link to={`/edit?canvas=${_id}`}>
          <Stack direction="row" spacing={2}>
            <Box
              component="img"
              sx={{
                height: 100,
                width: 100,
                objectFit: "cover",
              }}
              alt="Canvas thumbnail"
              src={canvasPreviewImg || "https://via.placeholder.com/100"}
            />

            <Stack direction="column" spacing={1}>
              <Typography variant="h4">{name}</Typography>
              <Typography variant="body1">{description}</Typography>
              <Typography variant="body1">
                Last updated:
                {new Date(updatedAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </Typography>
            </Stack>
          </Stack>
        </Link>

        <Button
          color="warning"
          sx={{
            height: "50px",
            width: "50px",
            "&:hover": {
              "& svg": {
                fontSize: "1.1rem",
              },
            },
          }}
          onClick={() => {
            handleClickDelete(_id, name);
          }}
        >
          <FontAwesomeIcon icon={faTrashCan} style={{ color: "red" }} />
        </Button>
      </Stack>
    </Paper>
  );
};

export default CanvasPreview;
