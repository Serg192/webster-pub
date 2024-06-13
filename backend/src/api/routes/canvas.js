const express = require("express");

const vSchema = require("../validations/canvas-validation");
const { validate } = require("../middlewares/validate-mid");
const { catchAsyncErr } = require("../middlewares/error-boundary");
const { canvasOwner } = require("../middlewares/canvas-guard-mid");
const uploadImage = require("../middlewares/file-upload-mid");
const canvasController = require("../controllers/canvas-controller");

const router = express.Router();

router.post(
  "/",
  validate(vSchema.CreateCanvas),
  catchAsyncErr(canvasController.createCanvas)
);

router.patch(
  "/:cid",
  canvasOwner,
  validate(vSchema.UpdateCanvas),
  catchAsyncErr(canvasController.updateCanvas)
);

router.post(
  "/:cid/image",
  canvasOwner,
  uploadImage,
  catchAsyncErr(canvasController.uploadCanvasPreviewImg)
);

router.post(
  "/:cid/stage-image",
  canvasOwner,
  uploadImage,
  catchAsyncErr(canvasController.uploadCanvasImage)
);

router.get("/:cid", canvasOwner, catchAsyncErr(canvasController.getCanvas));

router.get("/", catchAsyncErr(canvasController.getAllCanvases));

router.post(
  "/:cid/undo",
  canvasOwner,
  catchAsyncErr(canvasController.undoChange)
);

router.post(
  "/:cid/redo",
  canvasOwner,
  catchAsyncErr(canvasController.redoChange)
);

router.delete(
  "/:cid",
  canvasOwner,
  catchAsyncErr(canvasController.deleteCanvas)
);

module.exports = router;
