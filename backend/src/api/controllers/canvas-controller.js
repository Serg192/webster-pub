const HttpStatus = require("http-status-codes").StatusCodes;
const { parsePagination } = require("../helpers/pagination-helper");
const canvasService = require("../services/canvas-service");

const createCanvas = async (req, res) => {
  const data = await canvasService.createCanvas(req.body, req.userId);
  return res.status(HttpStatus.CREATED).json({ data });
};

const updateCanvas = async (req, res) => {
  const data = await canvasService.updateCanvas(req.body, req.params.cid);
  return res.status(HttpStatus.OK).json({ data });
};

const getAllCanvases = async (req, res) => {
  const pagination = parsePagination(req);
  const data = await canvasService.getAllCanvases(pagination, req.userId);
  return res.status(HttpStatus.OK).json({ data });
};

const getCanvas = async (req, res) => {
  const data = await canvasService.getCanvasById(req.params.cid);
  return res.status(HttpStatus.OK).json({ data });
};

const undoChange = async (req, res) => {
  const data = await canvasService.undoChange(req.params.cid);
  return res.status(HttpStatus.OK).json({ data });
};

const redoChange = async (req, res) => {
  const data = await canvasService.redoChange(req.params.cid);
  return res.status(HttpStatus.OK).json({ data });
};

const deleteCanvas = async (req, res) => {
  await canvasService.deleteCanvas(req.params.cid);
  return res.status(HttpStatus.OK).json({});
};

const uploadCanvasPreviewImg = async (req, res) => {
  const url = await canvasService.uploadCanvasPreviewImage(
    req.params.cid,
    req.file
  );
  return res.status(HttpStatus.OK).json({ url });
};

const uploadCanvasImage = async (req, res) => {
  const url = await canvasService.uploadCanvasImage(req.params.cid, req.file);
  return res.status(HttpStatus.OK).json({ url });
};

module.exports = {
  createCanvas,
  updateCanvas,
  getAllCanvases,
  getCanvas,
  undoChange,
  redoChange,
  deleteCanvas,
  uploadCanvasPreviewImg,
  uploadCanvasImage,
};
