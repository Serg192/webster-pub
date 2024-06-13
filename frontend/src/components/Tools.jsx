import React from "react";
import { useDispatch } from "react-redux";
import { setTool } from "../features/canvas/stageSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowPointer,
  faHand,
  faSquare,
  faCircle,
  faA,
  faPencil,
  faStar,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Tool } from "../types";
import Button from "@mui/material/Button";
import { Stack, Tooltip } from "@mui/material";

const tools = [
  { id: Tool.POINTER, icon: faArrowPointer, hotkey: "(Alt + Q)" },
  { id: Tool.GRAB, icon: faHand, hotkey: "(Alt + W)" },
  { id: Tool.RECTANGLE, icon: faSquare, hotkey: "(Alt + Z)" },
  { id: Tool.POLYGON, icon: faStar, hotkey: "(Alt + X)" },
  { id: Tool.CIRCLE, icon: faCircle, hotkey: "(Alt + C)" },
  { id: Tool.ARROW, icon: faArrowRight, hotkey: "(Alt + V)" },
  { id: Tool.TEXT, icon: faA, hotkey: "(Alt + B)" },
  { id: Tool.PENCIL, icon: faPencil, hotkey: "(Alt + N)" },
];

const Tools = ({ active }) => {
  const dispatch = useDispatch();

  return (
    <div className="toolbar">
      <Stack direction="column" spacing={1} p={1}>
        {tools.map((tool) => (
          <Tooltip title={`${tool.id.toLocaleLowerCase()} ${tool.hotkey}`} placement="right">
            <Button
              key={tool.id}
              variant="outlined"
              sx={{
                color: active === tool.id ? "white" : "black",
                backgroundColor: active === tool.id ? "black" : "transparent",
                width: "50px",
                height: "50px",
                minWidth: "50px",
                minHeight: "50px",
                borderColor: "black",
                "&:hover": {
                  backgroundColor:
                    active === tool.id ? "darkgray" : "lightgray",
                },
              }}
              onClick={() => dispatch(setTool({ tool: tool.id }))}
            >
              <FontAwesomeIcon icon={tool.icon} />
            </Button>
          </Tooltip>
        ))}
      </Stack>
    </div>
  );
};

export default Tools;
