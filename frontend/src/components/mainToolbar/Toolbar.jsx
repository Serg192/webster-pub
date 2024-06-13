import React, { useState, useRef } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import {
  Typography,
  Button,
  Popper,
  Box,
  InputBase,
  Paper,
  IconButton,
} from "@mui/material";

import PanoramaIcon from "@mui/icons-material/Panorama";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import FontDownloadRoundedIcon from "@mui/icons-material/FontDownloadRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SimCardDownloadRoundedIcon from "@mui/icons-material/SimCardDownloadRounded";
import FormatSizeRoundedIcon from "@mui/icons-material/FormatSizeRounded";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardIcon from "@mui/icons-material/Keyboard";

import CanvasSettings from "./CanvasSettings";
import Draw from "./Drawing";
import SaveImage from "./SaveImage";
import ImportImage from "./ImportImage";
import Hotkeys from "./Hotkeys";

const Toolbar = ({ stageRef }) => {
  const [selectedOption, setSelectedOption] = useState("settings");
  const fileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  const handleItemClick = (option) => {
    setSelectedOption(option);
  };
  return (
    <div style={{ display: "flex" }}>
      <List
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {[
          {
            label: "Canvas",
            icon: <PanoramaIcon style={{ fontSize: 40 }} />,
            value: "settings",
          },
          {
            label: "Save",
            icon: <DownloadRoundedIcon style={{ fontSize: 40 }} />,
            value: "save",
          },

          {
            label: "Images",
            icon: <AddPhotoAlternateRoundedIcon style={{ fontSize: 40 }} />,
            value: "images",
          },

          {
            label: "Hotkeys",
            icon: <KeyboardIcon style={{ fontSize: 40 }} />,
            value: "hotkeys",
          },
        ].map((item) => (
          <ListItem
            key={item.value}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              cursor: "pointer",
              "&:hover": {
                backgroundColor:
                  selectedOption === item.value ? "#DFB3FF" : "#F2E6FF",
              },
              backgroundColor:
                selectedOption === item.value ? "#DFB3FF" : "inherit",
            }}
            onClick={() => handleItemClick(item.value)}
          >
            {item.icon}
            <Typography>{item.label}</Typography>
          </ListItem>
        ))}
      </List>
      <Divider orientation="vertical" flexItem />
      <Box
        sx={{
          width: 300,
          padding: 2,
          backgroundColor: "#f9f9f9",
          gap: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedOption === "import" && (
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
              onChange={handleFileChange}
            />
          </Box>
        )}
        {selectedOption === "save" && <SaveImage stageRef={stageRef} />}
        {selectedOption === "text" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              disableElevation
              startIcon={<FormatSizeRoundedIcon />}
              onClick={handleClick}
            >
              Add text
            </Button>
            <Popper placement="right" open={open} anchorEl={anchorEl}>
              <Box
                sx={{
                  border: 1,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Typography>Add Tittle</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>Add Subtitle</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>Add regular text</Typography>
              </Box>
            </Popper>
          </Box>
        )}
        {selectedOption === "settings" && <CanvasSettings />}
        {selectedOption === "images" && <ImportImage />}
        {selectedOption === "draw" && <Draw />}
        {selectedOption === "hotkeys" && <Hotkeys />}
      </Box>
    </div>
  );
};

export default Toolbar;
