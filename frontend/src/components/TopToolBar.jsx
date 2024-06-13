import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Konva from "konva";
import {
  faTrashCan,
  faMinus,
  faRotateRight,
  faWrench,
  faArrowRight,
  faArrowLeft,
  faArrowsLeftRightToLine,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import {
  Stack,
  Button,
  Box,
  Typography,
  Tooltip,
  Popover,
  Switch,
  Slider,
  Tabs,
  FormControlLabel,
  Tab,
} from "@mui/material";
import { SketchPicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllSelectedObjects,
  removeObjectFromStage,
  updateStageObject,
  undo,
  redo,
  selectStageObject,
  setStageObjects,
} from "../features/canvas/stageSlice";
import { ShapeType } from "../types";
import TransformationMenu from "./TransformationMenu";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  useRedoChangeMutation,
  useUndoChangeMutation,
} from "../features/canvas/canvasApiSlice";
import { selectCurrentCavasId } from "../features/canvas/canvasSlice";

const iconBtnStyle = {
  m: 0.5,
  color: "black",
  backgroundColor: "transparent",
  width: "50px",
  height: "40px",
  minWidth: "50px",
  minHeight: "40px",
  borderColor: "black",
  border: 1,
  "&:hover": {
    backgroundColor: "lightgray",
  },
};

const TopToolBar = () => {
  const dispatch = useDispatch();
  const objects = useSelector(selectAllSelectedObjects);
  const [somethingSelected, setSomethingSelected] = useState(false);
  const [multipleSelect, setMultipleSelect] = useState(false);
  const [oneTypeSelected, setOneTypeSelected] = useState(false);
  const [selectedShapeType, setSelectedShapeType] = useState(null);
  const [color, setColor] = useState("#000");
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(1);

  const [borderAnchorEl, setBorderAnchorEl] = useState(null);
  const [borderColor, setBorderColor] = useState("#000");
  const [borderWidth, setBorderWidth] = useState(1);

  const [rotationAnchorEl, setRotationAnchorEl] = useState(null);
  const [rotation, setRotation] = useState(0);

  const [flipAnchorEl, setFlipAnchorEl] = useState(null);
  const [isFlippedHorizontally, setIsFlippedHorizontally] = useState(false);
  const [isFlippedVertically, setIsFlippedVertically] = useState(false);

  const [filtersAnchorEl, setFiltersAnchorEl] = useState(null);
  const [opacity, setOpacity] = useState(0);

  const [transformationAnchorEl, setTransformationAnchorEl] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [points, setPoints] = useState(5);

  const cid = useSelector(selectCurrentCavasId);

  const [sUndo] = useUndoChangeMutation();
  const [sRedo] = useRedoChangeMutation();

  const handleUndo = async () => {
    try {
      const response = await sUndo({ id: cid }).unwrap();
      dispatch(setStageObjects({ objects: response.data.currentState }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleRedo = async () => {
    try {
      const response = await sRedo({ id: cid }).unwrap();
      dispatch(setStageObjects({ objects: response.data.currentState }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const selected = objects.length > 0;
    setSomethingSelected(selected);
    setMultipleSelect(objects.length > 1);

    if (selected) {
      const fType = objects[0].type;
      setOneTypeSelected(true);

      for (let o of objects) {
        if (o.type !== fType) {
          setOneTypeSelected(false);
          break;
        }
      }
      setSelectedShapeType(fType);
      setColor(objects[0].fill);
      setBorderColor(objects[0].stroke);
      setBorderWidth(objects[0].strokeWidth);
      setRotation(objects[0].rotation);
      setPos({ x: objects[0].x, y: objects[0].y });

      setSize({
        w: objects[0].width
          ? objects[0].width
          : objects[0].radiusX
          ? objects[0].radiusX
          : objects[0].radius,
        h: objects[0].height ? objects[0].height : objects[0].radiusY,
      });

      setPoints(objects[0].sides);
      setIsFlippedHorizontally(objects[0].scaleX === -1);
      setIsFlippedVertically(objects[0].scaleY === -1);
      setOpacity(objects[0].opacity ? objects[0].opacity : 1);

      if (selectedShapeType === ShapeType.TEXT) {
        setText(objects[0].text);
        setFontSize(objects[0].fontSize);
      }
    }
  }, [objects]);

  const fillSelectedObjects = (color) => {
    setColor(color);

    objects.forEach((obj) => {
      const { id, ...shape } = obj;
      dispatch(updateStageObject({ id, shape: { ...shape, fill: color } }));
    });
  };

  const removeSelectedObjsFromStage = () => {
    const ids = objects.map((obj) => obj.id);

    for (let id of ids) {
      dispatch(removeObjectFromStage({ id }));
    }

    dispatch(selectStageObject(""));
  };

  const handleBorderColorChange = (color) => {
    setBorderColor(color.hex);

    objects.forEach((obj) => {
      const { id, ...shape } = obj;
      dispatch(
        updateStageObject({ id, shape: { ...shape, stroke: color.hex } })
      );
    });
  };

  const handleBorderWidthChange = (event, newValue) => {
    setBorderWidth(newValue);

    objects.forEach((obj) => {
      const { id, ...shape } = obj;
      dispatch(
        updateStageObject({ id, shape: { ...shape, strokeWidth: newValue } })
      );
    });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);

    const { id, ...shape } = objects[0];
    dispatch(
      updateStageObject({ id, shape: { ...shape, text: e.target.value } })
    );
  };

  const handleFontSizeChange = (e) => {
    let value = e.target.value;
    if (value < 1) value = 1;
    if (value >= 400) value = 400;
    setFontSize(value);

    const { id, ...shape } = objects[0];

    dispatch(updateStageObject({ id, shape: { ...shape, fontSize: value } }));
  };

  const handleRotation = (e) => {
    setRotation(e.target.value);

    objects.forEach((obj) => {
      const { id, ...shape } = obj;

      const additionalParams = {};
      if (obj.type === ShapeType.RECTANGLE) {
        additionalParams.offsetX = obj.width / 2;
        additionalParams.offsetY = obj.height / 2;
      }
      dispatch(
        updateStageObject({
          id,
          shape: { ...shape, rotation: e.target.value, ...additionalParams },
        })
      );
    });
  };

  const handleOpacity = (e) => {
    const opacity = e.target.value;
    setOpacity(opacity);

    const { id, ...shape } = objects[0];
    dispatch(updateStageObject({ id, shape: { ...shape, opacity } }));
  };

  const handleTransformationUpdate = ({ x, y, w, h, points }) => {
    const props = { x, y };
    if (selectedShapeType === ShapeType.RECTANGLE) {
      props.width = w;
      props.height = h;
    } else if (selectedShapeType === ShapeType.CIRCLE) {
      props.radiusX = w;
      props.radiusY = h;
    } else if (selectedShapeType === ShapeType.POLYGON) {
      if (points < 3) points = 3;
      else if (points > 12) points = 12;
      props.radius = w;
      props.sides = points;
    } else return;

    objects.forEach((obj) => {
      const { id, ...shape } = obj;
      dispatch(updateStageObject({ id, shape: { ...shape, ...props } }));
    });
  };

  const handleImgFlip = (e) => {
    const { scaleX, scaleY } = e;
    let props = { ...e };

    objects.forEach((obj) => {
      const { id, ...shape } = obj;
      if (scaleX) {
        props.x = scaleX === 1 ? shape.x - shape.width : shape.x + shape.width;
      }

      if (scaleY) {
        props.y =
          scaleY === 1 ? shape.y - shape.height : shape.y + shape.height;
      }
      dispatch(
        updateStageObject({
          id,
          shape: { ...shape, ...props },
        })
      );
    });
  };

  return (
    <Box
      width="100%"
      sx={{
        backgroundColor: "white",
        height: "60px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Stack direction="row">
        <Tooltip title="Undo (Ctrl + Z)">
          <Button
            variant="outlined"
            sx={iconBtnStyle}
            onClick={() => {
              if (cid) {
                handleUndo();
              } else {
                dispatch(undo());
              }
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        </Tooltip>

        <Tooltip title="Redo (Ctrl + Y)">
          <Button
            variant="outlined"
            sx={iconBtnStyle}
            onClick={() => {
              if (cid) {
                handleRedo();
              } else {
                dispatch(redo());
              }
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Tooltip>
      </Stack>

      {somethingSelected && (
        <Stack
          direction="row"
          width="100%"
          height="100%"
          alignItems="center"
          ml={5}
        >
          {selectedShapeType !== ShapeType.IMAGE && (
            <>
              <Tooltip title="Fill color">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => fillSelectedObjects(e.target.value)}
                />
              </Tooltip>

              <Tooltip title="Border">
                <Button
                  variant="outlined"
                  sx={iconBtnStyle}
                  onClick={(event) => setBorderAnchorEl(event.currentTarget)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
              </Tooltip>
            </>
          )}

          {selectedShapeType === ShapeType.IMAGE && (
            <>
              <Tooltip title="Flip image">
                <Button
                  variant="outlined"
                  sx={iconBtnStyle}
                  onClick={(event) => setFlipAnchorEl(event.currentTarget)}
                >
                  <FontAwesomeIcon icon={faArrowsLeftRightToLine} />
                </Button>
              </Tooltip>
              <Tooltip title="Filters">
                <Button
                  variant="outlined"
                  sx={iconBtnStyle}
                  onClick={(event) => setFiltersAnchorEl(event.currentTarget)}
                >
                  <FontAwesomeIcon icon={faSliders} />
                </Button>
              </Tooltip>
            </>
          )}

          <Popover
            id={Boolean(flipAnchorEl) ? "flip-popover" : undefined}
            open={Boolean(flipAnchorEl)}
            anchorEl={flipAnchorEl}
            onClose={() => setFlipAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack direction="column" p={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isFlippedHorizontally}
                    onChange={() => {
                      const props = {
                        scaleX: !isFlippedHorizontally ? -1 : 1,
                      };

                      handleImgFlip(props);
                      setIsFlippedHorizontally(!isFlippedHorizontally);
                    }}
                  />
                }
                label="Flip horizontally"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={isFlippedVertically}
                    onClick={() => {
                      const props = {
                        scaleY: !isFlippedVertically ? -1 : 1,
                      };

                      handleImgFlip(props);

                      setIsFlippedVertically(!isFlippedVertically);
                    }}
                  />
                }
                label="Flip vertically"
              />
            </Stack>
          </Popover>

          <Popover
            id={Boolean(filtersAnchorEl) ? "filters-popover" : undefined}
            open={Boolean(filtersAnchorEl)}
            anchorEl={filtersAnchorEl}
            onClose={() => setFiltersAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack direction="column" p={2} minWidth={200}>
              <Typography variant="body1">: Opacity: {opacity}</Typography>
              <Slider
                value={opacity}
                onChange={handleOpacity}
                min={0}
                max={1}
                step={0.1}
              />
            </Stack>
          </Popover>

          <Popover
            id={Boolean(borderAnchorEl) ? "border-popover" : undefined}
            open={Boolean(borderAnchorEl)}
            anchorEl={borderAnchorEl}
            onClose={() => setBorderAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box sx={{ padding: 2 }}>
              <Typography variant="body1">Border width:</Typography>
              <Slider
                value={borderWidth}
                onChange={handleBorderWidthChange}
                aria-labelledby="border-width-slider"
                min={0}
                max={20}
              />
              <SketchPicker
                color={borderColor}
                onChange={handleBorderColorChange}
              />
            </Box>
          </Popover>

          <Tooltip title="Rotate">
            <Button
              variant="outlined"
              sx={iconBtnStyle}
              onClick={(event) => setRotationAnchorEl(event.currentTarget)}
            >
              <FontAwesomeIcon icon={faRotateRight} />
            </Button>
          </Tooltip>

          <Popover
            id={Boolean(rotationAnchorEl) ? "rotation-popover" : undefined}
            open={Boolean(rotationAnchorEl)}
            anchorEl={rotationAnchorEl}
            onClose={() => setRotationAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box sx={{ padding: 2 }} minWidth={200}>
              <Typography variant="body1">Degrees: {rotation}</Typography>
              <Slider
                value={rotation}
                onChange={handleRotation}
                aria-labelledby="border-width-slider"
                min={0}
                max={360}
                step={1}
              />

              <input
                type="number"
                min="0"
                max="360"
                value={rotation}
                onChange={handleRotation}
              />
            </Box>
          </Popover>

          {selectedShapeType === ShapeType.TEXT && !multipleSelect && (
            <Stack direction="row" spacing={1} ml={5}>
              <Tooltip title="Text input">
                <input
                  type="text"
                  placeholder="Enter text..."
                  value={text}
                  onChange={handleTextChange}
                />
              </Tooltip>

              <Tooltip title="Font size">
                <input
                  type="number"
                  min="1"
                  max="400"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                />
              </Tooltip>
            </Stack>
          )}

          {(selectedShapeType === ShapeType.RECTANGLE ||
            selectedShapeType === ShapeType.CIRCLE ||
            selectedShapeType === ShapeType.POLYGON) &&
            oneTypeSelected && (
              <Tooltip title="Transformation">
                <Button
                  variant="outlined"
                  sx={iconBtnStyle}
                  onClick={(event) =>
                    setTransformationAnchorEl(event.currentTarget)
                  }
                >
                  <FontAwesomeIcon icon={faWrench} />
                </Button>
              </Tooltip>
            )}

          <Popover
            id={
              Boolean(transformationAnchorEl)
                ? "transformation-popover"
                : undefined
            }
            open={Boolean(transformationAnchorEl)}
            anchorEl={transformationAnchorEl}
            onClose={() => setTransformationAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <TransformationMenu
              selectedShapeType={selectedShapeType}
              pos={pos}
              size={size}
              setPos={setPos}
              setSize={setSize}
              points={points}
              setPoints={setPoints}
              handleTransformationUpdate={handleTransformationUpdate}
            />
          </Popover>

          <Tooltip title="Delete shape (Del)">
            <Button
              variant="outlined"
              sx={iconBtnStyle}
              onClick={removeSelectedObjsFromStage}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </Tooltip>
        </Stack>
      )}
    </Box>
  );
};

export default TopToolBar;
